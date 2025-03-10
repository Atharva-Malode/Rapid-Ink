import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from routes.get_image.return_image import return_image_router
from routes.get_bounding_box.return_box import return_boxes_router
from routes.home.home_route import home_router
from routes.save_annotations.save_annotations import save_annotation_router


load_dotenv()

IMAGE_FOLDER = os.getenv("IMAGE_FOLDER")
SAM2_LIBRARY = os.getenv("SAM2_LIBRARY")

# Add SAM2 model path
sys.path.append(SAM2_LIBRARY)

# FastAPI app setup
app = FastAPI()

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory=IMAGE_FOLDER), name="images")

app.include_router(home_router, tags=["home"])
app.include_router(return_image_router, tags=["images"])
app.include_router(return_boxes_router, tags=["boxes"])
app.include_router(save_annotation_router, tags=["save annotations"])