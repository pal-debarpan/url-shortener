from sqlalchemy.orm import Session

from app.models import URL
from app.utils import generate_short_code

from typing import Optional

def create_short_url(db: Session, original_url: str) -> URL:
    while True:
        short_code = generate_short_code()

        existing_url = (
            db.query(URL).filter(URL.short_code == short_code).first()
        )

        if not existing_url:
            break

    new_url = URL(
        original_url=original_url,
        short_code=short_code
    )

    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    return new_url

def get_url_increment_clicks(
        db: Session,
        short_code: str
) -> Optional[URL]:
    url = (
        db.query(URL).filter(URL.short_code == short_code).first()
    )

    if not url:
        return None

    url.click_count += 1
    db.commit()

    return url

def get_url_short_code(
        db: Session,
        short_code: str
) -> Optional[URL]:
    return (
        db.query(URL).filter(URL.short_code == short_code).first()
    )