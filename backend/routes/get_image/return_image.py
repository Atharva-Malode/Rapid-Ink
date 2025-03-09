from fastapi import APIRouter, HTTPException
from utils.return_image_function import get_next_image
from dotenv import load_dotenv
import os

load_dotenv()
return_image_router = APIRouter()

IMAGE_FOLDER = os.getenv("IMAGE_FOLDER")
BASE_URL = os.getenv("BASE_URL")

@return_image_router.get("/next-image/")
def serve_next_image():
    """Returns the next image URL to the frontend."""
    image_name = get_next_image()
    image_path = os.path.join(IMAGE_FOLDER, image_name)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="No more images available")

    return {"image_url": f"{BASE_URL}{image_name}"}
