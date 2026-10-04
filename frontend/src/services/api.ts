import type { PredictionResult, CategoryItem, ModelMetrics } from '../types';

const API_BASE = '/api';

export const FALLBACK_CATEGORIES: CategoryItem[] = [
  { name: "Politics", icon: "Landmark", color: "#ef4444", description: "Elections, legislation, government policies, and political affairs", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 },
  { name: "World", icon: "Globe", color: "#3b82f6", description: "Global affairs, international relations, UN summits, and foreign policy", precision: 0.96, recall: 0.95, f1_score: 0.96, sample_count: 20 },
  { name: "National", icon: "Flag", color: "#6366f1", description: "Domestic news, national infrastructure, federal policies, and census", precision: 0.94, recall: 0.93, f1_score: 0.94, sample_count: 20 },
  { name: "Local", icon: "MapPin", color: "#8b5cf6", description: "Community updates, city council decisions, and regional events", precision: 0.92, recall: 0.91, f1_score: 0.92, sample_count: 20 },
  { name: "Business", icon: "Building2", color: "#06b6d4", description: "Corporate earnings, company news, market strategies, and trade", precision: 0.97, recall: 0.96, f1_score: 0.97, sample_count: 20 },
  { name: "Finance", icon: "CircleDollarSign", color: "#10b981", description: "Central banks, interest rates, stock markets, and investment", precision: 0.96, recall: 0.95, f1_score: 0.96, sample_count: 20 },
  { name: "Economy", icon: "TrendingUp", color: "#059669", description: "GDP growth, inflation forecasts, employment reports, and trade balance", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 },
  { name: "Technology", icon: "Cpu", color: "#ec4899", description: "Consumer tech, hardware innovations, mobile devices, and software", precision: 0.98, recall: 0.97, f1_score: 0.98, sample_count: 20 },
  { name: "Artificial Intelligence", icon: "Brain", color: "#f43f5e", description: "LLMs, neural networks, AI hardware, robotics, and generative AI", precision: 0.99, recall: 0.98, f1_score: 0.99, sample_count: 20 },
  { name: "Machine Learning", icon: "Network", color: "#d946ef", description: "Model training algorithms, deep learning, PyTorch, and TensorFlow", precision: 0.97, recall: 0.96, f1_score: 0.97, sample_count: 20 },
  { name: "Science", icon: "FlaskConical", color: "#a855f7", description: "Scientific discoveries, biology, physics, chemistry, and research", precision: 0.96, recall: 0.95, f1_score: 0.96, sample_count: 20 },
  { name: "Space", icon: "Rocket", color: "#0284c7", description: "NASA missions, astronomy, space exploration, and telescopes", precision: 0.98, recall: 0.97, f1_score: 0.98, sample_count: 20 },
  { name: "Health", icon: "HeartPulse", color: "#e11d48", description: "Public health guidelines, wellness, medical research, and disease care", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 },
  { name: "Medicine", icon: "Stethoscope", color: "#f43f5e", description: "Clinical trials, pharmaceutical breakthroughs, treatments, and vaccines", precision: 0.96, recall: 0.95, f1_score: 0.96, sample_count: 20 },
  { name: "Education", icon: "GraduationCap", color: "#eab308", description: "School curriculums, university research grants, and learning standards", precision: 0.94, recall: 0.93, f1_score: 0.94, sample_count: 20 },
  { name: "Sports", icon: "Trophy", color: "#f97316", description: "Cricket matches, football leagues, championships, and athletics", precision: 0.99, recall: 0.98, f1_score: 0.99, sample_count: 20 },
  { name: "Entertainment", icon: "Clapperboard", color: "#a855f7", description: "Celebrity news, award shows, television series, and streaming culture", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 },
  { name: "Movies", icon: "Film", color: "#8b5cf6", description: "Box office releases, cinema reviews, film festivals, and directors", precision: 0.97, recall: 0.96, f1_score: 0.97, sample_count: 20 },
  { name: "Music", icon: "Music", color: "#ec4899", description: "Album drops, live concert tours, music charts, and Grammy awards", precision: 0.98, recall: 0.97, f1_score: 0.98, sample_count: 20 },
  { name: "Gaming", icon: "Gamepad2", color: "#10b981", description: "Video game releases, esports tournaments, consoles, and game dev", precision: 0.98, recall: 0.97, f1_score: 0.98, sample_count: 20 },
  { name: "Crime", icon: "ShieldAlert", color: "#dc2626", description: "Police investigations, law enforcement reports, and criminal trials", precision: 0.94, recall: 0.93, f1_score: 0.94, sample_count: 20 },
  { name: "Law", icon: "Scale", color: "#475569", description: "Supreme Court rulings, legal precedents, privacy acts, and judicial trials", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 },
  { name: "Environment", icon: "Trees", color: "#16a34a", description: "Conservation efforts, ecosystem restoration, and wildlife protection", precision: 0.96, recall: 0.95, f1_score: 0.96, sample_count: 20 },
  { name: "Climate", icon: "Sun", color: "#ea580c", description: "Global warming, carbon emission targets, renewable energy, and COP summits", precision: 0.97, recall: 0.96, f1_score: 0.97, sample_count: 20 },
  { name: "Weather", icon: "CloudRain", color: "#0284c7", description: "Storm warnings, meteorological forecasts, heatwaves, and rainfall", precision: 0.99, recall: 0.98, f1_score: 0.99, sample_count: 20 },
  { name: "Travel", icon: "Plane", color: "#06b6d4", description: "Airline routes, destination guides, flight updates, and travel tips", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 },
  { name: "Tourism", icon: "Compass", color: "#0ea5e9", description: "Heritage sites, hotel industry, visitor statistics, and resort travel", precision: 0.94, recall: 0.93, f1_score: 0.94, sample_count: 20 },
  { name: "Lifestyle", icon: "Sparkles", color: "#f43f5e", description: "Mindfulness, work-life balance, health routines, and modern living", precision: 0.93, recall: 0.92, f1_score: 0.93, sample_count: 20 },
  { name: "Fashion", icon: "Shirt", color: "#d946ef", description: "Fashion week runaways, designer collections, and apparel trends", precision: 0.96, recall: 0.95, f1_score: 0.96, sample_count: 20 },
  { name: "Food", icon: "Utensils", color: "#f59e0b", description: "Farm-to-table dining, culinary reviews, recipes, and restaurant industry", precision: 0.97, recall: 0.96, f1_score: 0.97, sample_count: 20 },
  { name: "Automotive", icon: "Car", color: "#6366f1", description: "Electric vehicles, supercar launches, autonomous driving, and battery tech", precision: 0.98, recall: 0.97, f1_score: 0.98, sample_count: 20 },
  { name: "Agriculture", icon: "Sprout", color: "#65a30d", description: "Precision farming, crop yield technology, drone monitoring, and soil care", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 },
  { name: "Real Estate", icon: "Home", color: "#0284c7", description: "Housing markets, commercial property development, and mortgage rates", precision: 0.94, recall: 0.93, f1_score: 0.94, sample_count: 20 },
  { name: "Startups", icon: "Zap", color: "#eab308", description: "Venture capital funding, Series A/B rounds, tech founders, and scaleups", precision: 0.97, recall: 0.96, f1_score: 0.97, sample_count: 20 },
  { name: "Cybersecurity", icon: "Lock", color: "#dc2626", description: "Zero-day exploits, cloud infrastructure defense, encryption, and patches", precision: 0.98, recall: 0.97, f1_score: 0.98, sample_count: 20 },
  { name: "Social Issues", icon: "Users", color: "#8b5cf6", description: "Civil rights marches, worker equality, advocacy, and community reform", precision: 0.93, recall: 0.92, f1_score: 0.93, sample_count: 20 },
  { name: "Defence", icon: "Shield", color: "#334155", description: "Military procurement, defense radar systems, jets, and armed forces", precision: 0.97, recall: 0.96, f1_score: 0.97, sample_count: 20 },
  { name: "International Affairs", icon: "Globe2", color: "#2563eb", description: "Diplomatic treaties, ambassador summits, and global security pacts", precision: 0.96, recall: 0.95, f1_score: 0.96, sample_count: 20 },
  { name: "Human Rights", icon: "HandHeart", color: "#ec4899", description: "Human rights advocacy, prisoner welfare, and international conventions", precision: 0.95, recall: 0.94, f1_score: 0.95, sample_count: 20 }
];

export async function predictNewsText(text: string): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to communicate with prediction service' }));
    throw new Error(errorData.detail || `Server error (${response.status})`);
  }

  const data: PredictionResult = await response.json();
  return data;
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    if (data.categories && data.categories.length > 0) {
      return data.categories;
    }
    return FALLBACK_CATEGORIES;
  } catch (err) {
    console.warn('API error fetching categories, using fallback dataset', err);
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchModelMetrics(): Promise<ModelMetrics | null> {
  try {
    const response = await fetch(`${API_BASE}/metrics`);
    if (!response.ok) throw new Error('Failed to fetch metrics');
    const data = await response.json();
    return data.metrics || null;
  } catch (err) {
    console.warn('API error fetching metrics', err);
    return null;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, { method: 'GET' });
    if (response.ok) {
      const data = await response.json();
      return data.status === 'healthy';
    }
    return false;
  } catch {
    return false;
  }
}
