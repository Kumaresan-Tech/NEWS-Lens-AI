export interface TopCategory {
  category: string;
  confidence: number;
  percentage: string;
}

export interface Keyword {
  keyword: string;
  score: number;
  frequency: number;
}

export interface Entity {
  text: string;
  type: string;
}

export interface CategoryMetadata {
  icon?: string;
  color?: string;
  description?: string;
}

export interface PredictionResult {
  primary_category: string;
  confidence: number;
  confidence_percentage: number;
  top_categories: TopCategory[];
  keywords: Keyword[];
  topics: string[];
  entities: Entity[];
  explanation: string;
  word_count: number;
  char_count: number;
  inference_time_ms: number;
  metadata?: CategoryMetadata;
  timestamp?: string;
  original_text?: string;
}

export interface CategoryItem {
  name: string;
  icon: string;
  color: string;
  description: string;
  precision: number;
  recall: number;
  f1_score: number;
  sample_count: number;
}

export interface PerCategoryMetric {
  precision: number;
  recall: number;
  f1_score: number;
  sample_count: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  training_time_seconds: number;
  vocabulary_size: number;
  total_samples: number;
  num_classes: number;
  model_type: string;
  per_category: Record<string, PerCategoryMetric>;
}

export interface HistoryRecord extends PredictionResult {
  id: string;
  original_text: string;
  timestamp: string;
}
