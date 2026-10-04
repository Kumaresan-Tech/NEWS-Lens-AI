from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any
from backend.model.news_classifier import model_instance

router = APIRouter()

class NewsInput(BaseModel):
    text: str = Field(..., description="The news headline, sentence, paragraph, or full article text to analyze.")

@router.post("/predict")
async def predict_news_category(payload: NewsInput) -> Dict[str, Any]:
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text input cannot be empty.")
    
    if len(text) < 3:
        raise HTTPException(status_code=400, detail="Text is too short for reliable classification (minimum 3 characters required).")

    if len(text) > 50000:
        raise HTTPException(status_code=400, detail="Text exceeds maximum limit of 50,000 characters.")

    try:
        if not model_instance.is_trained:
            model_instance.train_or_load()
            
        result = model_instance.predict(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")
