from fastapi import APIRouter, HTTPException
from utils.return_bounding_boxes import get_bounding_box
from models import Point
import cv2
from dotenv import load_dotenv
import os 
import torch
from typing import List
import numpy as np
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

load_dotenv()

IMAGE_FOLDER = os.getenv("IMAGE_FOLDER")
BASE_URL = os.getenv("BASE_URL")
checkpoint = os.getenv("CHECKPOINTS")
model_cfg = os.getenv("MODEL_CFG")
SAM2_LIBRARY = os.getenv("SAM2_LIBRARY")

return_boxes_router = APIRouter()

# Model Setup
device = torch.device("cpu")
print(f"Using device: {device}")

sam2_model = build_sam2(model_cfg, checkpoint, device=device)
predictor = SAM2ImagePredictor(sam2_model)

current_image_path = None
current_image = None


@return_boxes_router.post("/boxes")
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
