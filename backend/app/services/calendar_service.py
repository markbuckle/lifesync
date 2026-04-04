from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from app.core.config import settings

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']


def _create_flow() -> Flow:
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [settings.GOOGLE_REDIRECT_URI],
        }
    }
    return Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )


def get_authorization_url(state: str) -> str:
    flow = _create_flow()
    auth_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        state=state,
        prompt='consent',
    )
    return auth_url


def exchange_code(code: str) -> dict:
    flow = _create_flow()
    flow.fetch_token(code=code)
    creds = flow.credentials
    return {
        'refresh_token': creds.refresh_token,
        'token': creds.token,
    }


def fetch_calendar_info(refresh_token: str) -> dict:
    """Fetch the user's primary calendar email and upcoming event count."""
    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=SCOPES,
    )
    service = build('calendar', 'v3', credentials=creds, cache_discovery=False)

    # Primary calendar gives us the connected email
    calendar = service.calendars().get(calendarId='primary').execute()
    email = calendar.get('id', '')

    # Count upcoming events (next 100)
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat()
    events_result = service.events().list(
        calendarId='primary',
        timeMin=now,
        maxResults=100,
        singleEvents=True,
        orderBy='startTime',
    ).execute()

    return {
        'email': email,
        'synced_events': len(events_result.get('items', [])),
    }


def fetch_upcoming_events(refresh_token: str, max_results: int = 50) -> list:
    """Return upcoming Google Calendar events as a list of dicts."""
    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=SCOPES,
    )
    service = build('calendar', 'v3', credentials=creds, cache_discovery=False)

    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat()
    events_result = service.events().list(
        calendarId='primary',
        timeMin=now,
        maxResults=max_results,
        singleEvents=True,
        orderBy='startTime',
    ).execute()

    events = []
    for item in events_result.get('items', []):
        start = item.get('start', {})
        events.append({
            'id': item.get('id'),
            'title': item.get('summary', '(No title)'),
            'start': start.get('dateTime') or start.get('date'),
            'all_day': 'date' in start and 'dateTime' not in start,
            'color': '#4285F4',
        })
    return events
