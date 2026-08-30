from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas import URLCreate, URLResponse
from app.services.url_service import create_short_url, get_url_increment_clicks
from app.models import URL

router = APIRouter()


@router.post("/api/v1/urls", response_model=URLResponse)
def create_url(
    url_data: URLCreate,
    db: Session = Depends(get_db)
):
    return create_short_url(
        db,
        str(url_data.original_url)
    )


@router.get("/{short_code}")
def redirect_to_original(
    short_code: str,
    db: Session = Depends(get_db)
):
    url = get_url_increment_clicks(db, short_code)


    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    return RedirectResponse(
        url=url.original_url,
        status_code=307
    )