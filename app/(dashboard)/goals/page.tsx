import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/fade-in";
import { Target, Scale, TrendingUp, Calendar } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    "bg-sky-100 text-sky-700",
  ACHIEVED:  "bg-emerald-100 text-emerald-700",
  ON_HOLD:   "bg-amber-100 text-amber-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

const CAT_GRADIENTS: Record<string, string> = {
  MINDFULNESS: "from-violet-500 to-purple-600",
  SLEEP:       "from-indigo-500 to-blue-600",
  NUTRITION:   "from-emerald-500 to-teal-600",
  ACTIVITY:    "from-sky-500 to-cyan-600",
  OTHER:       "from-amber-500 to-orange-600",
};

export default async function GoalsPage() {
  const session = await auth();
  const goals = await prisma.goal.findMany({
    where: { userId: session!.user!.id },
    orderBy: { status: "asc" },
  });

  const active = goals.filter(g => g.status === "ACTIVE");
  const achieved = goals.filter(g => g.status === "ACHIEVED");

  return (
    <div className="space-y-8">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">My Goals</h1>
        <p className="mt-1 text-slate-600">Track progress toward your personal wellness milestones.</p>
      </FadeIn>

      {/* Summary stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Goals", value: active.length, icon: Target, color: "text-sky-600", bg: "bg-sky-50 border-sky-200" },
            { label: "Achieved", value: achieved.length, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Total Goals", value: goals.length, icon: Scale, color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border glass p-5 flex items-center gap-4 shadow-sm ${stat.bg}`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Goals list */}
      <div className="space-y-4">
        {goals.map((g, i) => {
          const percent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
          const gradient = CAT_GRADIENTS[g.category] ?? CAT_GRADIENTS.OTHER;
          const daysLeft = Math.ceil((new Date(g.targetDate).getTime() - Date.now()) / 86400000);
          return (
            <FadeIn key={g.id} delay={0.15 + i * 0.05}>
              <div className="rounded-2xl glass shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className={`bg-gradient-to-r ${gradient} px-6 py-4 flex items-center justify-between`}>
                  <div>
                    <h3 className="font-bold text-white text-lg">{g.title}</h3>
                    <p className="text-white/80 text-sm">{g.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[g.status]}`}>
                    {g.status.replace("_", " ")}
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">{g.currentValue} / {g.targetValue} {g.targetMetric}</span>
                    <span className="font-black text-slate-800">{percent}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                    </span>
                    <span>Started: {new Date(g.startDate).toLocaleDateString()}</span>
                    <span>Target: {new Date(g.targetDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
