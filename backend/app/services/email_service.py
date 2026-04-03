import resend
from app.core.config import settings


def send_password_reset_email(to_email: str, reset_link: str, expires_in_hours: int = 1) -> bool:
    """
    Send a password reset email via Resend.
    Returns True on success, False if sending fails (so the caller can fall back to logging).
    """
    if not settings.RESEND_API_KEY:
        return False

    resend.api_key = settings.RESEND_API_KEY

    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 16px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px;">Reset your password</h1>
        <p style="color: #6b7280; font-size: 15px; margin: 0 0 28px;">
          We received a request to reset the password for your LifeSync account.
          Click the button below to choose a new password.
        </p>
        <a href="{reset_link}"
           style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none;
                  font-weight: 600; font-size: 15px; padding: 12px 28px; border-radius: 8px;">
          Reset password
        </a>
        <p style="color: #9ca3af; font-size: 13px; margin: 28px 0 0;">
          This link expires in {expires_in_hours} hour{"s" if expires_in_hours != 1 else ""}.
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 16px;" />
        <p style="color: #d1d5db; font-size: 12px; margin: 0;">
          If the button doesn't work, copy and paste this link:<br />
          <span style="color: #6b7280; word-break: break-all;">{reset_link}</span>
        </p>
      </div>
    </body>
    </html>
    """

    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [to_email],
            "subject": "Reset your LifeSync password",
            "html": html,
        })
        return True
    except Exception as e:
        print(f"[email_service] Failed to send reset email to {to_email}: {e}")
        return False
