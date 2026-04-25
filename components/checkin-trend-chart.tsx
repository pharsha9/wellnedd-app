"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

type Point = { date: string; mood: number; stressLevel: number };

export function CheckinTrendChart({ data }: { data: Point[] }) {
  return (
    <div className="h-80 w-full rounded-2xl glass p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-800">Wellness Trends</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            domain={[1, 5]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255,255,255,0.8)', 
              backdropFilter: 'blur(12px)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#0d9488" 
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Mood"
          />
          <Line 
            type="monotone" 
            dataKey="stressLevel" 
            stroke="#4f46e5" 
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Stress"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
