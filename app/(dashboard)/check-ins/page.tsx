"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Brain, Zap, Moon, Heart, CheckCircle2, ChevronRight, ChevronLeft
} from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from "recharts";

const MOODS = [
  { emoji: "😔", label: "Low", value: 1 },
  { emoji: "😕", label: "Down", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😄", label: "Great", value: 5 },
];

const MOOD_WORDS = [
  "Anxious", "Energized", "Foggy", "Calm", "Overwhelmed",
  "Motivated", "Tired", "Hopeful", "Irritable", "Content",
  "Focused", "Restless", "Grateful", "Stressed", "Peaceful"
];

const STEPS = [
  { id: "mood", title: "How are you feeling?", icon: Heart, color: "from-rose-400 to-pink-600" },
  { id: "stress", title: "What's your stress level?", icon: Brain, color: "from-violet-400 to-purple-600" },
  { id: "sleep", title: "How did you sleep?", icon: Moon, color: "from-indigo-400 to-blue-600" },
  { id: "energy", title: "Energy & Focus check", icon: Zap, color: "from-amber-400 to-orange-500" },
  { id: "summary", title: "Your Wellness Snapshot", icon: CheckCircle2, color: "from-emerald-400 to-cyan-500" },
];

export default function CheckInsPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState(3);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [focus, setFocus] = useState(3);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleWord = (w: string) => {
    setSelectedWords(prev =>
      prev.includes(w) ? prev.filter(x => x !== w) : prev.length < 5 ? [...prev, w] : prev
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString(),
          mood,
          stressLevel: stress,
          energyLevel: energy,
          sleepHours,
          sleepQuality,
          activityMinutes: 30,
          notes: selectedWords.join(", "),
          tags: selectedWords,
        }),
      });
      setSaved(true);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const radarData = [
    { subject: "Mood", value: mood * 20 },
    { subject: "Sleep", value: sleepQuality * 20 },
    { subject: "Energy", value: energy * 20 },
    { subject: "Focus", value: focus * 20 },
    { subject: "Calm", value: (10 - stress) * 10 },
  ];

  const StepIcon = STEPS[step].icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">Daily Check-in</h1>
        <p className="text-slate-600">Take a moment to reflect on how you're doing today.</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-sky-500" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl glass p-8 shadow-lg"
        >
          {/* Header */}
          <div className={`mb-6 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r ${STEPS[step].color} px-4 py-2 text-white`}>
            <StepIcon className="h-5 w-5" />
            <span className="font-bold">{STEPS[step].title}</span>
          </div>

          {/* Step 0: Mood */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                {MOODS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex flex-col items-center gap-1 rounded-2xl p-4 transition-all ${mood === m.value ? "bg-sky-100 ring-2 ring-sky-400 scale-110 shadow-md" : "hover:bg-slate-100"}`}
                  >
                    <span className="text-4xl">{m.emoji}</span>
                    <span className="text-xs font-semibold text-slate-600">{m.label}</span>
                  </button>
                ))}
              </div>
              <div>
                <p className="mb-3 font-semibold text-slate-700">What words describe your mood? <span className="text-slate-400 font-normal">(pick up to 5)</span></p>
                <div className="flex flex-wrap gap-2">
                  {MOOD_WORDS.map(w => (
                    <button
                      key={w}
                      onClick={() => toggleWord(w)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${selectedWords.includes(w) ? "bg-sky-500 text-white shadow-md" : "bg-white/80 text-slate-700 border border-slate-200 hover:border-sky-300"}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Stress */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-2 text-6xl font-black" style={{ color: `hsl(${(10 - stress) * 12}, 80%, 45%)` }}>
                  {stress}
                </div>
                <p className="text-slate-600">out of 10</p>
              </div>
              <input
                type="range" min={1} max={10} value={stress}
                onChange={e => setStress(Number(e.target.value))}
                className="w-full accent-violet-500 h-3 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>😌 Very Calm</span>
                <span>😰 Extremely Stressed</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {["Work pressure", "Health concerns", "Relationships", "Financial stress", "Family issues", "Feeling stuck"].map(cause => (
                  <button key={cause} className="rounded-xl bg-white/70 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-violet-300 hover:bg-violet-50 transition-all">
                    {cause}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Sleep */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 font-semibold text-slate-700">Hours of sleep</p>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-black text-indigo-600">{sleepHours}</span>
                  <span className="text-slate-500">hours</span>
                </div>
                <input
                  type="range" min={1} max={12} step={0.5} value={sleepHours}
                  onChange={e => setSleepHours(Number(e.target.value))}
                  className="mt-3 w-full accent-indigo-500 h-3 cursor-pointer"
                />
                <div className="flex justify-between text-xs font-medium text-slate-500 mt-1">
                  <span>1h</span><span>12h</span>
                </div>
              </div>
              <div>
                <p className="mb-3 font-semibold text-slate-700">Sleep quality</p>
                <div className="flex gap-3">
                  {[1,2,3,4,5].map(q => (
                    <button
                      key={q}
                      onClick={() => setSleepQuality(q)}
                      className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${sleepQuality === q ? "bg-indigo-500 text-white shadow-md" : "bg-white/70 border border-slate-200 text-slate-600 hover:border-indigo-300"}`}
                    >
                      {["😴","😕","😐","🙂","✨"][q-1]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Energy & Focus */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 font-semibold text-slate-700">Energy Level</p>
                <div className="flex gap-2 items-center">
                  {[1,2,3,4,5].map(l => (
                    <button key={l} onClick={() => setEnergy(l)}
                      className={`h-10 flex-1 rounded-lg transition-all ${l <= energy ? "bg-amber-400 shadow" : "bg-slate-200"}`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-amber-600">⚡ {energy}/5</span>
                </div>
              </div>
              <div>
                <p className="mb-3 font-semibold text-slate-700">Focus Level</p>
                <div className="flex gap-2 items-center">
                  {[1,2,3,4,5].map(l => (
                    <button key={l} onClick={() => setFocus(l)}
                      className={`h-10 flex-1 rounded-lg transition-all ${l <= focus ? "bg-sky-400 shadow" : "bg-slate-200"}`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-sky-600">🎯 {focus}/5</span>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-medium text-amber-800">💡 Tip: Low energy? Try a 10-minute walk or a glass of water.</p>
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(14,165,233,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: "12px", border: "1px solid rgba(14,165,233,0.2)" }} />
                    <Radar dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Mood", value: `${MOODS[mood-1].emoji} ${MOODS[mood-1].label}`, color: "text-rose-600" },
                  { label: "Stress", value: `${stress}/10`, color: "text-violet-600" },
                  { label: "Sleep", value: `${sleepHours}h`, color: "text-indigo-600" },
                  { label: "Energy", value: `${energy}/5 ⚡`, color: "text-amber-600" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl glass-cool p-3 text-center">
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              {selectedWords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedWords.map(w => (
                    <span key={w} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{w}</span>
                  ))}
                </div>
              )}
              {saved ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <p className="font-bold text-emerald-700">✅ Check-in saved! You earned +10 points 🎉</p>
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Check-in & Earn 10 Points 🌟"}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition-all hover:bg-white disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < 4 && (
          <button
            onClick={() => setStep(s => Math.min(4, s + 1))}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01]"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
