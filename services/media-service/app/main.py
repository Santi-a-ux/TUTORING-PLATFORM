from fastapi import FastAPI
from app.api import routes

app = FastAPI(title="Media Service", version="1.0.0")

app.include_router(routes.router, prefix="/media", tags=["Media"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "media-service"}