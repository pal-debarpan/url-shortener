from fastapi import FastAPI

from app.routers.urls import router as urls_router


app = FastAPI(title="URL Shortener API")

app.include_router(urls_router)


@app.get("/")
def root():
    return {"message": "URL Shortener API is running"}