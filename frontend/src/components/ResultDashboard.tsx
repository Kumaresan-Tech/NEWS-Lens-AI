import type { PredictionResult } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Cpu, Tag, FileText, CheckCircle2, Clock, Zap, Layers, Sparkles, TrendingUp } from 'lucide-react';

interface ResultDashboardProps {
  result: PredictionResult;
  onClear: () => void;
}

export const ResultDashboard = ({ result, onClear }: ResultDashboardProps) => {
  const {
    primary_category,
    confidence_percentage,
    top_categories,
    keywords,
    topics,
    entities,
    explanation,
    word_count,
    char_count,
    inference_time_ms,
    metadata
  } = result;

  const iconName = metadata?.icon || 'HelpCircle';
  const themeColor = metadata?.color || '#6366f1';

  const chartData = top_categories.map((item) => ({
    name: item.category,
    confidence: Math.round(item.confidence * 100),
  }));

  const getConfidenceBadgeColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (val >= 50) return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  };

  const getConfidenceLabel = (val: number) => {
    if (val >= 80) return 'High Confidence';
    if (val >= 50) return 'Moderate Confidence';
    return 'Tentative';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-indigo-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-20" style={{ backgroundColor: themeColor }} />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl flex items-center justify-center text-white shadow-xl animate-glow"
              style={{ backgroundColor: themeColor, boxShadow: `0 8px 32px ${themeColor}40` }}
            >
              <CategoryIcon name={iconName} className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Primary Classification</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getConfidenceBadgeColor(confidence_percentage)}`}>
                  {confidence_percentage}% — {getConfidenceLabel(confidence_percentage)}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {primary_category}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/50 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono">{inference_time_ms} ms</span>
            </div>
            <button
              onClick={onClear}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50"
            >
              Analyze Another
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Top Predictions & Chart, Right AI Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (7 cols): Confidence Gauge & Predictions */}
        <div className="lg:col-span-7 space-y-6">

          {/* Top 5 Probability Breakdown */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Top Predicted Categories</span>
              </h3>
              <span className="text-xs text-slate-500">Multi-class Probabilities</span>
            </div>

            <div className="space-y-4">
              {top_categories.map((cat, idx) => {
                const confVal = Math.round(cat.confidence * 100);
                const isTop = idx === 0;
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className={isTop ? 'text-indigo-300 font-bold flex items-center gap-1.5' : 'text-slate-300'}>
                        {isTop && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {idx + 1}. {cat.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{confVal}%</span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/50">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out animate-bar-fill ${
                          isTop
                            ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-md shadow-indigo-500/30'
                            : 'bg-slate-700'
                        }`}
                        style={{ width: `${confVal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Probability Chart */}
            <div className="mt-6 pt-6 border-t border-slate-800/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Probability Distribution
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={11} unit="%" />
                    <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={110} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                      formatter={(val: any) => [`${val}%`, 'Confidence']}
                    />
                    <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? themeColor : '#334155'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Keywords & Main Topics */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/10">
            <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-pink-400" />
              <span>Extracted Keywords & Topics</span>
            </h3>

            {/* Topics */}
            {topics.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase text-slate-500 block mb-2">Main Topics</span>
                <div className="flex flex-wrap gap-2">
                  {topics.map((tp, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-indigo-400" />
                      {tp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords Chips */}
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-2">Keywords by TF-IDF Weight</span>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw.keyword}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-xs font-mono transition-all duration-300 flex items-center gap-1.5"
                  >
                    <span>{kw.keyword}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded-full border border-slate-800/50">
                      {Math.round(kw.score * 100)}%
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Entities if any */}
            {entities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/50">
                <span className="text-xs font-semibold uppercase text-slate-500 block mb-2">Detected Named Entities</span>
                <div className="flex flex-wrap gap-2">
                  {entities.map((ent, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>{ent.text}</span>
                      <span className="text-[10px] text-purple-400/70 font-mono">({ent.type})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): AI Explanation & Text Input Preview */}
        <div className="lg:col-span-5 space-y-6">

          {/* AI Explanation Card */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>AI Classification Rationale</span>
            </h3>

            <p className="text-slate-300 text-sm leading-relaxed mb-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
              {explanation}
            </p>

            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span>Model Architecture</span>
                <span className="text-slate-300 font-mono">TF-IDF + LogisticReg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span>Domain Category</span>
                <span className="text-slate-300 font-medium">{primary_category}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Description</span>
                <span className="text-slate-400 italic text-right max-w-[200px]">
                  {metadata?.description || 'Standard news coverage'}
                </span>
              </div>
            </div>
          </div>

          {/* Original Text Preview */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Analyzed Text</span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{word_count} words</span>
                <span className="text-slate-700">•</span>
                <span>{char_count} chars</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/50 text-xs text-slate-300 font-mono leading-relaxed max-h-44 overflow-y-auto">
              "{result.original_text}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
