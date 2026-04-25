"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/fade-in";
import {
  Footprints, Droplets, Utensils, Bell, Smartphone,
  Check, Sun, Moon, Apple, Dumbbell, Brain, Pill, Leaf
} from "lucide-react";

const REMINDERS = [
  { id: "vitamins", label: "Take Vitamins", icon: Pill, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", active: "bg-amber-500" },
  { id: "yoga", label: "Yoga", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", active: "bg-emerald-500" },
  { id: "meditation", label: "Meditation", icon: Brain, color: "text-violet-600", bg: "bg-violet-50 border-violet-200", active: "bg-violet-500" },
  { id: "fruits", label: "Eat Fruits", icon: Apple, color: "text-rose-600", bg: "bg-rose-50 border-rose-200", active: "bg-rose-500" },
  { id: "sleep", label: "Sleep", icon: Moon, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200", active: "bg-indigo-500" },
  { id: "workout", label: "Workout", icon: Dumbbell, color: "text-sky-600", bg: "bg-sky-50 border-sky-200", active: "bg-sky-500" },
];

function CircleProgress({ value, max, color, size = 120, label }: { value: number; max: number; color: string; size?: number; label?: string }) {
  const pct = Math.min(value / max, 1);
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black text-slate-800">{Math.round(pct * 100)}%</span>
        {label && <span className="text-[10px] font-semibold text-slate-500">{label}</span>}
      </div>
    </div>
  );
}

export default function TrackerPage() {
  const [steps, setSteps] = useState(4230);
  const [glasses, setGlasses] = useState(3);
  const [meals, setMeals] = useState({ breakfast: false, lunch: false, dinner: false, snack: false });
  const [doneReminders, setDoneReminders] = useState<string[]>([]);
  const [pointsEarned, setPointsEarned] = useState(0);

  const toggleReminder = (id: string) => {
    if (doneReminders.includes(id)) {
      setDoneReminders(p => p.filter(x => x !== id));
      setPointsEarned(p => p - 5);
    } else {
      setDoneReminders(p => [...p, id]);
      setPointsEarned(p => p + 5);
    }
  };

  const toggleMeal = (key: string) => {
    setMeals(p => ({ ...p, [key]: !p[key as keyof typeof p] }));
  };

  const mealsDone = Object.values(meals).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Daily Tracker</h1>
            <p className="text-slate-600 mt-1">Track your wellness habits for today.</p>
          </div>
          {pointsEarned > 0 && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-white shadow-lg"
            >
              <p className="text-xs font-semibold opacity-80">Points Earned Today</p>
              <p className="text-2xl font-black">+{pointsEarned} 🌟</p>
            </motion.div>
          )}
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Steps */}
        <FadeIn delay={0.1}>
          <div className="rounded-2xl glass p-6 shadow-sm h-full">
            <div className="mb-4 flex items-center gap-2">
              <Footprints className="h-5 w-5 text-sky-600" />
              <h2 className="font-bold text-slate-800 text-lg">Steps Tracker</h2>
            </div>
            <div className="flex flex-col items-center gap-4">
              <CircleProgress value={steps} max={10000} color="#0ea5e9" size={130} label="of 10k" />
              <div className="w-full">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span className="font-medium">{steps.toLocaleString()} steps</span>
                  <span>Goal: 10,000</span>
                </div>
                <input type="range" min={0} max={10000} value={steps}
                  onChange={e => setSteps(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer" />
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 py-2.5 text-sm font-bold text-sky-700 hover:bg-sky-100 transition-all">
                <Smartphone className="h-4 w-4" /> Connect Health Device
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Water */}
        <FadeIn delay={0.15}>
          <div className="rounded-2xl glass p-6 shadow-sm h-full">
            <div className="mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-lg">Water Intake</h2>
            </div>
            <div className="flex flex-col items-center gap-4">
              <CircleProgress value={glasses} max={8} color="#3b82f6" size={130} label="of 8" />
              <div className="grid grid-cols-4 gap-2 w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button key={i} onClick={() => setGlasses(i < glasses ? i : i + 1)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2.5 text-xl transition-all ${i < glasses ? "bg-blue-100 shadow-inner" : "bg-white/60 border border-slate-200 hover:bg-blue-50"}`}
                  >
                    💧
                    <span className="text-[9px] font-semibold text-slate-500">{i + 1}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-600">{glasses < 8 ? `${8 - glasses} more glass${8 - glasses !== 1 ? "es" : ""} to go!` : "🎉 Hydration goal reached!"}</p>
            </div>
          </div>
        </FadeIn>

        {/* Meals */}
        <FadeIn delay={0.2}>
          <div className="rounded-2xl glass p-6 shadow-sm h-full">
            <div className="mb-4 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-emerald-600" />
              <h2 className="font-bold text-slate-800 text-lg">Meals Tracker</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: "breakfast", label: "Breakfast", icon: "🌅", time: "7–10 AM" },
                { key: "lunch", label: "Lunch", icon: "☀️", time: "12–2 PM" },
                { key: "dinner", label: "Dinner", icon: "🌙", time: "6–9 PM" },
                { key: "snack", label: "Snack", icon: "🍎", time: "Anytime" },
              ].map(meal => (
                <button key={meal.key} onClick={() => toggleMeal(meal.key)}
                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${meals[meal.key as keyof typeof meals] ? "bg-emerald-50 border-emerald-300 shadow-sm" : "bg-white/60 border-slate-200 hover:border-emerald-200"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{meal.icon}</span>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 text-sm">{meal.label}</p>
                      <p className="text-xs text-slate-500">{meal.time}</p>
                    </div>
                  </div>
                  {meals[meal.key as keyof typeof meals] && <Check className="h-5 w-5 text-emerald-600" />}
                </button>
              ))}
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                <p className="text-sm font-bold text-emerald-700">{mealsDone}/4 meals logged today</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Reminders */}
      <FadeIn delay={0.25}>
        <div className="rounded-2xl glass p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-5 w-5 text-violet-600" />
            <h2 className="font-bold text-slate-800 text-lg">Wellness Reminders</h2>
            <span className="ml-auto rounded-full bg-violet-100 px-3 py-0.5 text-xs font-bold text-violet-700">
              {doneReminders.length}/{REMINDERS.length} done · +{doneReminders.length * 5} pts
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {REMINDERS.map((r, i) => {
              const done = doneReminders.includes(r.id);
              const Icon = r.icon;
              return (
                <motion.button
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggleReminder(r.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${done ? `${r.active} border-transparent text-white shadow-md` : `${r.bg} border hover:shadow-sm`}`}
                >
                  <Icon className={`h-6 w-6 ${done ? "text-white" : r.color}`} />
                  <span className={`text-xs font-bold text-center ${done ? "text-white" : "text-slate-700"}`}>{r.label}</span>
                  {done && <span className="text-[10px] font-semibold text-white/80">+5 pts ✓</span>}
                </motion.button>
              );
            })}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
