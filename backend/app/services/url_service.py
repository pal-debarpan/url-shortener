from sqlalchemy.orm import Session

from app.models import URL
from app.utils import generate_short_code

from typing import Optional

def create_short_url(db: Session, original_url: str, custom_alias: Optional[str] = None, user_id: int = None) -> URL:

    if custom_alias:
        existing_url = (
            db.query(URL).filter(URL.short_code == custom_alias).first()
        )

        if existing_url:
            raise ValueError("Custom alias already exists")

        short_code = custom_alias

    

    else:
        while True:
            short_code = generate_short_code()

            existing_url = (
                db.query(URL).filter(URL.short_code == short_code).first()
            )

            if not existing_url:
                break

    new_url = URL(
        original_url=original_url,
        short_code=short_code,
        user_id=user_id
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


def get_user_urls(
        db: Session,
        user_id: int
) -> list[URL]:
    return (
        db.query(URL).filter(URL.user_id == user_id).all()
    )


def delete_url(
        db: Session,
        short_code: str
) -> bool:
    url = (
        db.query(URL).filter(URL.short_code == short_code).first()
    )

    if not url:
        return False

    db.delete(url)
    db.commit()

    return True