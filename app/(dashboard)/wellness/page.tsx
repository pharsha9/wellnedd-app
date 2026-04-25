"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/fade-in";
import { ClipboardCheck, Heart, Utensils, Brain, Briefcase, ChevronRight, RotateCcw } from "lucide-react";

type QuizKey = "meals" | "mentalPhysical" | "sustainable" | "overwhelmed";

const ASSESSMENTS = {
  meals: {
    title: "Are My Meals Enough?",
    icon: Utensils,
    gradient: "from-emerald-500 to-teal-600",
    questions: [
      { q: "Do you eat at least 3 meals a day?", options: ["Always", "Usually", "Sometimes", "Rarely"] },
      { q: "Do you include protein in most of your meals?", options: ["Yes, always", "Most times", "Occasionally", "Rarely"] },
      { q: "Do you eat fruits or vegetables daily?", options: ["Every day", "4–5 times/week", "1–3 times/week", "Rarely"] },
      { q: "Do you stay hydrated (6–8 glasses of water)?", options: ["Always", "Usually", "Sometimes", "Rarely"] },
      { q: "Do you often feel bloated or low energy after eating?", options: ["Rarely", "Sometimes", "Often", "Always"] },
    ],
    scoreInterpret: (s: number) => s >= 16 ? { label: "Excellent! 🌟", msg: "Your meals are well-balanced and nutritious. Keep it up!", color: "text-emerald-600" }
      : s >= 11 ? { label: "Good 🙂", msg: "You're on the right track but can improve variety and hydration.", color: "text-sky-600" }
      : { label: "Needs Work 🛠️", msg: "Consider planning balanced meals with protein, fiber, and hydration.", color: "text-amber-600" },
  },
  mentalPhysical: {
    title: "Is My Mental Health Affecting My Physical Health?",
    icon: Brain,
    gradient: "from-violet-500 to-purple-600",
    questions: [
      { q: "Do you experience physical symptoms (headaches, fatigue) during stress?", options: ["Never", "Rarely", "Sometimes", "Frequently"] },
      { q: "Does anxiety or worry interfere with your sleep?", options: ["Never", "Rarely", "Sometimes", "Frequently"] },
      { q: "Do you notice changes in appetite when emotionally stressed?", options: ["Never", "Rarely", "Sometimes", "Frequently"] },
      { q: "Do negative thoughts affect your motivation to exercise?", options: ["Never", "Rarely", "Sometimes", "Frequently"] },
      { q: "Do you feel physically tense or stiff when anxious?", options: ["Never", "Rarely", "Sometimes", "Frequently"] },
    ],
    scoreInterpret: (s: number) => s <= 8 ? { label: "Well Balanced 💚", msg: "Great mental-physical balance! Keep practicing mindfulness.", color: "text-emerald-600" }
      : s <= 14 ? { label: "Mild Connection 🟡", msg: "Some stress is showing physically. Try breathwork or a short walk.", color: "text-amber-600" }
      : { label: "Strong Mind-Body Link ⚠️", msg: "Your mental state is significantly impacting your body. Consider speaking to a coach.", color: "text-rose-600" },
  },
  sustainable: {
    title: "Are My Daily Choices Sustainable?",
    icon: Heart,
    gradient: "from-sky-500 to-blue-600",
    questions: [
      { q: "Do you get at least 7 hours of sleep most nights?", options: ["Always", "Usually", "Rarely", "Never"] },
      { q: "Do you take breaks throughout your workday?", options: ["Always", "Usually", "Rarely", "Never"] },
      { q: "Do you engage in physical activity at least 3x/week?", options: ["Always", "Usually", "Rarely", "Never"] },
      { q: "Do you feel your current pace is maintainable long-term?", options: ["Absolutely", "Mostly", "Unsure", "No"] },
      { q: "Do you have time for hobbies or relaxation each week?", options: ["Always", "Usually", "Rarely", "Never"] },
    ],
    scoreInterpret: (s: number) => s >= 16 ? { label: "Sustainable Lifestyle 🌿", msg: "Your routines are healthy and maintainable. You're thriving!", color: "text-emerald-600" }
      : s >= 10 ? { label: "Mostly Sustainable 🙂", msg: "Good foundation, but watch for burnout signals.", color: "text-sky-600" }
      : { label: "Unsustainable Pace ⚠️", msg: "Your current habits may lead to burnout. Prioritize recovery and rest.", color: "text-rose-600" },
  },
  overwhelmed: {
    title: "Am I Overwhelmed at Work?",
    icon: Briefcase,
    gradient: "from-rose-500 to-pink-600",
    questions: [
      { q: "Do you frequently feel unable to complete your to-do list?", options: ["Never", "Rarely", "Sometimes", "Always"] },
      { q: "Do you find it hard to disconnect from work after hours?", options: ["Never", "Rarely", "Sometimes", "Always"] },
      { q: "Do you feel dread or anxiety before starting your workday?", options: ["Never", "Rarely", "Sometimes", "Always"] },
      { q: "Are you frequently missing deadlines or forgetting tasks?", options: ["Never", "Rarely", "Sometimes", "Always"] },
      { q: "Do you feel your workload is beyond your capacity?", options: ["Never", "Rarely", "Sometimes", "Always"] },
    ],
    scoreInterpret: (s: number) => s <= 7 ? { label: "Well Managed 💪", msg: "You're handling your workload well. Keep enforcing boundaries.", color: "text-emerald-600" }
      : s <= 14 ? { label: "Moderate Pressure 🟡", msg: "Some signs of overwhelm. Try time-blocking and delegation.", color: "text-amber-600" }
      : { label: "Burning Out 🔥", msg: "High burnout risk. Please speak to your coach or manager about workload.", color: "text-rose-600" },
  },
};

