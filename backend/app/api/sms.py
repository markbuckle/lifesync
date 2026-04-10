from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.sms_service import build_twiml_response
from app.models.sms_conversation import SMSConversation
from app.models.user import User
from app.models.appointment import Appointment
from app.core.config import settings
from datetime import datetime, date
import re

router = APIRouter(prefix="/sms", tags=["sms"])


def get_or_create_conversation(
    db: Session,
    phone_number: str
) -> SMSConversation:
    """Get existing conversation state or create a new one."""
    conv = db.query(SMSConversation).filter(
        SMSConversation.phone_number == phone_number
    ).first()
    if not conv:
        conv = SMSConversation(phone_number=phone_number)
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return conv


def find_user_by_phone(db: Session, phone_number: str):
    """Temporarily match SMS to a specific user by email.
    TODO: Replace with phone number field on User model.
    """
    # Your personal number maps to your account
    phone_to_email = {
        settings.MY_PHONE_NUMBER: settings.MY_EMAIL,
    }
    email = phone_to_email.get(phone_number)
    if email:
        return db.query(User).filter(User.email == email).first()
    # Fallback to first active user
    return db.query(User).filter(User.is_active == True).first()


def parse_date(text: str):
    """Try to parse a date from natural language text."""
    text = text.lower().strip()
    today = date.today()

    if 'today' in text:
        return today.isoformat()
    if 'tomorrow' in text:
        from datetime import timedelta
        return (today + timedelta(days=1)).isoformat()

    # Try common formats: "Jan 15", "January 15", "15/01", "01/15"
    patterns = [
        r'(\d{1,2})[/\-](\d{1,2})',           # 01/15 or 15-01
        r'(\w+ \d{1,2})',                       # January 15
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            try:
                parsed = datetime.strptime(
                    match.group(0), '%B %d'
                ).replace(year=today.year)
                return parsed.date().isoformat()
            except ValueError:
                pass
    return None


def parse_time(text: str):
    """Try to parse a time from text."""
    text = text.lower().strip()

    # Match patterns like "2pm", "2:30pm", "14:00", "2 pm"
    pattern = r'(\d{1,2})(?::(\d{2}))?\s*(am|pm)?'
    match = re.search(pattern, text)
    if match:
        hour = int(match.group(1))
        minute = match.group(2) or '00'
        period = match.group(3)

        if period == 'pm' and hour != 12:
            hour += 12
        elif period == 'am' and hour == 12:
            hour = 0

        try:
            time_obj = datetime.strptime(
                f"{hour}:{minute}", '%H:%M'
            )
            return time_obj.strftime('%I:%M %p').lstrip('0')
        except ValueError:
            pass
    return None


def parse_appointment_type(text: str) -> str:
    """Detect appointment type from text."""
    text = text.lower()
    if any(w in text for w in ['doctor', 'dentist', 'medical', 'clinic', 'health']):
        return 'doctor'
    if any(w in text for w in ['meeting', 'call', 'standup', 'sync', 'interview']):
        return 'meeting'
    if any(w in text for w in ['work', 'office', 'client', 'project', 'deadline']):
        return 'work'
    return 'personal'


TYPE_COLORS = {
    'doctor': '#10B981',
    'meeting': '#3B82F6',
    'work': '#B85C38',
    'personal': '#8B5CF6',
}


@router.post("/webhook")
async def sms_webhook(
    request: Request,
    From: str = Form(...),
    Body: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Main Twilio webhook endpoint.
    Twilio sends a POST request here every time someone
    texts your Twilio number.
    """
    phone_number = From.strip()
    message = Body.strip()
    msg_lower = message.lower()

    # Get or create conversation state for this number
    conv = get_or_create_conversation(db, phone_number)

    # Find associated LifeSync user
    user = find_user_by_phone(db, phone_number)

    # ── State Machine ────────────────────────────────────

    # IDLE state — waiting for initial message
    if conv.state == 'idle':
        if any(w in msg_lower for w in ['book', 'schedule', 'appointment', 'new', 'add']):
            conv.state = 'awaiting_title'
            db.commit()
            reply = (
                "👋 Welcome to LifeSync!\n\n"
                "Let's book an appointment. What is it for?\n\n"
                "e.g. Dentist, Team Meeting, Doctor checkup"
            )
        elif any(w in msg_lower for w in ['help', 'hi', 'hello', 'hey', 'start']):
            reply = (
                 "Hi! LifeSync booking assistant.\n"
                 "Text BOOK to schedule.\n"
                 "Text LIST to see appointments.\n"
                 "Text CANCEL to cancel."
            )
        elif 'list' in msg_lower and user:
            # Show upcoming appointments
            appointments = db.query(Appointment).filter(
                Appointment.user_id == user.id,
                Appointment.date >= date.today().isoformat()
            ).order_by(Appointment.date).limit(5).all()

            if not appointments:
                reply = "📅 You have no upcoming appointments."
            else:
                lines = ["📅 Your upcoming appointments:\n"]
                for apt in appointments:
                    lines.append(f"• {apt.title} — {apt.date} at {apt.time}")
                reply = "\n".join(lines)
        else:
            reply = (
                "Text BOOK to schedule an appointment or HELP for options."
            )

    # AWAITING_TITLE — we asked what the appointment is for
    elif conv.state == 'awaiting_title':
        if 'cancel' in msg_lower:
            conv.state = 'idle'
            conv.pending_title = None
            db.commit()
            reply = "❌ Booking cancelled. Text *book* to start again."
        else:
            conv.pending_title = message
            conv.pending_type = parse_appointment_type(message)
            conv.state = 'awaiting_date'
            db.commit()
            reply = (
                f"Got it — *{message}* 👍\n\n"
                "What date would you like?\n\n"
                "e.g. Today, Tomorrow, Jan 15"
            )

    # AWAITING_DATE — we asked for the date
    elif conv.state == 'awaiting_date':
        if 'cancel' in msg_lower:
            conv.state = 'idle'
            conv.pending_title = None
            db.commit()
            reply = "❌ Booking cancelled. Text *book* to start again."
        else:
            parsed_date = parse_date(message)
            if parsed_date:
                conv.pending_date = parsed_date
                conv.state = 'awaiting_time'
                db.commit()

                # Format date nicely for confirmation
                display_date = datetime.strptime(
                    parsed_date, '%Y-%m-%d'
                ).strftime('%A, %B %-d')

                reply = (
                    f"📅 {display_date} — perfect!\n\n"
                    "What time would you like?\n\n"
                    "e.g. 2pm, 10:30am, 14:00"
                )
            else:
                reply = (
                    "I didn't catch that date 😅\n\n"
                    "Please try again, e.g:\n"
                    "• Today\n• Tomorrow\n• Jan 15"
                )

    # AWAITING_TIME — we asked for the time
    elif conv.state == 'awaiting_time':
        if 'cancel' in msg_lower:
            conv.state = 'idle'
            conv.pending_title = None
            db.commit()
            reply = "❌ Booking cancelled. Text *book* to start again."
        else:
            parsed_time = parse_time(message)
            if parsed_time:
                conv.pending_time = parsed_time
                conv.state = 'awaiting_confirmation'
                db.commit()

                display_date = datetime.strptime(
                    conv.pending_date, '%Y-%m-%d'
                ).strftime('%A, %B %-d')

                reply = (
                    f"Summary:\n"
                    f"{conv.pending_title}\n"
                    f"{display_date}\n"
                    f"{conv.pending_time}\n\n"
                    f"Reply YES to confirm or NO to cancel."
                )
            else:
                reply = (
                    "I didn't catch that time 😅\n\n"
                    "Please try again, e.g:\n"
                    "• 2pm\n• 10:30am\n• 14:00"
                )

    # AWAITING_CONFIRMATION — we showed summary, waiting for yes/no
    elif conv.state == 'awaiting_confirmation':
        if any(w in msg_lower for w in ['yes', 'y', 'confirm', 'ok', 'yep', 'sure']):
            if user and conv.pending_title and conv.pending_date and conv.pending_time:
                # Create the appointment in the database
                apt_type = conv.pending_type or 'personal'
                # Convert date string to Python date object

                appointment_date = datetime.strptime(
                    conv.pending_date, '%Y-%m-%d'
                ).date()

                new_appointment = Appointment(
                    user_id=user.id,
                    title=conv.pending_title,
                    date=appointment_date,
                    time=conv.pending_time,
                    type=apt_type,
                    color=TYPE_COLORS.get(apt_type, '#B85C38'),
                    notes=f"Booked via SMS from {phone_number}",
                )
                db.add(new_appointment)

                # Reset conversation state
                conv.state = 'idle'
                conv.pending_title = None
                conv.pending_date = None
                conv.pending_time = None
                conv.pending_type = None
                db.commit()

                display_date = appointment_date.strftime('%A, %B %-d')

                reply = (
                    f"Booked!\n"
                    f"{new_appointment.title}\n"
                    f"{display_date}\n"
                    f"{new_appointment.time}\n\n"
                    f"View in LifeSync app."
                )
            else:
                reply = (
                    "Something went wrong booking your appointment. "
                    "Please text *book* to try again."
                )
                conv.state = 'idle'
                db.commit()

        elif any(w in msg_lower for w in ['no', 'n', 'cancel', 'nope']):
            conv.state = 'idle'
            conv.pending_title = None
            conv.pending_date = None
            conv.pending_time = None
            conv.pending_type = None
            db.commit()
            reply = "❌ Booking cancelled. Text *book* to start again."
        else:
            reply = "Please reply *yes* to confirm or *no* to cancel."

    else:
        # Unknown state — reset
        conv.state = 'idle'
        db.commit()
        reply = "Something went wrong. Text *book* to start fresh."

    # Return TwiML response to Twilio
    return Response(
        content=build_twiml_response(reply),
        media_type="application/xml"
    )