from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL")
IMAGE_FOLDER = os.getenv("IMAGE_FOLDER")


return_image_router = APIRouter()


@return_image_router.get("/next-image/{person_name}/")
def serve_next_image(person_name: str):
    """Fetches the first available image from the given person's folder."""
    person_folder = os.path.join(IMAGE_FOLDER, person_name)

    # Check if the folder exists
    if not os.path.exists(person_folder) or not os.path.isdir(person_folder):
        raise HTTPException(status_code=404, detail="Person not found")

    # Get the list of images in the folder
    images = sorted([f for f in os.listdir(person_folder) if f.endswith((".jpg", ".png", ".jpeg"))])

    if not images:
        raise HTTPException(status_code=404, detail="No more images available")

    # Pick the first image
    image_name = images[0]
    image_url = f"{BASE_URL}{person_name}/{image_name}"

    return {"image_url": image_url}