type State = { step: number; answers: number[]; done: boolean; score: number };

export default function WellnessPage() {
  const [active, setActive] = useState<QuizKey | null>(null);
  const [states, setStates] = useState<Record<QuizKey, State>>({
    meals:           { step: 0, answers: [], done: false, score: 0 },
    mentalPhysical:  { step: 0, answers: [], done: false, score: 0 },
    sustainable:     { step: 0, answers: [], done: false, score: 0 },
    overwhelmed:     { step: 0, answers: [], done: false, score: 0 },
  });

  const handleAnswer = (qKey: QuizKey, optionIndex: number) => {
    const quiz = ASSESSMENTS[qKey];
    const currentState = states[qKey];
    const score = (quiz.questions.length - 1 - optionIndex) + 1;
    const newAnswers = [...currentState.answers, score];
    const isLast = currentState.step === quiz.questions.length - 1;
    setStates(prev => ({
      ...prev,
      [qKey]: {
        step: isLast ? currentState.step : currentState.step + 1,
        answers: newAnswers,
        done: isLast,
        score: newAnswers.reduce((a, b) => a + b, 0),
      }
    }));
  };

  const resetQuiz = (qKey: QuizKey) => {
    setStates(prev => ({ ...prev, [qKey]: { step: 0, answers: [], done: false, score: 0 } }));
    setActive(null);
  };

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">Assess Your Wellbeing</h1>
        <p className="mt-1 text-slate-600">Short, science-backed quizzes to understand your wellness. Earn +5 points per completed assessment.</p>
      </FadeIn>

      <div className="grid gap-5 sm:grid-cols-2">
        {(Object.keys(ASSESSMENTS) as QuizKey[]).map((key, i) => {
          const quiz = ASSESSMENTS[key];
          const state = states[key];
          const Icon = quiz.icon;
          const interpretation = state.done ? quiz.scoreInterpret(state.score) : null;

          return (
            <FadeIn key={key} delay={0.1 + i * 0.05}>
              <div className="rounded-2xl glass shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className={`bg-gradient-to-r ${quiz.gradient} p-5`}>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-white" />
                    <h2 className="font-bold text-white">{quiz.title}</h2>
                  </div>
                  <p className="mt-1 text-white/70 text-sm">{quiz.questions.length} questions</p>
                </div>

                <div className="p-5">
                  {state.done && interpretation ? (
                    <div className="space-y-3">
                      <p className={`text-xl font-black ${interpretation.color}`}>{interpretation.label}</p>
                      <p className="text-sm text-slate-600">{interpretation.msg}</p>
                      <p className="text-xs font-semibold text-emerald-600">✅ +5 points earned!</p>
                      <button onClick={() => resetQuiz(key)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        <RotateCcw className="h-4 w-4" /> Take again
                      </button>
                    </div>
                  ) : active === key ? (
                    <AnimatePresence mode="wait">
                      <motion.div key={state.step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        <div className="flex gap-1">
                          {quiz.questions.map((_, qi) => (
                            <div key={qi} className={`h-1.5 flex-1 rounded-full ${qi <= state.step ? "bg-sky-500" : "bg-slate-200"}`} />
                          ))}
                        </div>
                        <p className="font-semibold text-slate-800">{quiz.questions[state.step].q}</p>
                        <div className="space-y-2">
                          {quiz.questions[state.step].options.map((opt, oi) => (
                            <button key={oi} onClick={() => handleAnswer(key, oi)}
                              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700">
                              {opt}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400">Question {state.step + 1} of {quiz.questions.length}</p>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-500">Understand this dimension of your health with a quick self-assessment.</p>
                      <button onClick={() => setActive(key)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-2.5 font-bold text-white text-sm shadow transition-all hover:shadow-md hover:scale-[1.01]">
                        Start Assessment <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Overview tip */}
      <FadeIn delay={0.35}>
        <div className="rounded-2xl glass-cool border border-sky-200 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <ClipboardCheck className="h-6 w-6 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-800">What do these assessments mean?</h3>
              <p className="mt-1 text-sm text-slate-600">
                These quizzes are designed to help you reflect on different dimensions of your wellness. They are <strong>not medical diagnoses</strong> — they are self-reflection tools to guide your wellness journey. For clinical concerns, always consult a healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
