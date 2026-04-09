from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from starlette.background import BackgroundTask

app = FastAPI(title="API Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service resolution mapping
SERVICES = {
    "auth": "http://auth-service:8001",
    "users": "http://user-service:8002",
    "tutors": "http://tutor-service:8003",
    "geo": "http://geo-service:8004",
    "chat": "http://chat-service:8005",
    "media": "http://media-service:8006",
    "bookings": "http://booking-service:8007",
}

# Use a global client to reuse connections
client = httpx.AsyncClient(timeout=10.0)

@app.on_event("shutdown")
async def shutdown_event():
    await client.aclose()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "api-gateway"}

async def _reverse_proxy(service_url: str, request: Request, full_path: str):
    # Construct target URL
    url = httpx.URL(f"{service_url}/{full_path}", query=request.url.query.encode("utf-8"))
    
    # Exclude 'host' header to let httpx handle it correctly for the upstream
    headers = dict(request.headers)
    headers.pop("host", None)

    try:
        # Pass the original request body securely
        proxy_req = client.build_request(
            method=request.method,
            url=url,
            headers=headers,
            content=await request.body()
        )
        
        # Send streaming response
        proxy_resp = await client.send(proxy_req, stream=True)
        
        # Clean headers that may interfere with starlette streaming
        resp_headers = dict(proxy_resp.headers)
        resp_headers.pop("content-length", None)
        resp_headers.pop("content-encoding", None)

        return StreamingResponse(
            proxy_resp.aiter_raw(),
            status_code=proxy_resp.status_code,
            headers=resp_headers,
            background=BackgroundTask(proxy_resp.aclose)
        )

    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Bad Gateway: {str(e)}")

# Match everything else
@app.api_route("/{service_name}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"])
async def gateway_router(service_name: str, path: str, request: Request):
    if service_name not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")
        
    # The upstream services expect paths starting with their prefix (e.g. /auth/...)
    full_path = f"{service_name}/{path}"
    
    return await _reverse_proxy(SERVICES[service_name], request, full_path)
