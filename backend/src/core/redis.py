import logging
from typing import Optional
import redis.asyncio as aioredis
from src.core.config import settings

logger = logging.getLogger("taskflow")

class RedisCache:
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None

    async def connect(self):
        try:
            self.redis = aioredis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
            await self.redis.ping()
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            logger.warning(f"Redis connection skipped or failed: {e}")
            self.redis = None

    async def close(self):
        if self.redis:
            await self.redis.close()

    async def get(self, key: str) -> Optional[str]:
        if not self.redis:
            return None
        try:
            return await self.redis.get(key)
        except Exception:
            return None

    async def set(self, key: str, value: str, expire: int = 3600):
        if not self.redis:
            return
        try:
            await self.redis.set(key, value, ex=expire)
        except Exception as e:
            logger.warning(f"Redis set failed: {e}")

redis_cache = RedisCache()
