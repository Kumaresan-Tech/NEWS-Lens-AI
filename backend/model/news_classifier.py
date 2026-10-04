import os
import time
import joblib
import numpy as np
from typing import Dict, List, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from backend.model.dataset import TRAINING_DATA, CATEGORY_METADATA
from backend.preprocessing.text_cleaner import clean_text, extract_keywords, extract_entities

MODEL_PATH = os.path.join(os.path.dirname(__file__), "saved_model.joblib")

class NewsClassifierModel:
    def __init__(self):
        self.vectorizer: TfidfVectorizer = None
        self.classifier: LogisticRegression = None
        self.categories: List[str] = list(CATEGORY_METADATA.keys())
        self.metrics: Dict[str, Any] = {}
        self.is_trained: bool = False
        
    def train_or_load(self):
        """Train or load pre-trained news classification model."""
        if os.path.exists(MODEL_PATH):
            try:
                saved = joblib.load(MODEL_PATH)
                self.vectorizer = saved["vectorizer"]
                self.classifier = saved["classifier"]
                self.metrics = saved["metrics"]
                self.categories = saved["categories"]
                self.is_trained = True
                print("Loaded pre-trained ML model successfully.")
                return
            except Exception as e:
                print(f"Error loading model, retraining: {e}")
                
        self.train()

    def train(self):
        """Train TF-IDF + LogisticRegression model on dataset and calculate metrics."""
        print("Training news classifier model on dataset...")
        start_time = time.time()
        
        texts = [item[0] for item in TRAINING_DATA]
        labels = [item[1] for item in TRAINING_DATA]
        
        # Preprocess texts
        cleaned_texts = [clean_text(t) for t in texts]
        
        # Fit vectorizer with improved parameters for better generalization
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            min_df=1,
            max_features=15000,
            max_df=0.9,
            strip_accents='unicode'
        )
        X = self.vectorizer.fit_transform(cleaned_texts)
        y = labels
        
        # Fit classifier with very high C for maximum confidence
        self.classifier = LogisticRegression(
            C=200.0,
            max_iter=5000,
            solver='lbfgs',
            class_weight='balanced',
            random_state=42
        )
        self.classifier.fit(X, y)
        
        # Compute self evaluation & train metrics
        y_pred = self.classifier.predict(X)
        acc = float(accuracy_score(y, y_pred))
        precision, recall, f1, _ = precision_recall_fscore_support(y, y_pred, average='weighted', zero_division=0)
        
        # Calculate per-class metrics
        precision_per_class, recall_per_class, f1_per_class, support_per_class = precision_recall_fscore_support(
            y, y_pred, labels=self.classifier.classes_, zero_division=0
        )
        
        per_category_metrics = {}
        for idx, cat_name in enumerate(self.classifier.classes_):
            per_category_metrics[cat_name] = {
                "precision": round(float(precision_per_class[idx]), 3),
                "recall": round(float(recall_per_class[idx]), 3),
                "f1_score": round(float(f1_per_class[idx]), 3),
                "sample_count": int(support_per_class[idx])
            }
            
        training_time = round(time.time() - start_time, 3)
        
        self.metrics = {
            "accuracy": round(acc, 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4),
            "training_time_seconds": training_time,
            "vocabulary_size": len(self.vectorizer.vocabulary_),
            "total_samples": len(texts),
            "num_classes": len(self.classifier.classes_),
            "model_type": "TF-IDF + LogisticRegression Classifier",
            "per_category": per_category_metrics
        }
        
        self.categories = list(self.classifier.classes_)
        self.is_trained = True
        
        # Save model state
        joblib.dump({
            "vectorizer": self.vectorizer,
            "classifier": self.classifier,
            "metrics": self.metrics,
            "categories": self.categories
        }, MODEL_PATH)
        print(f"Model trained in {training_time}s with accuracy: {acc * 100:.2f}%")

    def predict(self, text: str) -> Dict[str, Any]:
        """Perform full prediction pipeline for given news text."""
        start = time.time()
        if not self.is_trained or self.vectorizer is None or self.classifier is None:
            self.train_or_load()

        if not text or not text.strip():
            raise ValueError("Input text cannot be empty.")
            
        cleaned = clean_text(text)
        if not cleaned:
            # Fallback if text only contained non-alphanumeric chars
            cleaned = text.lower().strip()
            
        vectorized = self.vectorizer.transform([cleaned])
        probs = self.classifier.predict_proba(vectorized)[0]
        
        # Get sorted predictions
        class_probs = list(zip(self.classifier.classes_, probs))
        class_probs.sort(key=lambda x: x[1], reverse=True)
        
        primary_cat, primary_prob = class_probs[0]
        
        # Format top 5 predictions
        top_categories = []
        for cat, prob in class_probs[:5]:
            top_categories.append({
                "category": cat,
                "confidence": round(float(prob), 4),
                "percentage": f"{round(float(prob) * 100, 1)}%"
            })
            
        # Feature importance / TF-IDF signals for explanation
        feature_names = np.array(self.vectorizer.get_feature_names_out())
        dense_vec = vectorized.toarray()[0]
        nonzero_indices = dense_vec.nonzero()[0]
        
        matched_tokens = []
        if len(nonzero_indices) > 0:
            token_scores = [(feature_names[i], dense_vec[i]) for i in nonzero_indices]
            token_scores.sort(key=lambda x: x[1], reverse=True)
            matched_tokens = [t[0] for t in token_scores[:6]]
            
        # Extract keywords and entities
        keywords = extract_keywords(text, top_n=6)
        entities = extract_entities(text)
        
        # Generate topics
        topics = [k["keyword"].title() for k in keywords[:3]]
        if not topics:
            topics = [primary_cat]
            
        # Build dynamic AI Explanation
        explanation = self._generate_explanation(
            primary_cat=primary_cat,
            confidence=primary_prob,
            matched_tokens=matched_tokens,
            keywords=keywords,
            entities=entities
        )
        
        words = text.split()
        elapsed_ms = round((time.time() - start) * 1000, 2)
        
        return {
            "primary_category": primary_cat,
            "confidence": round(float(primary_prob), 4),
            "confidence_percentage": round(float(primary_prob) * 100, 1),
            "top_categories": top_categories,
            "keywords": keywords,
            "topics": topics,
            "entities": entities,
            "explanation": explanation,
            "word_count": len(words),
            "char_count": len(text),
            "inference_time_ms": elapsed_ms,
            "metadata": CATEGORY_METADATA.get(primary_cat, {})
        }

    def _generate_explanation(self, primary_cat: str, confidence: float, matched_tokens: List[str], keywords: List[Dict], entities: List[Dict]) -> str:
        cat_meta = CATEGORY_METADATA.get(primary_cat, {})
        desc = cat_meta.get("description", "news events")
        
        conf_str = "high" if confidence > 0.75 else "moderate" if confidence > 0.45 else "tentative"
        
        token_str = f" key terms like '{', '.join(matched_tokens[:4])}'" if matched_tokens else ""
        entity_str = f" and recognized entities ({', '.join([e['text'] for e in entities[:2]])})" if entities else ""
        
        explanation = (
            f"The ML model assigned **{primary_cat}** with a {conf_str} confidence of {round(confidence*100, 1)}%. "
            f"This classification was driven by{token_str}{entity_str}, matching patterns associated with {desc.lower()}"
        )
        return explanation

# Global instance
model_instance = NewsClassifierModel()