from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from app.core.config import settings


def send_sms(to: str, message: str) -> bool:
    """Send an outbound SMS via Twilio."""
    try:
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )
        client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to
        )
        return True
    except Exception as e:
        print(f"SMS send error: {e}")
        return False


def build_twiml_response(message: str) -> str:
    """Build a TwiML response to reply directly to an inbound SMS."""
    response = MessagingResponse()
    response.message(message)
    return str(response)