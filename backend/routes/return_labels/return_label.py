import os
import json
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

return_label_router = APIRouter()
JSON_FILE_PATH = os.getenv("VEHICLE_LABELS_PATH")

def load_vehicle_labels():
    try:
        with open(JSON_FILE_PATH, "r") as f:
            data = json.load(f)
            for label, details in data.items():
                if not isinstance(details, dict) or "id" not in details or "color" not in details:
                    raise ValueError(f"Invalid format for label {label}: missing id or color")
            return data
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON format in vehicle labels file")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@return_label_router.get("/return_label")
async def return_label():
    """Returns the updated vehicle labels from the JSON file."""
    vehicle_labels = load_vehicle_labels()
    if not vehicle_labels:
        raise HTTPException(status_code=404, detail="Vehicle labels file not found")
    return vehicle_labels  # Always return the latest version of the labels