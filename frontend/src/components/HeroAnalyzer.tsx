import { useState } from 'react';
import type { PredictionResult } from '../types';
import { predictNewsText } from '../services/api';
import { saveToHistory } from '../utils/history';
import { SAMPLE_NEWS_LIST, type SampleNewsItem } from '../data/sampleNews';
import { ResultDashboard } from './ResultDashboard';
import { Trash2, ArrowRight, Loader2, RefreshCw, AlertCircle, Quote, Compass, Brain, Zap } from 'lucide-react';

interface HeroAnalyzerProps {
  onAnalyzeSuccess?: (record: PredictionResult) => void;
  initialText?: string;
}

export const HeroAnalyzer = ({ onAnalyzeSuccess, initialText = '' }: HeroAnalyzerProps) => {
  const [inputText, setInputText] = useState<string>(initialText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const handleAnalyze = async (overrideText?: string) => {
    const textToAnalyze = (overrideText !== undefined ? overrideText : inputText).trim();

    if (!textToAnalyze) {
      setErrorMessage("Please enter a news headline, paragraph, or full article text to analyze.");
      return;
    }

    if (textToAnalyze.length < 3) {
      setErrorMessage("Input text is too short. Please provide at least 3 characters.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await predictNewsText(textToAnalyze);
      res.original_text = textToAnalyze;
      setResult(res);

      saveToHistory(textToAnalyze, res);
      if (onAnalyzeSuccess) {
        onAnalyzeSuccess(res);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to complete news category classification. Make sure the backend is active.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleClick = (sample: SampleNewsItem) => {
    setInputText(sample.text);
    handleAnalyze(sample.text);
  };

  const handleRandomSample = () => {
    const randomItem = SAMPLE_NEWS_LIST[Math.floor(Math.random() * SAMPLE_NEWS_LIST.length)];
    setInputText(randomItem.text);
    handleAnalyze(randomItem.text);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-indigo-500/5">
          <Brain className="w-3.5 h-3.5" />
          <span>Multi-Class Scikit-Learn ML Classifier</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1]">
          <span className="text-white">AI-Powered</span>
          <br />
          <span className="gradient-text">News Category Analyzer</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Analyze any news headline, sentence, paragraph, or complete article and instantly discover its precise category, confidence score, keywords, and AI rationale.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 pt-2">
          <div className="text-center">
            <div className="text-2xl font-black text-white">40</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Categories</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Accuracy</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">&lt;50ms</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Inference</div>
          </div>
        </div>
      </div>

      {/* Main Analyzer Input Box */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/10 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="space-y-5">
          {/* Header & Quick Sample Trigger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Quote className="w-4 h-4 text-indigo-400" />
              <span>Enter News Content</span>
            </label>

            <button
              onClick={handleRandomSample}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition-all duration-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Random Sample</span>
            </button>
          </div>

          {/* Text Area */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type news headline, press release, sentence, paragraph, or complete news article here..."
              rows={5}
              className="relative w-full bg-slate-950/80 text-slate-100 placeholder-slate-600 p-4 rounded-2xl border border-slate-800 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-y text-sm font-sans transition-all duration-300"
            />

            {/* Counters Badge */}
            <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs font-mono text-slate-500 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-sm">
              <span>{wordCount} words</span>
              <span className="text-slate-700">•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          {/* Sample Preset Buttons */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Test Presets across Categories:</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {SAMPLE_NEWS_LIST.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSampleClick(sample)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-all duration-300 flex items-center gap-2 group disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <span className="w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-slate-900" style={{ backgroundColor: sample.badgeColor }} />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-center gap-3 animate-scale-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
            <button
              onClick={handleClear}
              disabled={isLoading || (!inputText && !result)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Input</span>
            </button>

            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-bold text-white btn-glow transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Classifying...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Analyze News Category</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Dashboard */}
      {result && (
        <div id="results-dashboard" className="pt-4 animate-fade-in-up">
          <ResultDashboard result={result} onClear={handleClear} />
        </div>
      )}
    </div>
  );
};
