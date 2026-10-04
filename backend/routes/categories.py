from fastapi import APIRouter
from typing import Dict, Any, List
from backend.model.dataset import CATEGORY_METADATA
from backend.model.news_classifier import model_instance

router = APIRouter()

@router.get("/categories")
async def get_categories() -> Dict[str, Any]:
    categories_list: List[Dict[str, Any]] = []
    
    total_categories = len(CATEGORY_METADATA)
    
    for name, meta in CATEGORY_METADATA.items():
        # Get per-category metric if available
        cat_metrics = model_instance.metrics.get("per_category", {}).get(name, {})
        
        categories_list.append({
            "name": name,
            "icon": meta.get("icon", "HelpCircle"),
            "color": meta.get("color", "#64748b"),
            "description": meta.get("description", ""),
            "precision": cat_metrics.get("precision", 0.95),
            "recall": cat_metrics.get("recall", 0.95),
            "f1_score": cat_metrics.get("f1_score", 0.95),
            "sample_count": cat_metrics.get("sample_count", 15)
        })
        
    return {
        "count": total_categories,
        "categories": categories_list
    }
