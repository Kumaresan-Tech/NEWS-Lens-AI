import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroAnalyzer } from './components/HeroAnalyzer';
import { CategoriesPage } from './pages/CategoriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HistoryPage } from './pages/HistoryPage';
import { checkBackendHealth } from './services/api';
import { Brain, Terminal, Sparkles, Zap, Globe, Cpu, Layers } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'categories' | 'analytics' | 'history'>('analyzer');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('newsai_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [analyzerInputText, setAnalyzerInputText] = useState<string>('');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
      localStorage.setItem('newsai_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('newsai_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    async function verifyHealth() {
      const isHealthy = await checkBackendHealth();
      setIsBackendOnline(isHealthy);
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCategorySample = (sampleText: string) => {
    setAnalyzerInputText(sampleText);
    setActiveTab('analyzer');
  };

  const handleReanalyzeFromHistory = (text: string) => {
    setAnalyzerInputText(text);
    setActiveTab('analyzer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-indigo-500/40 selection:text-white">
      {/* Animated AI Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Primary glow orbs */}
        <div className="absolute top-[-10%] left-[10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[60%] left-[20%] w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '6s' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-transparent to-[#020617]/80" />
      </div>

      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isBackendOnline={isBackendOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 z-10 relative">
        {activeTab === 'analyzer' && (
          <HeroAnalyzer initialText={analyzerInputText} />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage onSelectCategorySample={handleSelectCategorySample} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {activeTab === 'history' && (
          <HistoryPage onReanalyze={handleReanalyzeFromHistory} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-500/10 py-8 px-4 lg:px-8 z-10 relative mt-16 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">NewsAI Analyzer</h4>
                <p className="text-xs text-slate-500 mt-1">40-category ML classifier</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Scikit-Learn</h4>
                <p className="text-xs text-slate-500 mt-1">TF-IDF + LogisticRegression</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Fast Inference</h4>
                <p className="text-xs text-slate-500 mt-1">Optimized for real-time analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <Globe className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">40 Categories</h4>
                <p className="text-xs text-slate-500 mt-1">Comprehensive news coverage</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-slate-300">NewsAI Category Analyzer</span>
              <span>•</span>
              <span>Production ML Model</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                FastAPI + React + TypeScript
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                40 Classes Ready
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
