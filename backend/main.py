import os
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



IMAGE_FOLDER = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\data"  # Folder where images are stored
TRACK_FILE = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\backend\utils\last_image.txt"   # File tracking the last image sent
BASE_URL = "http://localhost:8000/images/"  # Change this to your actual URL


# Mount the image folder so files can be accessed via http://localhost:8000/images/
app.mount("/images", StaticFiles(directory=IMAGE_FOLDER), name="images")


def get_next_image():
    """Reads the last image ID, increments it, and updates the tracking file."""
    with open(TRACK_FILE, "r+") as f:
        last_id = int(f.read().strip())  # Read last used image ID
        new_id = last_id + 1             # Increment image ID
        f.seek(0)
        f.write(str(new_id))             # Save new ID
        f.truncate()
    return f"{last_id}.jpg"  # Return image filename

@app.get("/next-image/")
def serve_next_image():
    """Returns the next image URL to the frontend."""
    image_name = get_next_image()
    image_path = os.path.join(IMAGE_FOLDER, image_name)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="No more images available")

    return {"image_url": f"{BASE_URL}{image_name}"}




# Define the Pydantic model for receiving a point
# Define a Pydantic model for incoming box data
class Point(BaseModel):
    x: float
    y: float

@app.post("/boxes")
async def get_boxes(points: List[Point]):  # Expecting a list of points
    print("Received points:", points)
    return {"message": "Points received", "points": points}

    
