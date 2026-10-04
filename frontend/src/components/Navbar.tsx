import { Brain, Sparkles, LayoutGrid, BarChart3, History, Moon, Sun, ShieldCheck, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'categories' | 'analytics' | 'history';
  setActiveTab: (tab: 'analyzer' | 'categories' | 'analytics' | 'history') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isBackendOnline: boolean;
}

export const Navbar = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  isBackendOnline
}: NavbarProps) => {
  const tabs = [
    { id: 'analyzer' as const, icon: Sparkles, label: 'Analyzer' },
    { id: 'categories' as const, icon: LayoutGrid, label: 'Categories' },
    { id: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
    { id: 'history' as const, icon: History, label: 'History' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-indigo-500/10 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('analyzer')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
              <Brain className="w-5 h-5" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#020617] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight gradient-text">
                NewsAI
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-md bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block tracking-wide">AI News Category Classifier</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25" />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
              isBackendOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
            title={isBackendOnline ? "FastAPI ML Server Connected" : "Connecting to FastAPI backend..."}
          >
            {isBackendOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">ML Active</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden lg:inline">Standby</span>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50 cursor-pointer shadow-sm active:scale-95"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Light and Dark Theme"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span className="text-xs font-medium text-amber-200 hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-300 hidden md:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
