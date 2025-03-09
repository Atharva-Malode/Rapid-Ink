from pydantic import BaseModel

class Point(BaseModel):
    img: str
    x: float
    y: float
