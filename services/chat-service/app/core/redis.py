import redis.asyncio as redis
from app.core.config import settings

class RedisPubSubManager:
    def __init__(self):
        self.redis_url = settings.REDIS_URL
        self.pool = None

    async def connect(self):
        if not self.pool:
            self.pool = redis.ConnectionPool.from_url(self.redis_url)
    
    async def disconnect(self):
        if self.pool:
            await self.pool.disconnect()

    def get_connection(self):
        return redis.Redis(connection_pool=self.pool)

    async def publish(self, channel: str, message: str):
        r = self.get_connection()
        await r.publish(channel, message)

redis_manager = RedisPubSubManager()