from fastapi import APIRouter
import os


home_router = APIRouter()

@home_router.get("/")
def home():
    return {"message": "Welcome to Rapid Ink! you backend is working fine."}