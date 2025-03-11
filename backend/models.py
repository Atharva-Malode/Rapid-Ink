from pydantic import BaseModel

class Point(BaseModel):
    img: str
    x: float
    y: float

# Pydantic model for input validation
class LabelInput(BaseModel):
    name: str
    color: str
    index: int
