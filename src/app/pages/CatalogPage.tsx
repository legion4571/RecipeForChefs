import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Clock,
  Users,
  Thermometer,
  ChefHat,
  Filter,
  BookOpen,
  X,
} from "lucide-react";
import { RECIPES, CATEGORIES, type Category, type Recipe } from "../data/recipes";

const ALL_CATEGORY = "all";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Базовый",
  2: "Простой",
  3: "Средний",
  4: "Сложный",
  5: "Мастер",
};

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((d) => (
        <div
          key={d}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: d <= level ? "#1A1A1A" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  const cat = CATEGORIES[category];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wide"
      style={{
        backgroundColor: cat.bg,
        color: cat.textColor,
        border: `1px solid ${cat.border}`,
        fontWeight: 600,
        letterSpacing: "0.06em",
      }}
    >
      {cat.label}
    </span>
  );
}

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  const cat = CATEGORIES[recipe.category];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-200 hover:border-gray-400 transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      style={{ borderLeft: `4px solid ${cat.color}` }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-base leading-snug text-gray-900 group-hover:text-gray-600 transition-colors" style={{ fontWeight: 700 }}>
            {recipe.name}
          </h2>
          <CategoryBadge category={recipe.category} />
        </div>
        <div className="flex items-center gap-1">
          <DifficultyDots level={recipe.difficulty} />
          <span className="text-xs text-gray-500 ml-1">{DIFFICULTY_LABELS[recipe.difficulty]}</span>
        </div>
      </div>

      {/* Params */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide" style={{ fontSize: "10px" }}>Время</span>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
              {recipe.cookingTime < 60
                ? `${recipe.cookingTime} мин`
                : `${Math.floor(recipe.cookingTime / 60)} ч ${recipe.cookingTime % 60 > 0 ? `${recipe.cookingTime % 60} м` : ""}`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide" style={{ fontSize: "10px" }}>Порции</span>
          <div className="flex items-center gap-1">
            <Users size={12} className="text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{recipe.portions} пор.</span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide" style={{ fontSize: "10px" }}>Т° подачи</span>
          <div className="flex items-center gap-1">
            <Thermometer size={12} className="text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{recipe.servingTemp}°C</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400">{recipe.portionWeight} г/пор</span>
      </div>
    </button>
  );
}

export function CatalogPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | typeof ALL_CATEGORY>(ALL_CATEGORY);
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return RECIPES.filter((r) => {
      const matchCat = activeCategory === ALL_CATEGORY || r.category === activeCategory;
      const matchSearch =
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchDiff = difficultyFilter === null || r.difficulty === difficultyFilter;
      return matchCat && matchSearch && matchDiff;
    });
  }, [searchQuery, activeCategory, difficultyFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: RECIPES.length };
    RECIPES.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="bg-white/10 p-1.5 rounded">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <div className="text-white leading-none" style={{ fontWeight: 700, fontSize: "16px" }}>
                КухняПРО
              </div>
              <div className="text-gray-400 leading-none mt-0.5" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                КАТАЛОГ РЕЦЕПТУР
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию или тегу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 pl-9 pr-9 py-2 text-sm focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              style={{ borderRadius: 0 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm border transition-all flex-shrink-0 ${
              showFilters || difficultyFilter !== null
                ? "bg-white text-gray-900 border-white"
                : "bg-transparent text-gray-300 border-white/30 hover:border-white/60"
            }`}
          >
            <Filter size={14} />
            <span style={{ fontWeight: 600 }}>Фильтр</span>
            {difficultyFilter !== null && (
              <span className="bg-gray-900 text-white text-xs px-1 rounded">{difficultyFilter}</span>
            )}
          </button>

          {/* Count */}
          <div className="text-gray-400 text-sm flex-shrink-0 hidden sm:block">
            <span className="text-white" style={{ fontWeight: 700 }}>{filtered.length}</span>
            <span> / {RECIPES.length}</span>
          </div>
        </div>

        {/* Category filters */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 flex gap-0 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(ALL_CATEGORY)}
              className={`px-4 py-2.5 text-sm flex-shrink-0 transition-all border-b-2 ${
                activeCategory === ALL_CATEGORY
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
              style={{ fontWeight: activeCategory === ALL_CATEGORY ? 700 : 500 }}
            >
              Все блюда
              <span className="ml-1.5 text-xs opacity-60">({categoryCounts.all})</span>
            </button>
            {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat]) => (
              <div key={key} className="flex items-center flex-shrink-0">
                {key === 'semifinished' && (
                  <div className="w-px self-stretch bg-white/20 mx-1 my-1.5 flex-shrink-0" />
                )}
                <button
                  onClick={() => setActiveCategory(key as Category)}
                  className={`px-4 py-2.5 text-sm flex-shrink-0 transition-all border-b-2 flex items-center gap-1.5 ${key === 'semifinished' ? 'relative' : ''}`}
                  style={{
                    fontWeight: activeCategory === key ? 700 : 500,
                    borderBottomColor: activeCategory === key ? cat.color : "transparent",
                    color: activeCategory === key ? "white" : "#9CA3AF",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.label}
                  <span className="text-xs opacity-60">({categoryCounts[key] || 0})</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="border-t border-white/10 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
              <span className="text-gray-400 text-sm" style={{ fontWeight: 600 }}>Сложность:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setDifficultyFilter(null)}
                  className={`px-3 py-1 text-xs border transition-all ${
                    difficultyFilter === null
                      ? "bg-white text-gray-900 border-white"
                      : "text-gray-400 border-white/20 hover:border-white/40"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Все
                </button>
                {[1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
                    className={`px-3 py-1 text-xs border transition-all ${
                      difficultyFilter === d
                        ? "bg-white text-gray-900 border-white"
                        : "text-gray-400 border-white/20 hover:border-white/40"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {DIFFICULTY_LABELS[d]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg" style={{ fontWeight: 600 }}>Рецепты не найдены</p>
            <p className="text-gray-400 text-sm mt-1">Измените параметры поиска или фильтры</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory(ALL_CATEGORY); setDifficultyFilter(null); }}
              className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Сбросить все фильтры
            </button>
          </div>
        ) : (
          <>
            {/* Active filter info */}
            {(searchQuery || activeCategory !== ALL_CATEGORY || difficultyFilter !== null) && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Активные фильтры:</span>
                {activeCategory !== ALL_CATEGORY && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded"
                    style={{
                      backgroundColor: CATEGORIES[activeCategory as Category].bg,
                      color: CATEGORIES[activeCategory as Category].textColor,
                      border: `1px solid ${CATEGORIES[activeCategory as Category].border}`,
                      fontWeight: 600,
                    }}
                  >
                    {CATEGORIES[activeCategory as Category].label}
                    <button onClick={() => setActiveCategory(ALL_CATEGORY)}>
                      <X size={10} />
                    </button>
                  </span>
                )}
                {difficultyFilter !== null && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded" style={{ fontWeight: 600 }}>
                    {DIFFICULTY_LABELS[difficultyFilter]}
                    <button onClick={() => setDifficultyFilter(null)}>
                      <X size={10} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded" style={{ fontWeight: 600 }}>
                    «{searchQuery}»
                    <button onClick={() => setSearchQuery("")}>
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-gray-400">
          <span>КухняПРО · Внутренний каталог рецептур</span>
          <span>Обновлено: {new Date().toLocaleDateString("ru-RU")}</span>
        </div>
      </footer>
    </div>
  );
}
