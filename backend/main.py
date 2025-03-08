import os
import sys
import cv2
import torch
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

# Add SAM2 model path
sys.path.append(r'C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\sam2\sam2')

# FastAPI app setup
app = FastAPI()

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths & Constants
IMAGE_FOLDER = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\data"
TRACK_FILE = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\Rapid-Ink\backend\utils\last_image.txt"
BASE_URL = "http://localhost:8000/images/"

# Model Setup
device = torch.device("cpu")
print(f"Using device: {device}")

checkpoint = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\sam2\sam2\checkpoints\sam2.1_hiera_large.pt"
model_cfg = r"C:\Users\athar\OneDrive\Desktop\Atharva\Github\open_source\sam2\sam2\sam2\configs\sam2.1\sam2.1_hiera_l.yaml"

sam2_model = build_sam2(model_cfg, checkpoint, device=device)
predictor = SAM2ImagePredictor(sam2_model)

# Mount images folder for static serving
app.mount("/images", StaticFiles(directory=IMAGE_FOLDER), name="images")


def get_next_image():
    """Reads the last image ID, increments it, and updates the tracking file."""
    with open(TRACK_FILE, "r+") as f:
        last_id = int(f.read().strip())
        new_id = last_id + 1
        f.seek(0)
        f.write(str(new_id))
        f.truncate()
    return f"{last_id}.jpg"


@app.get("/next-image/")
def serve_next_image():
    """Returns the next image URL to the frontend."""
    image_name = get_next_image()
    image_path = os.path.join(IMAGE_FOLDER, image_name)

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="No more images available")

    return {"image_url": f"{BASE_URL}{image_name}"}


# Pydantic model for incoming click data
class Point(BaseModel):
    img: str
    x: float
    y: float


def get_bounding_box(mask):
    """Finds the bounding box of a binary mask."""
    y_indices, x_indices = np.where(mask > 0)
    if len(x_indices) == 0 or len(y_indices) == 0:
        return None  # No object detected
    return int(np.min(x_indices)), int(np.min(y_indices)), int(np.max(x_indices)), int(np.max(y_indices))


@app.post("/boxes")
async def get_boxes(points: List[Point]):
    global current_image, current_image_path
    local_path = points[0].img.replace(BASE_URL, IMAGE_FOLDER + "\\")

    if local_path != current_image_path:  # Only reload when a new image is received
        img = cv2.imread(local_path)
        if img is None:
            raise HTTPException(status_code=404, detail="Image not found")

        predictor.set_image(img)
        current_image = img
        current_image_path = local_path

    # Run segmentation only with new click coordinates
    x, y = points[0].x, points[0].y
    input_point = np.array([[x, y]])
    input_label = np.array([1])

    masks, _, _ = predictor.predict(
        point_coords=input_point,
        point_labels=input_label,
        multimask_output=True,
    )

    largest_mask = max(masks, key=lambda m: np.sum(m))
    bbox = get_bounding_box(largest_mask)

    if not bbox:
        return {"message": "No object detected"}

    return {
        "image": points[0].img,
        "bounding_box": {"x_min": bbox[0], "y_min": bbox[1], "x_max": bbox[2], "y_max": bbox[3]},
    }
