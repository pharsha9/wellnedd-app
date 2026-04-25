"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const goals = [
  "reduce stress",
  "improve sleep",
  "get more active",
  "improve nutrition",
  "general mental wellness",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  function toggle(goal: string) {
    setSelectedGoals((g) => (g.includes(goal) ? g.filter((x) => x !== goal) : [...g, goal]));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: selectedGoals[0] ?? "Wellness goal",
        category: "MINDFULNESS",
        startDate: new Date().toISOString(),
        targetDate: new Date(Date.now() + 28 * 86400000).toISOString(),
        targetMetric: "score",
        baselineValue: 1,
        targetValue: 5,
        currentValue: 1,
      }),
    });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto my-10 max-w-2xl rounded-xl border bg-white p-6">
      <h1 className="text-3xl font-semibold">Onboarding</h1>
      <p className="mt-1 text-slate-600">Choose your primary goals and preferred focus areas.</p>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        {goals.map((goal) => (
          <label className="flex items-center gap-2" key={goal}>
            <input checked={selectedGoals.includes(goal)} onChange={() => toggle(goal)} type="checkbox" />
            <span>{goal}</span>
          </label>
        ))}
        <button className="rounded bg-teal-600 px-4 py-2 text-white" type="submit">
          Complete onboarding
        </button>
      </form>
    </div>
  );
}
