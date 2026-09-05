import os
from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend/.env relative to security.py location
backend_env = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=backend_env)
load_dotenv()



pwd_context = CryptContext(
    schemes=['bcrypt'],
    deprecated="auto"
)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )