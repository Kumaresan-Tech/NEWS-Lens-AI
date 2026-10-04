import { useState, useEffect } from 'react';
import type { CategoryItem } from '../types';
import { fetchCategories, FALLBACK_CATEGORIES } from '../services/api';
import { CategoryIcon } from '../components/CategoryIcon';
import { Search, Sparkles, Filter, Layers } from 'lucide-react';

interface CategoriesPageProps {
  onSelectCategorySample: (sampleText: string) => void;
}

const CATEGORY_SAMPLES: Record<string, string> = {
  "Politics": "The president signed a new bill into law after a heated debate in congress over the proposed legislation.",
  "World": "The United Nations Security Council held an emergency session to address the escalating conflict in the region.",
  "National": "The federal government announced a new infrastructure program to rebuild highways and bridges across the country.",
  "Local": "The city council approved funding for a new community park and library renovation project downtown.",
  "Business": "The company reported record quarterly profits and announced plans to expand into new international markets.",
  "Finance": "The central bank raised interest rates by 25 basis points to combat rising inflation pressures.",
  "Economy": "The GDP grew by 3.5 percent this quarter driven by strong consumer spending and export growth.",
  "Technology": "The tech company unveiled a new smartphone with advanced AI capabilities and a revolutionary camera system.",
  "Artificial Intelligence": "Researchers developed a new large language model that can reason and generate human-like text.",
  "Machine Learning": "The team trained a deep neural network using TensorFlow to detect anomalies in sensor data.",
  "Science": "Scientists discovered a new species of deep-sea fish during an expedition in the Pacific Ocean.",
  "Space": "NASA successfully launched a new satellite to study climate change and rising sea levels.",
  "Health": "The health ministry issued new guidelines for vaccination and preventive care for the upcoming flu season.",
  "Medicine": "A clinical trial showed promising results for a new cancer treatment using immunotherapy.",
  "Education": "The education ministry announced a new curriculum focused on STEM subjects and digital literacy.",
  "Sports": "The national cricket team won the championship final by five wickets in a thrilling match.",
  "Entertainment": "The annual awards show celebrated the best achievements in television and streaming content.",
  "Movies": "The new sci-fi blockbuster broke box office records earning over 200 million dollars.",
  "Music": "The Grammy-winning artist released a new album that topped the charts in 30 countries.",
  "Gaming": "The video game studio released a new open-world RPG with stunning graphics and immersive gameplay.",
  "Crime": "Police arrested the suspect involved in a high-profile robbery after a multi-state investigation.",
  "Law": "The Supreme Court issued a landmark ruling on privacy rights that sets a new legal precedent.",
  "Environment": "A conservation project restored coastal wetlands protecting endangered bird species from extinction.",
  "Climate": "The UN climate summit concluded with a new agreement to reduce carbon emissions by 2030.",
  "Weather": "Meteorologists issued a severe storm warning as a category 4 hurricane approaches the coast.",
  "Travel": "The airline launched a new direct route connecting major cities with fuel-efficient aircraft.",
  "Tourism": "The historical heritage site saw a 30 percent increase in tourist arrivals this year.",
  "Lifestyle": "Wellness experts shared tips on mindfulness and work-life balance for better mental health.",
  "Fashion": "Paris Fashion Week showcased innovative sustainable fabrics and avant-garde designs.",
  "Food": "The renowned chef opened a new farm-to-table restaurant featuring seasonal organic cuisine.",
  "Automotive": "The automaker unveiled a new electric vehicle with 500-mile range and fast charging.",
  "Agriculture": "Farmers adopted new precision agriculture technology using drones for crop monitoring.",
  "Real Estate": "The housing market showed signs of stabilization as new construction increased.",
  "Startups": "The fintech startup raised 50 million dollars in Series B funding from venture capitalists.",
  "Cybersecurity": "Security researchers discovered a critical zero-day vulnerability in popular software.",
  "Social Issues": "An advocacy group organized a march promoting civil rights and equal wages for workers.",
  "Defence": "The defense department signed a contract for next-generation fighter jets and radar systems.",
  "International Affairs": "Ambassadors from multiple countries gathered for a summit on trade and security cooperation.",
  "Human Rights": "The human rights organization condemned the treatment of political prisoners in the region.",
  "Other": "The community center announced a new schedule of events and activities for the month."
};

function getCategorySampleText(categoryName: string): string {
  return CATEGORY_SAMPLES[categoryName] || `Breaking news and latest updates regarding ${categoryName.toLowerCase()} with in-depth analysis and expert commentary.`;
}

export const CategoriesPage = ({ onSelectCategorySample }: CategoriesPageProps) => {
  const [categories, setCategories] = useState<CategoryItem[]>(FALLBACK_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.warn('Using default fallback categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCategories = (categories || []).filter((cat) =>
    (cat?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Supported Multi-Class System ({categories.length} Categories)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            News Categories Catalog
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse all {categories.length} supported news domain classes, model precision rates, and test sample articles.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-slate-900/80 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Grid of Category Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="h-44 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => (
            <div
              key={cat.name}
              className="glass-card p-5 rounded-3xl border border-slate-800/80 flex flex-col justify-between space-y-4 group hover:border-indigo-500/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="p-3 rounded-2xl text-white shadow-md flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: cat.color || '#6366f1' }}
                  >
                    <CategoryIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                    {cat.sample_count} Samples
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                {/* Metric Badges */}
                <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                  <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 block">Prec</span>
                    <span className="font-mono text-emerald-400 font-semibold">{Math.round(cat.precision * 100)}%</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 block">Rec</span>
                    <span className="font-mono text-indigo-400 font-semibold">{Math.round(cat.recall * 100)}%</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-500 block">F1</span>
                    <span className="font-mono text-pink-400 font-semibold">{Math.round(cat.f1_score * 100)}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategorySample(getCategorySampleText(cat.name))}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Sample</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCategories.length === 0 && !isLoading && (
        <div className="text-center py-16 glass-card rounded-3xl border border-slate-800/80">
          <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No categories found</h3>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};
