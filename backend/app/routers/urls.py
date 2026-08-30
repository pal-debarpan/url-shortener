from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas import URLCreate, URLResponse
from app.services.url_service import create_short_url, get_url_increment_clicks, get_url_short_code
from app.models import URL

api_router = APIRouter(prefix="/api/v1")
redirect_router = APIRouter()


@api_router.post("/urls", response_model=URLResponse)
def create_url(
    request: Request,
    url_data: URLCreate,
    db: Session = Depends(get_db)
):
    try:
        new_url = create_short_url(
            db,
            str(url_data.original_url),
            url_data.custom_alias
        )
    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail=str(e)
        )

    short_url = str(request.base_url) + new_url.short_code
    return {
        "id": new_url.id,
        "original_url": new_url.original_url,
        "short_code": new_url.short_code,
        "short_url": short_url,
        "click_count": new_url.click_count
    }
    

@redirect_router.get("/{short_code}")
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

@api_router.get("/urls/{short_code}", response_model=URLResponse)
def get_url_info(
    short_code: str,
    request: Request,
    db: Session = Depends(get_db)
):
    url = get_url_short_code(db, short_code)

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    short_url = str(request.base_url) + short_code

    return {
        "id": url.id,
        "original_url": url.original_url,
        "short_code": url.short_code,
        "short_url": short_url,
        "click_count": url.click_count
    }