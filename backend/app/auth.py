import hmac
import hashlib
from urllib.parse import parse_qs
from app.config import settings

def validate_init_data(init_data: str) -> bool:
    parsed = parse_qs(init_data)
    hash_value = parsed.pop('hash', [None])[0]
    if not hash_value:
        return False
    data_check_string = '\n'.join(f"{k}={v[0]}" for k, v in sorted(parsed.items()))
    secret_key = hmac.new(
        key=b"WebAppData",
        msg=settings.BOT_TOKEN.encode(),
        digestmod=hashlib.sha256
    ).digest()
    computed_hash = hmac.new(
        key=secret_key,
        msg=data_check_string.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()
    return computed_hash == hash_value