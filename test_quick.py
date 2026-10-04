import sys
sys.path.insert(0, '.')
from backend.model.news_classifier import NewsClassifierModel

model = NewsClassifierModel()
model.train_or_load()

tests = [
    ('The president signed a new bill in parliament', 'Politics'),
    ('Apple unveiled a new iPhone with AI features', 'Technology'),
    ('India wins cricket World Cup final', 'Sports'),
    ('Central bank raises interest rates', 'Finance'),
    ('New cancer drug approved by FDA', 'Medicine'),
    ('NASA launches new satellite', 'Space'),
    ('School curriculum updated for STEM', 'Education'),
    ('Hurricane warning issued for coast', 'Weather'),
    ('New restaurant opens downtown', 'Food'),
    ('Electric car sales surge globally', 'Automotive'),
]

correct = 0
for text, expected in tests:
    result = model.predict(text)
    predicted = result['primary_category']
    if predicted == expected:
        correct += 1
    else:
        print(f'FAIL: {text[:50]}... Expected={expected}, Got={predicted}')

print(f'\nResult: {correct}/{len(tests)} correct')
print(f'Model trained with {model.metrics["total_samples"]} samples, {model.metrics["num_classes"]} classes')
print(f'Vocabulary size: {model.metrics["vocabulary_size"]}')