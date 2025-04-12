from pydantic import EmailStr
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "test"  # Должен быть сложным!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 365

async def create_token(user_email: str) -> str:
    payload = {
        "sub": user_email,
        "exp": datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS),
        "type": "access"
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def verify_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.JWTError:
        return None
