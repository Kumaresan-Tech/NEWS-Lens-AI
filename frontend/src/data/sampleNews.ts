export interface SampleNewsItem {
  id: string;
  category: string;
  title: string;
  text: string;
  badgeColor: string;
}

export const SAMPLE_NEWS_LIST: SampleNewsItem[] = [
  {
    id: "tech_ai",
    category: "Artificial Intelligence",
    title: "Apple & OpenAI AI Chip",
    text: "Apple announces a new AI-powered processor for next-generation devices, featuring 100 billion neural parameters and custom transformer execution units.",
    badgeColor: "#ec4899"
  },
  {
    id: "sports_cricket",
    category: "Sports",
    title: "India Cricket Victory",
    text: "India wins the final match by five wickets in a tense last-over thriller at the stadium, claiming the championship trophy before thousands of cheering fans.",
    badgeColor: "#f97316"
  },
  {
    id: "politics_edu",
    category: "Politics / Education",
    title: "National Education Policy",
    text: "The central government announces a new education policy reforming national curriculum standards, expanding STEM university grants, and funding early childhood research.",
    badgeColor: "#ef4444"
  },
  {
    id: "space_science",
    category: "Space / Science",
    title: "Habitable Exoplanet Discovery",
    text: "Scientists discover a potentially habitable planet orbiting a nearby red dwarf star using the James Webb Space Telescope's atmospheric spectroscopy sensors.",
    badgeColor: "#3b82f6"
  },
  {
    id: "weather_env",
    category: "Weather / Environment",
    title: "Severe Storm & Flooding Alert",
    text: "Heavy rainfall and category 3 hurricane winds cause coastal flooding across the region, triggering emergency evacuations and meteorological warnings.",
    badgeColor: "#0284c7"
  },
  {
    id: "startup_finance",
    category: "Startups / Business",
    title: "Fintech Startup $50M Series B",
    text: "A Silicon Valley venture capital firm leads a 50 million dollar Series B funding round for an innovative payment tech startup scaling rapidly across Europe.",
    badgeColor: "#eab308"
  },
  {
    id: "cybersecurity",
    category: "Cybersecurity",
    title: "Zero-Day Vulnerability Alert",
    text: "Cybersecurity researchers expose a high-severity zero-day exploit targeting enterprise cloud infrastructure and urge immediate security patch updates.",
    badgeColor: "#dc2626"
  },
  {
    id: "automotive_ev",
    category: "Automotive",
    title: "EV Supercar Fast Charge",
    text: "Automaker unveils next-gen electric vehicle featuring solid-state battery technology, achieving 600 miles of range and 15-minute ultra-fast charging capability.",
    badgeColor: "#6366f1"
  }
];
