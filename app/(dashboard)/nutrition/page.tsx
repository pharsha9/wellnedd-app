"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/fade-in";
import { Flame, Dumbbell, Calendar, AlertTriangle, ChevronDown } from "lucide-react";

const IMMUNITY_RECIPES = [
  { title: "Golden Turmeric Latte", emoji: "☕", time: "5 min", cals: 120, ingredients: ["1 cup warm milk", "1 tsp turmeric", "½ tsp ginger", "Pinch of black pepper", "Honey to taste"], steps: ["Heat milk until warm (not boiling).", "Whisk in turmeric, ginger, and pepper.", "Add honey. Stir well and serve."] },
  { title: "Immunity Booster Smoothie", emoji: "🥤", time: "5 min", cals: 180, ingredients: ["1 orange (peeled)", "½ cup spinach", "1 tbsp ginger", "1 carrot", "½ cup water", "Ice cubes"], steps: ["Blend all ingredients until smooth.", "Add ice and blend again briefly.", "Serve immediately for maximum nutrients."] },
  { title: "Garlic Honey Shots", emoji: "🧄", time: "3 min", cals: 40, ingredients: ["3 raw garlic cloves", "2 tbsp raw honey", "½ lemon juice"], steps: ["Finely mince or press the garlic.", "Mix with honey and lemon juice.", "Take as a 'shot' each morning."] },
  { title: "Berry Antioxidant Bowl", emoji: "🫐", time: "10 min", cals: 220, ingredients: ["½ cup blueberries", "½ cup strawberries", "¼ cup walnuts", "1 tbsp chia seeds", "1 cup Greek yogurt", "Drizzle of honey"], steps: ["Spoon yogurt into a bowl.", "Top with berries, walnuts, and seeds.", "Drizzle with honey. Serve chilled."] },
  { title: "Green Detox Soup", emoji: "🥬", time: "20 min", cals: 150, ingredients: ["2 cups broccoli", "1 cup spinach", "2 garlic cloves", "1 onion", "3 cups vegetable broth", "Salt & pepper"], steps: ["Sauté garlic and onion for 3 min.", "Add broccoli and broth, simmer 10 min.", "Add spinach, blend smooth, season."] },
  { title: "Citrus Vitamin C Salad", emoji: "🍊", time: "10 min", cals: 160, ingredients: ["2 oranges, sliced", "1 grapefruit, sliced", "Mint leaves", "1 tbsp olive oil", "Pinch of chili flakes", "Honey drizzle"], steps: ["Arrange fruit slices on a plate.", "Scatter mint leaves over top.", "Drizzle olive oil and honey, add chili."] },
];

