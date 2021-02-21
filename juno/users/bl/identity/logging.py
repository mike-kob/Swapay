from model_utils import Choices

from users.models import User, AccountHistoryLog


def log_account_event(user: User, action: Choices, data: dict = None):
    log = AccountHistoryLog(
        user=user,
        action=action,
    )
    if data:
        log.extra = data

    log.save()
