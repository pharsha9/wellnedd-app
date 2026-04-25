import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/fade-in";
import { Activity, Flame } from "lucide-react";

const CAT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  MINDFULNESS: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700", dot: "bg-violet-500" },
  SLEEP:       { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", dot: "bg-indigo-500" },
  NUTRITION:   { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  ACTIVITY:    { bg: "bg-sky-50 border-sky-200", text: "text-sky-700", dot: "bg-sky-500" },
  OTHER:       { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
};

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d.toISOString().split("T")[0];
  });
}

export default async function HabitsPage() {
  const session = await auth();
  const habits = await prisma.habit.findMany({
    where: { userId: session!.user!.id, active: true },
    include: { logs: { orderBy: { date: "desc" }, take: 30 } },
  });

  const last7 = getLast7Days();

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">My Habits</h1>
        <p className="mt-1 text-slate-600">Your consistency is your superpower. Earn +50 pts for a 7-day streak.</p>
      </FadeIn>

      {habits.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="rounded-2xl glass p-12 text-center">
            <Activity className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="font-semibold text-slate-500">No habits yet. Start building your routine!</p>
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {habits.map((h, i) => {
            const colors = CAT_COLORS[h.category] ?? CAT_COLORS.OTHER;
            const logDates = new Set(h.logs.map(l => l.date.toISOString().split("T")[0]));
            const streak = (() => {
              let s = 0;
              const today = new Date();
              while (true) {
                const d = new Date(today);
                d.setDate(d.getDate() - s);
                if (!logDates.has(d.toISOString().split("T")[0])) break;
                s++;
              }
              return s;
            })();

            return (
              <FadeIn key={h.id} delay={0.1 + i * 0.05}>
                <div className={`rounded-2xl border glass p-5 shadow-sm hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${colors.dot}`} />
                        <h3 className="font-bold text-slate-800 text-lg">{h.name}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${colors.bg} ${colors.text}`}>
                          {h.category.charAt(0) + h.category.slice(1).toLowerCase()}
                        </span>
                      </div>
                      {h.description && <p className="mt-1 ml-6 text-sm text-slate-500">{h.description}</p>}
                    </div>
                    {streak > 0 && (
                      <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
                        <Flame className="h-4 w-4 text-amber-500" />
                        <span className="font-black text-amber-600">{streak}</span>
                        <span className="text-xs font-medium text-amber-500">day streak</span>
                      </div>
                    )}
                  </div>

                  {/* 7-day calendar */}
                  <div className="mt-4 flex gap-2">
                    {last7.map(date => {
                      const done = logDates.has(date);
                      const dayLabel = new Date(date + "T12:00:00").toLocaleDateString("en", { weekday: "short" });
                      const dayNum = new Date(date + "T12:00:00").getDate();
                      const isToday = date === new Date().toISOString().split("T")[0];
                      return (
                        <div key={date} className="flex flex-1 flex-col items-center gap-1.5">
                          <span className={`text-[10px] font-semibold ${isToday ? "text-sky-600" : "text-slate-400"}`}>{dayLabel}</span>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? `${colors.dot} text-white shadow-md` : isToday ? "border-2 border-sky-400 text-sky-600" : "bg-slate-100 text-slate-400"}`}>
                            {done ? "✓" : dayNum}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{h.targetFrequency}× / week target</span>
                    <span>{h.logs.filter(l => l.completed).length} completions total</span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
