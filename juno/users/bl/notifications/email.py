import logging
from typing import Dict, Any

from django.conf import settings
from sendgrid import SendGridAPIClient, TemplateId
from sendgrid.helpers.mail import Mail

from users.bl.notifications.email_constants import BASE_EMAIL

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        self.client = sg

    def send_email(
        self, email: str, template_id: TemplateId, data: Dict[str, Any], subject=None, success=None
    ):
        try:
            message = Mail(
                from_email=BASE_EMAIL,
                to_emails=email,
            )
            if subject:
                message.subject = subject
            message.template_id = template_id
            message.dynamic_template_data = data
            self.client.send(message)
            if success and callable(success):
                success()
        except Exception as e:
            logger.exception(e)
