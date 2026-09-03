from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.urls import api_router, redirect_router
from app.routers.auth import router as auth_router

app = FastAPI(title="URL Shortener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(redirect_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "URL Shortener API is running"}