const PROTEIN_RECIPES = [
  { title: "Chicken & Quinoa Bowl", emoji: "🍗", time: "25 min", cals: 480, protein: "42g", ingredients: ["200g chicken breast", "½ cup quinoa", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon"], steps: ["Cook quinoa per instructions.", "Grill chicken with olive oil and spice.", "Assemble bowl with veggies and lemon."] },
  { title: "Egg White Omelette", emoji: "🥚", time: "10 min", cals: 200, protein: "28g", ingredients: ["4 egg whites", "½ cup spinach", "1 tbsp feta cheese", "Salt & pepper", "Olive oil spray"], steps: ["Beat egg whites with seasoning.", "Cook over medium heat in oiled pan.", "Add spinach and feta, fold and serve."] },
  { title: "Lentil Protein Curry", emoji: "🍛", time: "30 min", cals: 380, protein: "22g", ingredients: ["1 cup red lentils", "1 can diced tomatoes", "Cumin, coriander, turmeric", "1 onion", "2 garlic cloves", "Coconut milk"], steps: ["Sauté onion and garlic with spices.", "Add lentils, tomatoes, and coconut milk.", "Simmer 20 min until lentils are soft."] },
];

const MEAL_PLAN = [
  { day: "Monday",    b: "Overnight oats with berries", l: "Grilled chicken salad", d: "Vegetable stir fry with tofu" },
  { day: "Tuesday",   b: "Greek yogurt & granola",      l: "Lentil soup",           d: "Baked salmon with quinoa" },
  { day: "Wednesday", b: "Avocado toast & eggs",         l: "Turkey wrap",           d: "Dal with brown rice" },
  { day: "Thursday",  b: "Smoothie bowl",                l: "Chickpea salad",        d: "Chicken & vegetable curry" },
  { day: "Friday",    b: "Whole grain cereal & milk",    l: "Tuna sandwich",         d: "Pasta with marinara & salad" },
  { day: "Saturday",  b: "Banana pancakes",              l: "Buddha bowl",           d: "Grilled fish tacos" },
  { day: "Sunday",    b: "Egg scramble & fruit",         l: "Soup & whole grain bread", d: "Roast vegetables & hummus" },
];

const MYTHS = [
  { myth: "Eating fat makes you fat", truth: "Healthy fats (avocados, nuts, olive oil) are essential for brain function and hormone health. Overeating any macronutrient causes weight gain." },
  { myth: "Detox diets cleanse your body", truth: "Your liver and kidneys detox your body 24/7. No juice cleanse can speed up this process. Focus on hydration and whole foods instead." },
  { myth: "Carbs are the enemy", truth: "Complex carbs (oats, sweet potato, brown rice) fuel your brain and muscles. The problem is refined carbs, not carbs themselves." },
  { myth: "You need 8 glasses of water per day", truth: "Hydration needs vary by body size, activity, and climate. Pale yellow urine is a better indicator of hydration than a specific number." },
  { myth: "Protein supplements are necessary for muscle gain", truth: "Whole food protein sources (eggs, legumes, chicken, dairy) are sufficient for most people. Supplements are just a convenience." },
  { myth: "Skipping meals helps lose weight faster", truth: "Skipping meals can trigger overeating later. Consistent, balanced meals support healthy metabolism and weight management." },
];

const TABS = ["immunity", "protein", "meals", "myths"] as const;
type Tab = typeof TABS[number];

export default function NutritionPage() {
  const [tab, setTab] = useState<Tab>("immunity");
  const [expandedMyth, setExpandedMyth] = useState<number | null>(null);

  const TAB_META = {
    immunity: { label: "🛡️ Immunity Recipes", color: "from-emerald-500 to-teal-600" },
    protein:  { label: "💪 Protein Recipes",   color: "from-sky-500 to-blue-600" },
    meals:    { label: "📅 Meal Planner",       color: "from-violet-500 to-purple-600" },
    myths:    { label: "❌ Busting Myths",      color: "from-rose-500 to-pink-600" },
  };

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">Nutrition & Recipes</h1>
        <p className="mt-1 text-slate-600">Fuel your wellness with science-backed food choices and recipes.</p>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${tab === t ? `bg-gradient-to-r ${TAB_META[t].color} text-white shadow-md` : "bg-white/70 border border-slate-200 text-slate-600 hover:border-sky-300"}`}>
              {TAB_META[t].label}
            </button>
          ))}
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

          {/* Immunity Recipes */}
          {tab === "immunity" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {IMMUNITY_RECIPES.map((r, i) => (
                <FadeIn key={r.title} delay={i * 0.05}>
                  <details className="group rounded-2xl glass shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <summary className="cursor-pointer p-5 list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{r.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800">{r.title}</h3>
                          <p className="text-xs text-slate-500">{r.time} · {r.cals} cal</p>
                        </div>
                        <Flame className="h-4 w-4 text-orange-400 group-open:text-orange-600 transition-colors" />
                      </div>
                    </summary>
                    <div className="border-t border-slate-100 p-5 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wide">Ingredients</p>
                        <ul className="space-y-1">{r.ingredients.map((ing, ii) => <li key={ii} className="text-sm text-slate-600 flex gap-2"><span className="text-emerald-400">•</span>{ing}</li>)}</ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-sky-600 mb-1 uppercase tracking-wide">Steps</p>
                        <ol className="space-y-1">{r.steps.map((step, si) => <li key={si} className="text-sm text-slate-600 flex gap-2"><span className="font-bold text-sky-400">{si+1}.</span>{step}</li>)}</ol>
                      </div>
                    </div>
                  </details>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Protein Recipes */}
          {tab === "protein" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {PROTEIN_RECIPES.map((r, i) => (
                <FadeIn key={r.title} delay={i * 0.07}>
                  <details className="group rounded-2xl glass shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <summary className="cursor-pointer p-5 list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{r.emoji}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800">{r.title}</h3>
                          <p className="text-xs text-slate-500">{r.time} · {r.cals} cal · 🥩 {r.protein} protein</p>
                        </div>
                        <Dumbbell className="h-4 w-4 text-sky-400" />
                      </div>
                    </summary>
                    <div className="border-t border-slate-100 p-5 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-sky-600 mb-1 uppercase tracking-wide">Ingredients</p>
                        <ul className="space-y-1">{r.ingredients.map((ing, ii) => <li key={ii} className="text-sm text-slate-600 flex gap-2"><span className="text-sky-400">•</span>{ing}</li>)}</ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wide">Steps</p>
                        <ol className="space-y-1">{r.steps.map((step, si) => <li key={si} className="text-sm text-slate-600 flex gap-2"><span className="font-bold text-indigo-400">{si+1}.</span>{step}</li>)}</ol>
                      </div>
                    </div>
                  </details>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Meal Planner */}
          {tab === "meals" && (
            <div className="rounded-2xl glass shadow-sm overflow-hidden">
              <div className="grid grid-cols-4 bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 text-white text-sm font-bold">
                <span>Day</span>
                <span>🌅 Breakfast</span>
                <span>☀️ Lunch</span>
                <span>🌙 Dinner</span>
              </div>
              {MEAL_PLAN.map((day, i) => (
                <div key={day.day} className={`grid grid-cols-4 px-4 py-3.5 text-sm border-b border-slate-100 ${i % 2 === 0 ? "bg-white/40" : "bg-violet-50/30"}`}>
                  <span className="font-bold text-slate-800">{day.day}</span>
                  <span className="text-slate-600">{day.b}</span>
                  <span className="text-slate-600">{day.l}</span>
                  <span className="text-slate-600">{day.d}</span>
                </div>
              ))}
            </div>
          )}

          {/* Myths */}
          {tab === "myths" && (
            <div className="space-y-3">
              {MYTHS.map((m, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <button onClick={() => setExpandedMyth(expandedMyth === i ? null : i)}
                    className="w-full rounded-2xl glass shadow-sm hover:shadow-md transition-all overflow-hidden text-left">
                    <div className="flex items-center gap-4 p-5">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                        <AlertTriangle className="h-5 w-5 text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">Myth: &ldquo;{m.myth}&rdquo;</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedMyth === i ? "rotate-180" : ""}`} />
                    </div>
                    <AnimatePresence>
                      {expandedMyth === i && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="border-t border-slate-100 bg-emerald-50/50 p-5 flex gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                              <p className="text-xs font-bold text-emerald-600 mb-1 uppercase">The Truth</p>
                              <p className="text-sm text-slate-700">{m.truth}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </FadeIn>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
