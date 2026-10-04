import sys
sys.path.insert(0, '.')
from backend.model.news_classifier import model_instance

# Test with various inputs
tests = [
    'The president signed a new bill in parliament',
    'Apple unveiled a new iPhone with AI features',
    'India wins cricket world cup final',
    'Central bank raises interest rates',
    'New cancer drug approved by FDA',
    'NASA launches new satellite',
    'School curriculum updated for STEM',
    'Hurricane warning issued for coast',
    'New restaurant opens downtown',
    'Electric car sales surge globally',
]

print('Testing model with various inputs:')
print('='*60)
for text in tests:
    result = model_instance.predict(text)
    cat = result['primary_category']
    conf = result['confidence_percentage']
    print(f'{text[:50]:50s} -> {cat:20s} ({conf}%)')
