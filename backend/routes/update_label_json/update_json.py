import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from models import LabelInput

# Load environment variables
load_dotenv()

# Read JSON file path from environment variable
JSON_FILE_PATH = os.getenv("VEHICLE_LABELS_PATH")

# Load vehicle labels at startup
def load_vehicle_labels():
    try:
        with open(JSON_FILE_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}  # Return empty dictionary if file doesn't exist

vehicle_labels = load_vehicle_labels()

# Define a new router
add_label_router = APIRouter()

@add_label_router.post("/add_label")
async def add_label(label_data: LabelInput):
    """Add a new vehicle label with its color code and index."""
    if label_data.name in vehicle_labels:
        raise HTTPException(status_code=400, detail="Label already exists.")

    # Add new label
    vehicle_labels[label_data.name] = {
        "index": label_data.index,
        "color": label_data.color
    }

    # Save updated data to JSON file
    with open(JSON_FILE_PATH, "w") as f:
        json.dump(vehicle_labels, f, indent=4)

    return {"message": "Label added successfully", "updated_data": vehicle_labels}
