import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.model.news_classifier import model_instance
from backend.routes.predict import router as predict_router
from backend.routes.categories import router as categories_router
from backend.routes.metrics import router as metrics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting AI/ML News Category Analyzer Backend...")
    model_instance.train_or_load()
    yield
    print("Shutting down backend service...")

app = FastAPI(
    title="AI/ML News Category Analyzer API",
    description="Production-grade AI/ML API for multi-class news article and text classification.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers under /api
app.include_router(predict_router, prefix="/api", tags=["Prediction"])
app.include_router(categories_router, prefix="/api", tags=["Categories"])
app.include_router(metrics_router, prefix="/api", tags=["Model Metrics"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AI/ML News Category Analyzer",
        "model_trained": model_instance.is_trained
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8001, reload=True)
