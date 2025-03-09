import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from routes.get_image.return_image import return_image_router
from routes.get_bounding_box.return_box import return_boxes_router


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
    allow_origins=["*"],  # Change this to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory=IMAGE_FOLDER), name="images")
app.include_router(return_image_router, tags=["images"])
app.include_router(return_boxes_router, tags=["boxes"])