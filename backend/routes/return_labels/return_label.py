import os
import json
from fastapi import APIRouter
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

return_label_router = APIRouter()

# Read file path from environment variable
JSON_FILE_PATH = os.getenv("VEHICLE_LABELS_PATH")

# Function to read the JSON file on every request
def load_vehicle_labels():
    try:
        with open(JSON_FILE_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

@return_label_router.get("/return_label")
async def return_label():
    """Returns the updated vehicle labels from the JSON file."""
    vehicle_labels = load_vehicle_labels()
    return vehicle_labels  # Always return the latest version of the labels