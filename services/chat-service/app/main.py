from fastapi import FastAPI
from app.api import routes

app = FastAPI(title="Chat Service", version="1.0.0")

app.include_router(routes.router, prefix="/chat", tags=["Chat"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "chat-service"}