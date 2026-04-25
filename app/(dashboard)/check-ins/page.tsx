"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type CheckIn = { id: string; date: string; mood: number; stressLevel: number; sleepHours: number };

export default function CheckInsPage() {
  const [items, setItems] = useState<CheckIn[]>([]);
  const [form, setForm] = useState({
    mood: 3,
    stressLevel: 3,
    energyLevel: 3,
    sleepHours: 7,
    sleepQuality: 3,
    activityMinutes: 20,
    notes: "",
    tags: [] as string[],
  });

  async function load() {
    const res = await fetch("/api/check-ins");
    const data = await res.json();
    setItems(data.data ?? []);
  }
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/check-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Check-in saved");
      void load();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Daily check-ins</h1>
      <button className="rounded border bg-white px-3 py-2" onClick={() => void load()} type="button">Refresh list</button>
      <form className="grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-3" onSubmit={onSubmit}>
        <input className="rounded border p-2" type="number" min={1} max={5} value={form.mood} onChange={(e) => setForm((f) => ({ ...f, mood: Number(e.target.value) }))} placeholder="Mood 1-5" />
        <input className="rounded border p-2" type="number" min={1} max={5} value={form.stressLevel} onChange={(e) => setForm((f) => ({ ...f, stressLevel: Number(e.target.value) }))} placeholder="Stress 1-5" />
        <input className="rounded border p-2" type="number" min={0} max={24} step="0.5" value={form.sleepHours} onChange={(e) => setForm((f) => ({ ...f, sleepHours: Number(e.target.value) }))} placeholder="Sleep hours" />
        <button className="rounded bg-teal-600 p-2 text-white md:col-span-3">Save check-in</button>
      </form>
      <div className="rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="p-2 text-left">Date</th><th className="p-2">Mood</th><th className="p-2">Stress</th><th className="p-2">Sleep</th></tr></thead>
          <tbody>{items.map((i) => <tr key={i.id} className="border-b"><td className="p-2">{new Date(i.date).toLocaleDateString()}</td><td className="p-2 text-center">{i.mood}</td><td className="p-2 text-center">{i.stressLevel}</td><td className="p-2 text-center">{i.sleepHours}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
