from fastapi import APIRouter, HTTPException
import os
import shutil
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

save_annotation_router = APIRouter()

# Root directories
DATA_FOLDER = os.getenv("IMAGE_FOLDER")
ANNOTATION_ROOT = os.getenv("ANNOTATIONS")

@save_annotation_router.post("/save-annotation/")
def save_annotation(data: dict):
    """
    Moves image to annotations folder and saves annotation in YOLO format.
    """
    image_url = data.get("image_url")
    objects = data.get("objects", {})

    if not image_url or not objects:
        raise HTTPException(status_code=400, detail="Invalid input data")

    # Extract person name and image name from the URL
    parsed_url = urlparse(image_url)
    image_path = parsed_url.path.lstrip("/")  # Remove leading slash if any
    parts = image_path.split("/")  # Example: ['images', 'atharva', '1.jpg']

    if len(parts) < 3:
        raise HTTPException(status_code=400, detail="Invalid image URL format")

    person_name = parts[1]  # Extract person's name
    image_name = parts[2]  # Extract image filename (e.g., 1.jpg)

    # Source paths
    source_image_path = os.path.join(DATA_FOLDER, person_name, image_name)

    # Destination paths
    person_annotation_folder = os.path.join(ANNOTATION_ROOT, person_name)
    images_folder = os.path.join(person_annotation_folder, "images")
    text_boxes_folder = os.path.join(person_annotation_folder, "text_boxes")

    os.makedirs(images_folder, exist_ok=True)
    os.makedirs(text_boxes_folder, exist_ok=True)

    # Validate that the image exists before moving
    if not os.path.exists(source_image_path):
        raise HTTPException(status_code=404, detail="Image not found in data folder")

    # Move the image to annotations/{person_name}/images/
    dest_image_path = os.path.join(images_folder, image_name)
    shutil.move(source_image_path, dest_image_path)

    # Create YOLO format annotation file
    annotation_file = os.path.join(text_boxes_folder, f"{os.path.splitext(image_name)[0]}.txt")

    with open(annotation_file, "w") as f:
        for object_name, coordinates in objects.items():
            if not isinstance(coordinates, list) or len(coordinates) != 5:
                raise HTTPException(status_code=400, detail=f"Invalid YOLO format for {object_name}")
            yolo_line = f"{coordinates[0]} {coordinates[1]} {coordinates[2]} {coordinates[3]} {coordinates[4]}"
            f.write(yolo_line + "\n")

    return {
        "message": "Annotation saved successfully",
        "image_moved_to": dest_image_path,
        "annotation_file": annotation_file
    }
