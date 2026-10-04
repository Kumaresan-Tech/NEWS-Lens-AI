import sys
sys.path.insert(0, '.')
from backend.model.news_classifier import NewsClassifierModel

model = NewsClassifierModel()
model.train_or_load()

# Test with diverse, realistic news text across all 39 categories
test_cases = [
    # Politics
    ("The prime minister introduced a new bill in parliament", "Politics"),
    ("The senator proposed a new law to reform healthcare", "Politics"),
    ("The government announced new sanctions against the regime", "Politics"),
    ("The opposition leader called for a no-confidence vote", "Politics"),
    ("The campaign rally drew thousands of supporters", "Politics"),
    
    # World
    ("The United Nations Security Council held an emergency session", "World"),
    ("Global leaders gather at the G20 summit", "World"),
    ("The international court ruled on the maritime boundary dispute", "World"),
    ("The peace treaty was signed ending decades of conflict", "World"),
    ("International aid organizations coordinate relief efforts", "World"),
    
    # National
    ("The federal government announces nationwide infrastructure project", "National"),
    ("The national census data reveals shifting demographic trends", "National"),
    ("The supreme court ruling establishes landmark legal precedent", "National"),
    ("The national guard deployed to assist with disaster relief", "National"),
    ("The federal reserve announced a change in interest rate policy", "National"),
    
    # Local
    ("The city council approves budget for new community park", "Local"),
    ("Local residents protest against the proposed highway expansion", "Local"),
    ("The school board voted to extend the academic year", "Local"),
    ("The local hospital received funding for new emergency department", "Local"),
    ("The city mayor announced a new initiative to reduce homelessness", "Local"),
    
    # Business
    ("The company reported record quarterly profits", "Business"),
    ("The global corporation acquires rival firm in merger", "Business"),
    ("The tech giant announces restructuring plan", "Business"),
    ("The company expanded its operations to new markets", "Business"),
    ("The CEO announced a new strategic direction", "Business"),
    
    # Finance
    ("The central bank raised interest rates to combat inflation", "Finance"),
    ("Wall Street stock indices surge following earnings", "Finance"),
    ("Gold prices hit a record high amid uncertainty", "Finance"),
    ("The Federal Reserve signaled it may cut interest rates", "Finance"),
    ("The hedge fund reported strong annual returns", "Finance"),
    
    # Economy
    ("The GDP grew by 3.5 percent driven by consumer spending", "Economy"),
    ("The unemployment rate fell to its lowest level", "Economy"),
    ("The inflation rate exceeded expectations", "Economy"),
    ("The trade deficit widened as imports surged", "Economy"),
    ("The housing market cooled as mortgage rates rose", "Economy"),
    
    # Technology
    ("Apple unveiled a new iPhone with AI features", "Technology"),
    ("The tech company announced a breakthrough in quantum computing", "Technology"),
    ("The new processor delivers 50 percent better performance", "Technology"),
    ("The smartphone manufacturer launches flagship device", "Technology"),
    ("The software update brings new privacy features", "Technology"),
    
    # AI
    ("Apple announces a new AI-powered processor", "Artificial Intelligence"),
    ("The research lab published a paper on large language models", "Artificial Intelligence"),
    ("The AI startup raised funding for autonomous coding assistants", "Artificial Intelligence"),
    ("The machine learning model achieved state-of-the-art results", "Artificial Intelligence"),
    ("The company deployed AI agents to automate customer service", "Artificial Intelligence"),
    
    # ML
    ("Engineers implement deep neural network pipeline using PyTorch", "Machine Learning"),
    ("The data science team deployed a recommendation system", "Machine Learning"),
    ("The research paper introduces a novel transformer architecture", "Machine Learning"),
    ("The ML model achieved 95 percent accuracy on image classification", "Machine Learning"),
    ("The team used transfer learning to improve model performance", "Machine Learning"),
    
    # Science
    ("Scientists discovered a new species of deep-sea fish", "Science"),
    ("The research team published findings on gene editing", "Science"),
    ("Physicists observe new state of matter", "Science"),
    ("Biologists discover novel enzyme capable of breaking down plastics", "Science"),
    ("The archaeological discovery pushes back the timeline of human migration", "Science"),
    
    # Space
    ("NASA successfully launched a new satellite", "Space"),
    ("The space agency announced plans for a manned mission to Mars", "Space"),
    ("The telescope captured stunning images of distant galaxies", "Space"),
    ("The rocket company completed a successful test flight", "Space"),
    ("The international space station crew conducted experiments", "Space"),
    
    # Health
    ("The health ministry issued new guidelines for vaccination", "Health"),
    ("A new study found that exercise reduces the risk of heart disease", "Health"),
    ("The hospital opened a new wing dedicated to cancer treatment", "Health"),
    ("Public health officials recommend preventive screening", "Health"),
    ("The mental health initiative launched to support adolescents", "Health"),
    
    # Medicine
    ("Clinical trial shows promising results for novel immunotherapy", "Medicine"),
    ("The FDA approved a new treatment for rare genetic disorder", "Medicine"),
    ("The surgeon performed the first successful robotic-assisted surgery", "Medicine"),
    ("The pharmaceutical company announced positive results from trials", "Medicine"),
    ("The vaccine demonstrated efficacy against multiple variants", "Medicine"),
    
    # Education
    ("The education ministry announces revised national curriculum", "Education"),
    ("The university launched a new program in artificial intelligence", "Education"),
    ("The school district implemented a new STEM-focused curriculum", "Education"),
    ("The online learning platform reached millions of students", "Education"),
    ("The college expanded its scholarship program", "Education"),
    
    # Sports
    ("India wins the final match by five wickets", "Sports"),
    ("The football team won the championship after penalty shootout", "Sports"),
    ("The tennis star won his third Grand Slam title", "Sports"),
    ("The Olympic swimmer breaks world record", "Sports"),
    ("The NBA team rallies in the fourth quarter to win", "Sports"),
    
    # Entertainment
    ("The blockbuster movie broke box office records", "Entertainment"),
    ("The streaming service announced a new original series", "Entertainment"),
    ("The annual awards show celebrates top achievements", "Entertainment"),
    ("The celebrity couple announces charitable foundation", "Entertainment"),
    ("The popular reality TV series renewed for two more seasons", "Entertainment"),
    
    # Movies
    ("The sci-fi blockbuster breaks box office records", "Movies"),
    ("The film director won the prestigious award", "Movies"),
    ("The animated feature became the highest-grossing film", "Movies"),
    ("The movie studio announced a sequel to the hit franchise", "Movies"),
    ("The documentary film shed light on environmental issues", "Movies"),
    
    # Music
    ("The Grammy-winning artist releases surprise album", "Music"),
    ("The band announced a world tour with dates in 30 cities", "Music"),
    ("The music streaming platform reported record subscriber growth", "Music"),
    ("The singer-songwriter won the award for best new artist", "Music"),
    ("The album debuted at number one on the charts", "Music"),
    
    # Gaming
    ("The video game studio releases open-world action RPG", "Gaming"),
    ("The esports tournament attracted millions of viewers", "Gaming"),
    ("The gaming console sold out within hours", "Gaming"),
    ("The mobile game generated over a billion dollars", "Gaming"),
    ("The game developer announced a major expansion", "Gaming"),
    
    # Crime
    ("Police arrest suspect involved in bank robbery", "Crime"),
    ("The investigation uncovered a major corruption scandal", "Crime"),
    ("The court sentenced the defendant to 20 years in prison", "Crime"),
    ("The detective solved the cold case using new forensic techniques", "Crime"),
    ("The jury reached a verdict in the high-profile trial", "Crime"),
    
    # Law
    ("The Supreme Court ruling establishes landmark legal precedent", "Law"),
    ("The antitrust lawsuit targets the tech giant's business practices", "Law"),
    ("The court of appeal overturned the lower court's decision", "Law"),
    ("The legal experts analyze the implications of the new legislation", "Law"),
    ("The judge issued a restraining order in the dispute", "Law"),
    
    # Environment
    ("The conservation project restores coastal wetlands", "Environment"),
    ("The environmental agency announced new regulations on emissions", "Environment"),
    ("The renewable energy project will power thousands of homes", "Environment"),
    ("The wildlife sanctuary expanded its protected area", "Environment"),
    ("The ocean cleanup initiative removed tons of plastic", "Environment"),
    
    # Climate
    ("The UN climate summit concludes with a new agreement", "Climate"),
    ("The climate report warns of accelerating global warming", "Climate"),
    ("The carbon capture technology achieved a breakthrough", "Climate"),
    ("The renewable energy capacity surpassed fossil fuels", "Climate"),
    ("The government announced a target to achieve net-zero emissions", "Climate"),
    
    # Weather
    ("Heavy rainfall and flood warnings issued across the region", "Weather"),
    ("The hurricane made landfall with sustained winds", "Weather"),
    ("The meteorological department predicted above-average temperatures", "Weather"),
    ("The tornado touched down causing significant damage", "Weather"),
    ("The snowstorm disrupted travel across the northeastern states", "Weather"),
    
    # Travel
    ("The aviation association reports record summer passenger travel", "Travel"),
    ("The airline launched direct flights to exotic destinations", "Travel"),
    ("The travel industry rebounded to pre-pandemic levels", "Travel"),
    ("The cruise line announced new itineraries", "Travel"),
    ("The travel app helps tourists discover hidden gems", "Travel"),
    
    # Tourism
    ("The historical heritage site sees surge in foreign tourist arrivals", "Tourism"),
    ("The tourism board launched a campaign to promote domestic travel", "Tourism"),
    ("The eco-tourism project supports local conservation efforts", "Tourism"),
    ("The cultural festival attracted visitors from around the world", "Tourism"),
    ("The tourism industry adopted sustainable practices", "Tourism"),
    
    # Lifestyle
    ("Wellness experts share tips on mindfulness and work-life balance", "Lifestyle"),
    ("The home organization trend emphasizes minimalist living", "Lifestyle"),
    ("The productivity app helps users build better daily habits", "Lifestyle"),
    ("The wellness retreat offers yoga and meditation programs", "Lifestyle"),
    ("The sustainable living guide provides practical eco-friendly tips", "Lifestyle"),
    
    # Fashion
    ("Paris Fashion Week showcases innovative sustainable fabrics", "Fashion"),
    ("The fashion brand launched a capsule collection using recycled materials", "Fashion"),
    ("The streetwear trend influenced high fashion runway shows", "Fashion"),
    ("The fashion designer debuted their collection", "Fashion"),
    ("The luxury brand announced a collaboration with a contemporary artist", "Fashion"),
    
    # Food
    ("The renowned chef opens farm-to-table restaurant", "Food"),
    ("The culinary institute publishes guide on plant-based cooking", "Food"),
    ("Food critics praise new bistro for innovative fusion flavors", "Food"),
    ("The food delivery app expanded its services to 50 new cities", "Food"),
    ("The artisanal bakery is known for its sourdough bread", "Food"),
    
    # Automotive
    ("The automaker unveils new electric vehicle with 500-mile range", "Automotive"),
    ("The autonomous vehicle company expands self-driving fleet testing", "Automotive"),
    ("The sports car brand releases hybrid supercar", "Automotive"),
    ("The car manufacturer recalled 100,000 vehicles", "Automotive"),
    ("The electric vehicle sales surpassed traditional gasoline cars", "Automotive"),
    
    # Agriculture
    ("Farmers adopt precision agriculture technology using drone imagery", "Agriculture"),
    ("The agricultural research center developed drought-resistant crops", "Agriculture"),
    ("The farming cooperative expanded its organic product line", "Agriculture"),
    ("The agricultural subsidy program supported small family farms", "Agriculture"),
    ("The vertical farming startup opened a new facility", "Agriculture"),
    
    # Real Estate
    ("The commercial real estate market sees high demand for green buildings", "Real Estate"),
    ("The housing market prices stabilize as mortgage rates fluctuate", "Real Estate"),
    ("The real estate investment trust acquired a portfolio of office buildings", "Real Estate"),
    ("The property development company broke ground on a new residential tower", "Real Estate"),
    ("The real estate agent reported increased interest in suburban homes", "Real Estate"),
    
    # Startups
    ("The venture capital firm leads 50 million dollar Series B funding", "Startups"),
    ("The startup accelerator program accepted its latest cohort", "Startups"),
    ("The fintech startup disrupted the traditional banking industry", "Startups"),
    ("The startup founder shared their journey at the conference", "Startups"),
    ("The tech unicorn announced plans for an initial public offering", "Startups"),
    
    # Cybersecurity
    ("Cybersecurity firm discovers zero-day vulnerability", "Cybersecurity"),
    ("The ransomware attack disrupted operations at the hospital", "Cybersecurity"),
    ("The cybersecurity conference featured the latest threat intelligence", "Cybersecurity"),
    ("The company hired a chief information security officer", "Cybersecurity"),
    ("The data breach exposed millions of customer records", "Cybersecurity"),
    
    # Social Issues
    ("The advocacy group organizes community march promoting civil rights", "Social Issues"),
    ("The gender pay gap report revealed persistent wage disparities", "Social Issues"),
    ("The social justice movement gained momentum on social media", "Social Issues"),
    ("The community organization provided support to homeless individuals", "Social Issues"),
    ("The diversity and inclusion initiative transformed workplace culture", "Social Issues"),
    
    # Defence
    ("The defense department signs contract for next-generation fighter jet", "Defence"),
    ("The military exercise demonstrated readiness in the region", "Defence"),
    ("The defense technology company unveiled a new drone system", "Defence"),
    ("The naval fleet conducted joint exercises with allied nations", "Defence"),
    ("The defense budget allocation increased for cybersecurity", "Defence"),
    
    # International Affairs
    ("Ambassadors host multilateral summit to negotiate trade deal", "International Affairs"),
    ("The diplomatic mission facilitated dialogue between conflicting parties", "International Affairs"),
    ("The foreign policy expert analyzed the implications of the treaty", "International Affairs"),
    ("The international development agency provided aid to the region", "International Affairs"),
    ("The diplomatic breakthrough eased tensions between the two nations", "International Affairs"),
    
    # Other
    ("The community newsletter shared updates on local events", "Other"),
    ("The trivia night at the pub attracted a large crowd", "Other"),
    ("The crossword puzzle in the newspaper challenged readers", "Other"),
    ("The opinion piece discussed the importance of local journalism", "Other"),
    ("The community bulletin board posted announcements", "Other"),
]

print(f"Testing {len(test_cases)} cases across 39 categories...\n")

correct = 0
wrong = 0
confusion_matrix = {}

for text, expected in test_cases:
    result = model.predict(text)
    predicted = result['primary_category']
    
    if predicted == expected:
        correct += 1
    else:
        wrong += 1
        key = f"{expected} → {predicted}"
        confusion_matrix[key] = confusion_matrix.get(key, 0) + 1
        print(f"WRONG: '{text[:50]}...' Expected={expected}, Got={predicted} ({result['confidence_percentage']}%)")

print(f"\n{'='*60}")
print(f"Results: {correct}/{len(test_cases)} correct ({correct/len(test_cases)*100:.1f}%)")
print(f"Wrong: {wrong}/{len(test_cases)} ({wrong/len(test_cases)*100:.1f}%)")

if confusion_matrix:
    print(f"\nConfusion patterns:")
    for pattern, count in sorted(confusion_matrix.items(), key=lambda x: x[1], reverse=True):
        print(f"  {pattern}: {count} times")
