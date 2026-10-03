from fastapi import APIRouter
from src.api.v1 import auth, users, projects, tasks, analytics, websocket

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(projects.router)
api_router.include_router(tasks.router)
api_router.include_router(analytics.router)
api_router.include_router(websocket.router)
