from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import URL
from app.schemas import URLCreate, URLResponse
from app.utils import generate_short_code

app = FastAPI(title="URL Shortener API")



@app.get("/")
def root():
    return {"message": "URL Shortener API is running"}


@app.post("/api/v1/urls", response_model=URLResponse)
def create_url(
    url_data: URLCreate,
    db: Session = Depends(get_db)
):
    short_code = generate_short_code()

    new_url = URL(
        original_url=str(url_data.original_url),
        short_code=short_code
    )

    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    return new_url

@app.get("/{short_code}")
def redirect_to_original(
    short_code: str,
    db: Session = Depends(get_db)
):
    url = db.query(URL).filter(URL.short_code == short_code).first()

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )
    url.click_count += 1
    db.commit()

    return RedirectResponse(
        url=url.original_url,
        status_code=307
    )