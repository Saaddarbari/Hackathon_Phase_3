from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import create_async_engine

from src.config.database import init_db
from src.config.settings import settings
from src.api.routes import auth, todos
from src.api import chat

app = FastAPI(
    title="Evolution of Todo API - Phase III",
    description="Phase III - Agent-first todo chatbot with MCP tools",
    version="0.2.0",
)

# CORS middleware configured for frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://frontend:3000"],  # Frontend container name in Docker Compose
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler (T018)
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# Include auth routes (signup, signin) - Phase II endpoints retained
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])

# Include todos routes - REST API for manual task management
app.include_router(todos.router, prefix="/api/todos", tags=["todos"])

# Include chat route - Phase III single endpoint for all task operations
# Constitutional Compliance: All task mutations occur via MCP tools through this endpoint
app.include_router(chat.router, tags=["chat"])

@app.get("/")
async def root():
    return {
        "message": "Evolution of Todo API - Phase III",
        "version": "0.2.0",
        "architecture": "Agent-first with MCP tools",
        "endpoints": {
            "auth": "/api/auth/*",
            "chat": "/api/{user_id}/chat"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def on_startup():
    """Initialize database on startup."""
    await init_db()
