from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.core.db import async_engine, Base
from src.core.redis import redis_cache
from src.api.router import api_router
from src.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing TaskFlow Pro API services...")
    # Initialize DB tables for development/testing
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await redis_cache.connect()
    yield
    logger.info("Shutting down TaskFlow Pro API services...")
    await redis_cache.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }
