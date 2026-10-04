from fastapi import APIRouter
from typing import Dict, Any
from backend.model.news_classifier import model_instance

router = APIRouter()

@router.get("/metrics")
async def get_model_metrics() -> Dict[str, Any]:
    if not model_instance.is_trained:
        model_instance.train_or_load()
        
    return {
        "status": "active",
        "metrics": model_instance.metrics
    }
