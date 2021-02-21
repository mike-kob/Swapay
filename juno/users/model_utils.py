from secrets import token_urlsafe


def generate_confirmation_token():
    from users.models import EmailConfirmation

    res = token_urlsafe(128)
    while EmailConfirmation.objects.filter(token=res).exists():
        res = token_urlsafe(128)

    return res
