from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import engine
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