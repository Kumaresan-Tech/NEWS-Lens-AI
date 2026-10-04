import re
import string
from typing import List, Dict, Tuple

STOP_WORDS = set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
    "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
    "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
    "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should",
    "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them",
    "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
    "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
    "yourselves", "said", "says", "news", "report", "according", "also", "new", "one", "two", "year", "years"
])

# Entity dictionary patterns for rule-based detection
ENTITY_PATTERNS = [
    (r"\b(Apple|Google|Microsoft|Amazon|Meta|NVIDIA|OpenAI|Tesla|SpaceX|Samsung|Intel|AMD|IBM|Sony)\b", "Organization/Tech"),
    (r"\b(ISRO|NASA|ESA|UN|NATO|WHO|FBI|CIA|EU|IMF|World Bank|BCCI|IOC|FIFA)\b", "Organization"),
    (r"\b(USA|United States|India|China|UK|United Kingdom|Japan|Russia|Germany|France|Ukraine|Israel|Palestine|Australia|Canada)\b", "Location/Country"),
    (r"\b(Washington|London|Tokyo|Delhi|Beijing|Moscow|Paris|New York|Berlin|San Francisco|Kyiv)\b", "Location/City"),
    (r"\b(Biden|Trump|Modi|Sunak|Macron|Zelensky|Putin|Xi Jinping|Elon Musk|Altman|Satya Nadella|Sundar Pichai)\b", "Person/Leader"),
    (r"\b(\$\d+(\.\d+)?\s*(billion|million|trillion|B|M|T)?|\d+\s*(billion|million)\s*(dollars|rupees|euros|pounds))\b", "Financial Metric"),
    (r"\b(ChatGPT|GPT-4|Gemini|Claude|Llama|BERT|Transformer|DeepSeek)\b", "AI System"),
    (r"\b(ISRO|Chandrayaan|Artemis|James Webb|Hubble|Mars Rover|Falcon 9|Starship)\b", "Space Mission"),
    (r"\b(COVID-19|Coronavirus|Flu|Cancer|Alzheimer|Vaccine|FDA|WHO|Diabetes)\b", "Health/Medical"),
]

def clean_text(text: str) -> str:
    """Preprocess text for model consumption: normalize, lowercase, strip URLs, remove punctuation."""
    if not text:
        return ""
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Strip URLs
    text = re.sub(r'http[s]?://\S+', ' ', text)
    # Normalize abbreviations
    text = normalize_text(text)
    # Lowercase
    text = text.lower()
    # Remove special punctuation but keep spaces and hyphens
    text = re.sub(r'[^a-z0-9\s-]', ' ', text)
    # Collapse multiple whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text


