import { useState, useEffect } from 'react';
import type { HistoryRecord } from '../types';
import { getHistory, deleteHistoryItem, clearAllHistory, exportHistoryJSON } from '../utils/history';
import { CategoryIcon } from '../components/CategoryIcon';
import { History, Search, Trash2, Download, RotateCcw, Calendar, Clock, AlertCircle } from 'lucide-react';

interface HistoryPageProps {
  onReanalyze: (text: string) => void;
}

export const HistoryPage = ({ onReanalyze }: HistoryPageProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setHistoryItems(updated);
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all analysis history?")) {
      clearAllHistory();
      setHistoryItems([]);
      setSelectedRecord(null);
    }
  };

  const filteredHistory = historyItems.filter((item) =>
    item.original_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.primary_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase">
            <History className="w-3.5 h-3.5" />
            <span>Analysis Session Log ({historyItems.length} Records)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Analysis History
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Review past news text predictions, keywords, confidence scores, and exported logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={exportHistoryJSON}
            disabled={historyItems.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-2 disabled:opacity-40 transition-colors"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={historyItems.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-2 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search history by text content or category name..."
          className="w-full bg-slate-900/80 text-slate-200 placeholder-slate-500 pl-11 pr-4 py-3 rounded-2xl border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm transition-all"
        />
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-slate-800/80 space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No history records found</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            {searchTerm ? "No records match your search terms." : "You haven't analyzed any news content yet. Try analyzing a news text!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedRecord(item)}
              className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group"
            >
              <div className="flex items-start gap-4 max-w-3xl">
                <div
                  className="p-3 rounded-2xl text-white shadow-md flex items-center justify-center shrink-0 mt-1 sm:mt-0"
                  style={{ backgroundColor: item.metadata?.color || '#6366f1' }}
                >
                  <CategoryIcon name={item.metadata?.icon || 'HelpCircle'} className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                      {item.primary_category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.confidence_percentage}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    "{item.original_text}"
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReanalyze(item.original_text);
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-800 transition-colors"
                  title="Re-analyze in Analyzer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-2xl text-white shadow-md"
                  style={{ backgroundColor: selectedRecord.metadata?.color || '#6366f1' }}
                >
                  <CategoryIcon name={selectedRecord.metadata?.icon || 'HelpCircle'} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">{selectedRecord.primary_category}</h3>
                  <p className="text-xs text-slate-400">Confidence: {selectedRecord.confidence_percentage}%</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-400 block mb-1">Original Text:</span>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-mono leading-relaxed">
                  "{selectedRecord.original_text}"
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block mb-1">AI Explanation:</span>
                <p className="text-slate-300 leading-relaxed bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
                  {selectedRecord.explanation}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block mb-1">Top Predictions:</span>
                <div className="space-y-1.5">
                  {selectedRecord.top_categories.map((tc) => (
                    <div key={tc.category} className="flex justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-300">{tc.category}</span>
                      <span className="font-mono text-indigo-400 font-semibold">{tc.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  onReanalyze(selectedRecord.original_text);
                  setSelectedRecord(null);
                }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-analyze Text</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
