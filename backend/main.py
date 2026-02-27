"""
VeriLearn API — AI-Powered Learning Verification & Analytics Platform.
Run: uvicorn main:app --host 0.0.0.0 --port 10000
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from database.connection import init_db, close_db
from routes import auth, student, teacher
from routes.deps import get_current_user
from models.user_model import User, UserResponse

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered learning verification and analytics platform.",
    lifespan=lifespan,
)

# CORS — open for development, restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(student.router)
app.include_router(teacher.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "database": "PostgreSQL",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "database": "PostgreSQL (asyncpg)"}


@app.get("/auth/me", tags=["Authentication"], response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
    )
