import type { PredictionResult, HistoryRecord } from '../types';

const HISTORY_KEY = 'news_ai_analysis_history';

export function getHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load history from localStorage', err);
    return [];
  }
}

export function saveToHistory(text: string, result: PredictionResult): HistoryRecord {
  const history = getHistory();
  const newRecord: HistoryRecord = {
    ...result,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    original_text: text,
    timestamp: new Date().toISOString(),
  };

  // Keep latest 100 items
  const updated = [newRecord, ...history].slice(0, 100);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save record to localStorage', err);
  }
  return newRecord;
}

export function deleteHistoryItem(id: string): HistoryRecord[] {
  const history = getHistory();
  const updated = history.filter((item) => item.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete history item', err);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}

export function exportHistoryJSON(): void {
  const history = getHistory();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `news_ai_history_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
