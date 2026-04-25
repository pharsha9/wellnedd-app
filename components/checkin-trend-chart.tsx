"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { date: string; mood: number; stressLevel: number };

export function CheckinTrendChart({ data }: { data: Point[] }) {
  return (
    <div className="h-72 w-full rounded-xl border border-slate-200 bg-white p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Line dataKey="mood" stroke="#0d9488" />
          <Line dataKey="stressLevel" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
