from django.forms.utils import ErrorDict


def get_gql_errors(errors: ErrorDict) -> str:
    res = []
    for field, filed_errors in errors.items():
        for error_msg in filed_errors:
            res.append(error_msg)

    return "\n".join(res)


def get_gql_errors_dict(errors: ErrorDict) -> dict:
    res = {}
    for field, filed_errors in errors.items():
        field_res = []
        for error_msg in filed_errors:
            field_res.append(error_msg)
        res[field] = "\n".join(field_res)

    return res
