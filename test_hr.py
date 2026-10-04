import sys
sys.path.insert(0, '.')
from backend.model.news_classifier import model_instance

# Test Human Rights category
tests = [
    "The human rights organization condemned the treatment of political prisoners",
    "The United Nations report highlighted widespread human rights violations",
    "The court ruled that the detention of journalists violated their fundamental rights",
    "The advocacy group launched a campaign to protect freedom of expression",
]

print("Testing Human Rights category:")
print("=" * 50)
for text in tests:
    result = model_instance.predict(text)
    cat = result['primary_category']
    conf = result['confidence_percentage']
    print(f"{text[:55]:55s} -> {cat:15s} ({conf}%)")

print(f"\nTotal categories: {len(model_instance.categories)}")
print(f"Human Rights in categories: {'Human Rights' in model_instance.categories}")
