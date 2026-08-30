from fastapi import FastAPI

from app.routers.urls import api_router, redirect_router



app = FastAPI(title="URL Shortener API")

app.include_router(api_router)
app.include_router(redirect_router)


@app.get("/")
def root():
    return {"message": "URL Shortener API is running"}