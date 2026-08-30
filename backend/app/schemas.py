from pydantic import BaseModel, HttpUrl, Field


class URLCreate(BaseModel):
    original_url: HttpUrl
    custom_alias: str | None = Field(
        default=None,
        min_length=3,
        max_length=30,
        pattern=r"^[a-zA-Z0-9_-]+$",
        examples=["my-link"]
    )


class URLResponse(BaseModel):
    id: int
    original_url: str
    short_code: str
    short_url: str
    click_count: int

    class Config:
        from_attributes = True