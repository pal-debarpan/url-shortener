from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user_id
from app.schemas.url import URLCreate, URLResponse, URLStatsResponse
from app.services.url_service import create_short_url, get_url_increment_clicks, get_url_short_code, delete_url, get_user_urls
from app.models import URL

api_router = APIRouter(prefix="/api/v1")
redirect_router = APIRouter()


@api_router.post("/urls", response_model=URLResponse)
def create_url(
    request: Request,
    url_data: URLCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    try:
        new_url = create_short_url(
            db,
            str(url_data.original_url),
            url_data.custom_alias,
            current_user_id
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


@api_router.get("/urls", response_model=list[URLResponse])
def get_my_urls(
    request: Request,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    urls = get_user_urls(db, current_user_id)

    result = []

    for url in urls:
        short_url = str(request.base_url) + url.short_code

        result.append({
            "id": url.id,
            "original_url": url.original_url,
            "short_code": url.short_code,
            "short_url": short_url,
            "click_count": url.click_count
        })

    return result
    

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
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    url = get_url_short_code(db, short_code)

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    if url.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this URL"
        )

    short_url = str(request.base_url) + short_code

    return {
        "id": url.id,
        "original_url": url.original_url,
        "short_code": url.short_code,
        "short_url": short_url,
        "click_count": url.click_count
    }

@api_router.get(
    "/urls/{short_code}/stats",
    response_model=URLStatsResponse
)
def get_url_stats(
    short_code: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    url = get_url_short_code(db, short_code)

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    if url.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this URL"
        )

    return url

@api_router.delete("/urls/{short_code}")
def delete_short_url(
    short_code: str,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    url = get_url_short_code(db, short_code)

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    if url.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this URL"
        )

    db.delete(url)
    db.commit()

    return {
        "message": "Short URL deleted succesfully"
    }