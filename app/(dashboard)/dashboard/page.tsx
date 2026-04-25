import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckinTrendChart } from "@/components/checkin-trend-chart";
import { FadeIn } from "@/components/fade-in";
import { Target, List, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const [checkins, goals, enrollments, content] = await Promise.all([
    prisma.wellnessCheckIn.findMany({ where: { userId }, orderBy: { date: "asc" }, take: 30 }),
    prisma.goal.findMany({ where: { userId, status: "ACTIVE" }, take: 5 }),
    prisma.programEnrollment.findMany({
      where: { userId },
      include: { program: true },
      take: 5,
    }),
    prisma.contentItem.findMany({ where: { published: true }, take: 4 }),
  ]);

  const chartData = checkins.map((c) => ({
    date: c.date.toISOString().slice(5, 10),
    mood: c.mood,
    stressLevel: c.stressLevel,
  }));

  return (
    <div className="space-y-8">
      <FadeIn delay={0.1}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Welcome back, {session?.user?.name?.split(" ")[0] || "Friend"}!
        </h1>
        <p className="mt-1 text-slate-500">Here's an overview of your wellness journey.</p>
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <CheckinTrendChart data={chartData} />
      </FadeIn>

      <div className="grid gap-6 md:grid-cols-3">
        <FadeIn delay={0.3} className="h-full">
          <section className="h-full rounded-2xl glass p-5 shadow-sm transition-all hover:shadow-md border-t border-t-white/60">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-teal-600" />
              <h2 className="font-bold text-slate-800">Active Goals</h2>
            </div>
            {goals.length === 0 ? (
              <p className="text-sm text-slate-500">No active goals yet.</p>
            ) : (
              <div className="space-y-5">
                {goals.map((g) => {
                  const percent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
                  return (
                    <div key={g.id}>
                      <div className="mb-1.5 flex justify-between text-sm text-slate-600">
                        <span className="font-medium">{g.title}</span>
                        <span className="font-semibold text-teal-700">{percent}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/60 shadow-inner">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </FadeIn>

        <FadeIn delay={0.4} className="h-full">
          <section className="h-full rounded-2xl glass p-5 shadow-sm transition-all hover:shadow-md border-t border-t-white/60">
            <div className="mb-4 flex items-center gap-2">
              <List className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800">Programs</h2>
            </div>
            {enrollments.length === 0 ? (
              <p className="text-sm text-slate-500">Not enrolled in any programs.</p>
            ) : (
              <div className="space-y-4">
                {enrollments.map((e) => (
                  <div key={e.id} className="group relative overflow-hidden rounded-xl bg-white/40 p-3 transition-colors hover:bg-white/70">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-slate-700 text-sm truncate pr-2">{e.program.title}</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{e.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/50">
                      <div className="h-full rounded-full bg-indigo-500 transition-all duration-1000" style={{ width: `${e.progressPercent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </FadeIn>

        <FadeIn delay={0.5} className="h-full">
          <section className="h-full rounded-2xl glass p-5 shadow-sm transition-all hover:shadow-md border-t border-t-white/60">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold text-slate-800">Suggested Content</h2>
            </div>
            {content.length === 0 ? (
              <p className="text-sm text-slate-500">No content available.</p>
            ) : (
              <div className="space-y-3">
                {content.map((c) => (
                  <Link href={`/content/${c.slug}`} key={c.id} className="group flex items-center justify-between rounded-xl bg-white/40 p-3 transition-all hover:bg-white/80 hover:shadow-sm">
                    <span className="text-sm font-medium text-slate-700 truncate pr-4">{c.title}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-amber-500 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