# Domain-specific keywords that help with classification
DOMAIN_KEYWORDS = {
    "politics": ["president", "minister", "parliament", "senate", "congress", "election", "vote", "bill", "law", "government", "policy", "campaign", "party", "opposition", "prime", "diplomat", "sanctions", "legislature", "cabinet", "reshuffle"],
    "technology": ["apple", "iphone", "android", "software", "hardware", "app", "computer", "chip", "processor", "smartphone", "device", "digital", "cyber", "data", "cloud", "algorithm", "code", "programming", "tech", "gadget"],
    "sports": ["cricket", "football", "tennis", "basketball", "baseball", "hockey", "golf", "olympic", "match", "game", "team", "player", "score", "win", "championship", "tournament", "league", "final", "wicket", "goal"],
    "finance": ["bank", "interest", "rate", "stock", "market", "investment", "fund", "money", "financial", "economic", "trade", "currency", "dollar", "euro", "profit", "revenue", "earnings", "portfolio", "hedge"],
    "health": ["health", "hospital", "doctor", "patient", "disease", "treatment", "medical", "medicine", "drug", "vaccine", "therapy", "cancer", "diagnosis", "symptom", "wellness", "mental", "nutrition", "fitness", "exercise"],
    "science": ["scientist", "research", "study", "discovery", "experiment", "physics", "biology", "chemistry", "gene", "dna", "species", "fossil", "climate", "environment", "ocean", "space", "planet", "galaxy", "quantum"],
    "space": ["nasa", "space", "rocket", "satellite", "mars", "moon", "planet", "galaxy", "astronaut", "orbit", "launch", "telescope", "spacecraft", "station", "cosmic", "asteroid", "comet", "nebula", "star"],
    "education": ["school", "university", "college", "student", "teacher", "education", "curriculum", "degree", "graduation", "academic", "research", "scholarship", "exam", "classroom", "learning", "stem", "course", "campus", "lecture"],
    "entertainment": ["movie", "film", "music", "celebrity", "actor", "actress", "singer", "band", "concert", "festival", "award", "show", "series", "streaming", "hollywood", "bollywood", "album", "song", "performance", "entertainment"],
    "food": ["food", "restaurant", "chef", "recipe", "cooking", "cuisine", "meal", "dish", "ingredient", "organic", "farm", "agriculture", "nutrition", "diet", "vegan", "vegetarian", "meat", "dessert", "bakery", "cafe"],
    "automotive": ["car", "vehicle", "auto", "electric", "ev", "engine", "motor", "driving", "road", "traffic", "speed", "horsepower", "battery", "charging", "manufacturer", "model", "sedan", "suv", "truck", "motorcycle"],
    "weather": ["weather", "rain", "snow", "storm", "hurricane", "tornado", "wind", "temperature", "forecast", "climate", "flood", "drought", "heat", "cold", "cloud", "sun", "thunder", "lightning", "meteorology"],
    "crime": ["crime", "police", "arrest", "murder", "theft", "robbery", "fraud", "court", "trial", "sentence", "prison", "jail", "investigation", "detective", "suspect", "evidence", "witness", "guilty", "innocent", "lawyer"],
    "law": ["law", "court", "judge", "justice", "legal", "attorney", "lawsuit", "ruling", "verdict", "appeal", "supreme", "constitutional", "rights", "legislation", "regulation", "compliance", "contract", "tort", "criminal", "civil"],
    "environment": ["environment", "climate", "pollution", "carbon", "emission", "green", "sustainable", "renewable", "energy", "solar", "wind", "forest", "ocean", "wildlife", "conservation", "ecology", "biodiversity", "recycling", "waste"],
    "business": ["company", "corporation", "business", "ceo", "executive", "merger", "acquisition", "startup", "entrepreneur", "industry", "market", "product", "service", "customer", "sales", "marketing", "brand", "retail", "ecommerce", "finance"],
    "economy": ["economy", "gdp", "growth", "inflation", "recession", "unemployment", "trade", "export", "import", "deficit", "surplus", "budget", "tax", "spending", "consumer", "production", "output", "sector", "industry", "market"],
    "world": ["international", "global", "foreign", "diplomatic", "treaty", "summit", "nations", "country", "border", "war", "peace", "conflict", "refugee", "humanitarian", "aid", "development", "cooperation", "alliance", "embassy", "ambassador"],
    "national": ["national", "federal", "country", "government", "state", "region", "local", "public", "service", "agency", "department", "administration", "policy", "program", "initiative", "project", "funding", "grant", "budget", "tax"],
    "local": ["local", "city", "town", "community", "neighborhood", "resident", "council", "mayor", "municipal", "county", "district", "area", "region", "street", "park", "library", "school", "hospital", "police", "fire", "service"],
    "travel": ["travel", "tourism", "airline", "flight", "airport", "hotel", "resort", "vacation", "trip", "journey", "destination", "tourist", "passenger", "luggage", "booking", "reservation", "itinerary", "adventure", "explore", "visit"],
    "tourism": ["tourism", "tourist", "destination", "attraction", "heritage", "landmark", "museum", "monument", "beach", "mountain", "island", "culture", "festival", "event", "experience", "guide", "tour", "sightseeing", "hospitality", "resort"],
    "lifestyle": ["lifestyle", "wellness", "fitness", "health", "mindfulness", "meditation", "yoga", "nutrition", "diet", "exercise", "sleep", "stress", "balance", "happiness", "self-care", "personal", "growth", "productivity", "habit", "routine"],
    "fashion": ["fashion", "style", "clothing", "apparel", "designer", "brand", "collection", "runway", "model", "trend", "luxury", "couture", "accessory", "jewelry", "shoe", "bag", "textile", "fabric", "color", "pattern"],
    "gaming": ["gaming", "game", "video", "console", "playstation", "xbox", "nintendo", "pc", "esports", "tournament", "player", "level", "quest", "mission", "character", "rpg", "shooter", "strategy", "multiplayer", "online"],
    "music": ["music", "song", "album", "artist", "band", "singer", "concert", "tour", "festival", "genre", "melody", "lyric", "instrument", "guitar", "piano", "drum", "orchestra", "symphony", "streaming", "chart"],
    "movies": ["movie", "film", "cinema", "director", "actor", "actress", "hollywood", "bollywood", "box", "office", "premiere", "sequel", "remake", "adaptation", "screenplay", "script", "scene", "shot", "visual", "effect", "soundtrack"],
    "agriculture": ["agriculture", "farm", "crop", "harvest", "soil", "irrigation", "fertilizer", "pesticide", "livestock", "cattle", "poultry", "dairy", "grain", "wheat", "rice", "corn", "vegetable", "fruit", "organic", "sustainable"],
    "realestate": ["real", "estate", "property", "housing", "home", "apartment", "condo", "mortgage", "rent", "lease", "buyer", "seller", "agent", "broker", "construction", "building", "development", "commercial", "residential", "market", "price"],
    "startups": ["startup", "venture", "capital", "funding", "seed", "series", "investor", "founder", "entrepreneur", "incubator", "accelerator", "pitch", "unicorn", "ipo", "valuation", "equity", "stake", "round", "angel", "crowdfunding"],
    "cybersecurity": ["cybersecurity", "cyber", "hack", "breach", "malware", "ransomware", "phishing", "vulnerability", "exploit", "firewall", "encryption", "security", "threat", "attack", "data", "privacy", "protection", "defense", "incident", "forensics"],
    "social": ["social", "community", "rights", "equality", "justice", "diversity", "inclusion", "activism", "protest", "movement", "advocacy", "wage", "gender", "race", "discrimination", "poverty", "homeless", "volunteer", "nonprofit", "charity"],
    "defence": ["defense", "military", "army", "navy", "air", "force", "weapon", "missile", "tank", "soldier", "combat", "operation", "exercise", "training", "intelligence", "surveillance", "radar", "sonar", "nuclear", "strategic"],
    "international": ["international", "diplomatic", "foreign", "bilateral", "multilateral", "treaty", "agreement", "negotiation", "summit", "conference", "delegation", "ambassador", "embassy", "consulate", "visa", "passport", "immigration", "refugee", "asylum", "border"],
    "ai": ["ai", "artificial", "intelligence", "machine", "learning", "deep", "neural", "network", "model", "algorithm", "data", "training", "inference", "prediction", "classification", "regression", "clustering", "nlp", "computer", "vision"],
    "ml": ["ml", "machine", "learning", "supervised", "unsupervised", "reinforcement", "feature", "training", "test", "validation", "accuracy", "precision", "recall", "f1", "hyperparameter", "cross", "validation", "overfitting", "underfitting", "regularization"],
    "medicine": ["medicine", "clinical", "trial", "patient", "doctor", "hospital", "treatment", "therapy", "drug", "vaccine", "disease", "diagnosis", "symptom", "surgery", "physician", "nurse", "pharmacy", "prescription", "dose", "fda"],
    "other": ["other", "miscellaneous", "general", "various", "different", "multiple", "several", "many", "some", "few", "various", "assorted", "diverse", "mixed", "sundry", "misc", "etc", "other", "else", "another"]
}


