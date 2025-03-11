from fastapi import APIRouter
from utils.labels import vehicle_labels  

return_label_router = APIRouter()

@return_label_router.get("/return_label")
async def return_label():
    return vehicle_labels  
