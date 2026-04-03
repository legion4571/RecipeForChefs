import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Clock,
  Users,
  Thermometer,
  Scale,
  AlertTriangle,
  ChefHat,
  CheckCircle,
  Circle,
  Timer,
  Flame,
  Wrench,
  CalendarDays,
  User,
  Archive,
  Utensils,
  BookOpen,
} from "lucide-react";
import { RECIPES, CATEGORIES, type Category } from "../data/recipes";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Базовый",
  2: "Простой",
  3: "Средний",
  4: "Сложный",
  5: "Мастер",
};

function formatTime(minutes: number): string {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes} мин`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} ч ${m} мин` : `${h} ч`;
}

function StatBox({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div
      className="bg-white border border-gray-200 px-4 py-3 flex flex-col gap-1"
      style={{ borderLeft: accent ? `3px solid ${accent}` : undefined }}
    >
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <span className="uppercase tracking-wider" style={{ fontSize: "10px", fontWeight: 600 }}>
          {label}
        </span>
      </div>
      <div className="text-gray-900" style={{ fontSize: "20px", fontWeight: 800, lineHeight: 1.1 }}>
        {value}
      </div>
    </div>
  );
}

export function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"tech" | "ingredients" | "plating">("tech");

  const recipe = RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg" style={{ fontWeight: 700 }}>
            Рецепт не найден
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors"
            style={{ fontWeight: 600 }}
          >
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES[recipe.category as Category];
  const totalSteps = recipe.technology.length;
  const doneSteps = completedSteps.size;

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  const resetSteps = () => setCompletedSteps(new Set());

  const tabs = [
    { key: "tech", label: "Технология", icon: <Flame size={14} /> },
    { key: "ingredients", label: "Ингредиенты", icon: <Scale size={14} /> },
    { key: "plating", label: "Подача", icon: <Utensils size={14} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-gray-900 text-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft size={16} />
            <span>Каталог</span>
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-gray-200 text-sm truncate" style={{ fontWeight: 600 }}>
            {recipe.name}
          </span>
        </div>
      </div>

      {/* Recipe header */}
      <div
        className="border-b-4 border-gray-200"
        style={{ borderLeftColor: cat.color, backgroundColor: cat.bg }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center px-2.5 py-1 text-xs uppercase tracking-widest rounded-sm"
                  style={{
                    backgroundColor: cat.color,
                    color: "white",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  {cat.label}
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border"
                  style={{
                    borderColor: cat.border,
                    color: cat.textColor,
                    fontWeight: 600,
                  }}
                >
                  {DIFFICULTY_LABELS[recipe.difficulty]}
                  {" · "}{"★".repeat(recipe.difficulty)}{"☆".repeat(5 - recipe.difficulty)}
                </span>
              </div>
              <h1
                className="text-gray-900"
                style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.1 }}
              >
                {recipe.name}
              </h1>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <User size={12} />
              {recipe.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={12} />
              Обновлено: {new Date(recipe.updatedAt).toLocaleDateString("ru-RU")}
            </span>
            <div className="flex gap-1">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-sm"
                  style={{ backgroundColor: cat.border, color: cat.textColor, fontWeight: 600 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key params */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <StatBox
              icon={<Clock size={12} />}
              label="Общее время"
              value={formatTime(recipe.cookingTime)}
              accent={cat.color}
            />
            <StatBox
              icon={<Clock size={12} />}
              label="Подготовка"
              value={formatTime(recipe.prepTime)}
            />
            <StatBox
              icon={<Users size={12} />}
              label="Порций"
              value={`${recipe.portions} пор.`}
            />
            <StatBox
              icon={<Scale size={12} />}
              label="Вес порции"
              value={`${recipe.portionWeight} г`}
            />
            <StatBox
              icon={<Thermometer size={12} />}
              label="Т° подачи"
              value={`${recipe.servingTemp}°C`}
              accent={recipe.servingTemp <= 10 ? "#2563EB" : recipe.servingTemp >= 70 ? "#DC2626" : "#EA580C"}
            />
            <StatBox
              icon={<Archive size={12} />}
              label="Срок хранения"
              value={recipe.shelfLife.split(" ").slice(0, 2).join(" ")}
            />
          </div>
        </div>
      </div>

      {/* Allergens banner */}
      {recipe.allergens.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2 flex-wrap">
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
            <span className="text-amber-800 text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
              Аллергены:
            </span>
            {recipe.allergens.map((a) => (
              <span
                key={a}
                className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-sm"
                style={{ fontWeight: 600 }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Mobile tabs */}
        <div className="flex border-b border-gray-200 mb-6 md:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm border-b-2 transition-all ${
                activeTab === tab.key
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
              style={{ fontWeight: activeTab === tab.key ? 700 : 500 }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* LEFT: Technology (always visible on desktop) */}
          <div className={`flex-1 min-w-0 ${activeTab !== "tech" ? "hidden md:block" : ""}`}>
            {/* Technology */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-gray-700" />
                  <h2 className="text-gray-900" style={{ fontSize: "16px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Технология приготовления
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-1.5 bg-gray-200 rounded-full overflow-hidden"
                      style={{ width: "80px" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: totalSteps > 0 ? `${(doneSteps / totalSteps) * 100}%` : "0%",
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500" style={{ fontWeight: 600 }}>
                      {doneSteps}/{totalSteps}
                    </span>
                  </div>
                  {doneSteps > 0 && (
                    <button
                      onClick={resetSteps}
                      className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      Сбросить
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {recipe.technology.map((step) => {
                  const done = completedSteps.has(step.step);
                  return (
                    <div
                      key={step.step}
                      className={`bg-white border transition-all duration-150 cursor-pointer group ${
                        done ? "border-gray-200 opacity-60" : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ borderLeft: done ? `4px solid ${cat.color}` : "4px solid #E5E7EB" }}
                      onClick={() => toggleStep(step.step)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {done ? (
                              <CheckCircle size={20} style={{ color: cat.color }} />
                            ) : (
                              <Circle size={20} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-xs uppercase tracking-widest px-1.5 py-0.5"
                                style={{
                                  backgroundColor: done ? cat.bg : "#F3F4F6",
                                  color: done ? cat.textColor : "#6B7280",
                                  fontWeight: 700,
                                  fontSize: "10px",
                                }}
                              >
                                ШАГ {step.step}
                              </span>
                              {step.duration && (
                                <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                  <Timer size={11} />
                                  {formatTime(step.duration)}
                                </span>
                              )}
                              {step.temperature && (
                                <span className="flex items-center gap-0.5 text-xs text-gray-500">
                                  <Thermometer size={11} />
                                  {step.temperature}°C
                                </span>
                              )}
                              {step.equipment && (
                                <span className="flex items-center gap-0.5 text-xs text-gray-400">
                                  <Wrench size={11} />
                                  {step.equipment}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm leading-relaxed ${done ? "line-through text-gray-400" : "text-gray-700"}`}
                            >
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ChefHat size={15} className="text-amber-600" />
                <h3 className="text-amber-800 uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 700 }}>
                  Заметки шефа
                </h3>
              </div>
              <p className="text-amber-900 text-sm leading-relaxed">{recipe.notes}</p>
            </div>
          </div>

          {/* RIGHT sidebar (or mobile tabs) */}
          <div className="w-80 flex-shrink-0 hidden md:block space-y-4">
            {/* Ingredients */}
            <div className="bg-white border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Scale size={14} className="text-gray-600" />
                <h2 className="text-gray-900 uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 800 }}>
                  Ингредиенты
                </h2>
                <span className="text-xs text-gray-400 ml-auto">{recipe.portions} пор.</span>
              </div>
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600, fontSize: "10px" }}>
                        Продукт
                      </th>
                      <th className="text-right px-2 py-2 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600, fontSize: "10px" }}>
                        Брутто
                      </th>
                      <th className="text-right px-3 py-2 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600, fontSize: "10px" }}>
                        Нетто
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ing, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-2.5">
                          <div className="text-sm text-gray-800" style={{ fontWeight: 500 }}>
                            {ing.name}
                          </div>
                          {ing.note && (
                            <div className="text-xs text-gray-400">{ing.note}</div>
                          )}
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <span className="text-sm text-gray-500">
                            {ing.gross}
                            <span className="text-xs text-gray-400 ml-0.5">{ing.unit}</span>
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>
                            {ing.net}
                            <span className="text-xs text-gray-500 ml-0.5">{ing.unit}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Plating */}
            <div className="bg-white border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Utensils size={14} className="text-gray-600" />
                <h2 className="text-gray-900 uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 800 }}>
                  Стандарт подачи
                </h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{recipe.plating}</p>
              </div>
            </div>

            {/* Shelf life */}
            <div className="bg-white border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Archive size={14} className="text-gray-600" />
                <h2 className="text-gray-900 uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 800 }}>
                  Хранение
                </h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{recipe.shelfLife}</p>
              </div>
            </div>
          </div>

          {/* Mobile: Ingredients tab */}
          {activeTab === "ingredients" && (
            <div className="flex-1 md:hidden">
              <div className="bg-white border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-gray-900 uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 800 }}>
                    Ингредиенты · {recipe.portions} порций
                  </h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2 text-xs text-gray-500" style={{ fontWeight: 600, fontSize: "10px" }}>Продукт</th>
                      <th className="text-right px-2 py-2 text-xs text-gray-500" style={{ fontWeight: 600, fontSize: "10px" }}>Брутто</th>
                      <th className="text-right px-3 py-2 text-xs text-gray-500" style={{ fontWeight: 600, fontSize: "10px" }}>Нетто</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ing, idx) => (
                      <tr key={idx} className="border-b border-gray-50">
                        <td className="px-4 py-2.5">
                          <div className="text-sm text-gray-800">{ing.name}</div>
                          {ing.note && <div className="text-xs text-gray-400">{ing.note}</div>}
                        </td>
                        <td className="px-2 py-2.5 text-right text-sm text-gray-500">{ing.gross} {ing.unit}</td>
                        <td className="px-3 py-2.5 text-right text-sm text-gray-900" style={{ fontWeight: 700 }}>{ing.net} {ing.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile: Plating tab */}
          {activeTab === "plating" && (
            <div className="flex-1 md:hidden space-y-4">
              <div className="bg-white border border-gray-200 p-4">
                <h3 className="text-gray-900 uppercase tracking-wider mb-3" style={{ fontSize: "11px", fontWeight: 800 }}>Стандарт подачи</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{recipe.plating}</p>
              </div>
              <div className="bg-white border border-gray-200 p-4">
                <h3 className="text-gray-900 uppercase tracking-wider mb-3" style={{ fontSize: "11px", fontWeight: 800 }}>Хранение</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{recipe.shelfLife}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat size={14} className="text-amber-600" />
                  <h3 className="text-amber-800 uppercase tracking-wider" style={{ fontSize: "11px", fontWeight: 700 }}>Заметки шефа</h3>
                </div>
                <p className="text-amber-900 text-sm leading-relaxed">{recipe.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}