def normalize_text(text: str) -> str:
    """Normalize text by expanding common abbreviations and standardizing terms."""
    text = text.lower()
    # Expand common abbreviations
    replacements = {
        "u.s.": "united states",
        "u.k.": "united kingdom",
        "u.n.": "united nations",
        "nasa": "nasa space",
        "fda": "fda medicine",
        "gdp": "gdp economy",
        "ceo": "ceo business",
        "ai": "ai artificial intelligence",
        "ml": "ml machine learning",
        "ev": "ev electric vehicle",
        "it": "it technology",
    }
    for abbr, full in replacements.items():
        text = text.replace(abbr, full)
    return text

def extract_keywords(text: str, top_n: int = 8) -> List[Dict[str, float]]:
    """Extract key phrases / words from text based on TF-IDF weighting / word frequency."""
    cleaned = clean_text(text)
    words = [w for w in cleaned.split() if w not in STOP_WORDS and len(w) > 2]
    
    if not words:
        return []
    
    # Calculate word frequency and score
    freq: Dict[str, int] = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
        
    total_words = len(words)
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    
    keywords = []
    max_freq = sorted_words[0][1] if sorted_words else 1
    
    for word, count in sorted_words[:top_n]:
        # Simple relevance score normalization [0.4 to 0.99]
        score = round(0.4 + 0.59 * (count / max_freq), 3)
        keywords.append({"keyword": word, "score": score, "frequency": count})
        
    return keywords

def extract_entities(text: str) -> List[Dict[str, str]]:
    """Extract recognized named entities using domain pattern matching."""
    entities = []
    seen = set()
    
    for pattern, entity_type in ENTITY_PATTERNS:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for m in matches:
            match_str = m.group(0).strip()
            if match_str.lower() not in seen and len(match_str) > 1:
                seen.add(match_str.lower())
                entities.append({
                    "text": match_str,
                    "type": entity_type
                })
                
    return entities