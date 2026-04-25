import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { auth } from "@/auth";
import { Dumbbell, Brain, Shield, CloudRain, Moon, Flame, Clock, BarChart3 } from "lucide-react";

const CATEGORY_META: Record<string, { gradient: string; icon: React.ElementType; badge: string }> = {
  ACTIVITY:         { gradient: "card-sky",     icon: Dumbbell, badge: "Fitness" },
  MINDFULNESS:      { gradient: "card-violet",  icon: Brain,    badge: "Mindfulness" },
  NUTRITION:        { gradient: "card-emerald", icon: Shield,   badge: "Nutrition" },
  STRESS:           { gradient: "card-rose",    icon: CloudRain,badge: "Stress Relief" },
  SLEEP:            { gradient: "card-indigo",  icon: Moon,     badge: "Sleep" },
  GENERAL_WELLNESS: { gradient: "card-cyan",    icon: Flame,    badge: "Wellness" },
};

const DIFF_COLOR: Record<string, string> = {
  BEGINNER:     "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED:     "bg-rose-100 text-rose-700",
};

export default async function ProgramsPage() {
  const session = await auth();
  const [programs, enrollments] = await Promise.all([
    prisma.program.findMany({ where: { isPublic: true }, include: { _count: { select: { modules: true } } } }),
    prisma.programEnrollment.findMany({ where: { userId: session!.user!.id } }),
  ]);

  const enrolledIds = new Set(enrollments.map(e => e.programId));

  const categories = Array.from(new Set(programs.map(p => p.category)));

  return (
    <div className="space-y-10">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">Wellness Programs</h1>
        <p className="mt-1 text-slate-600">Curated series tailored for your wellness journey. Earn +20 points per enrollment.</p>
      </FadeIn>

      {categories.map((cat, ci) => {
        const meta = CATEGORY_META[cat] ?? CATEGORY_META.GENERAL_WELLNESS;
        const Icon = meta.icon;
        const catPrograms = programs.filter(p => p.category === cat);
        return (
          <FadeIn key={cat} delay={0.1 + ci * 0.05}>
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className={`${meta.gradient} flex h-9 w-9 items-center justify-center rounded-xl shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{meta.badge} Series</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">{catPrograms.length} programs</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catPrograms.map((p, pi) => {
                  const isEnrolled = enrolledIds.has(p.id);
                  return (
                    <FadeIn key={p.id} delay={0.05 + pi * 0.05}>
                      <Link href={`/programs/${p.slug}`} className="group block rounded-2xl glass shadow-sm hover:shadow-lg transition-all overflow-hidden">
                        <div className={`${meta.gradient} p-5 relative overflow-hidden`}>
                          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
                          <div className="absolute -right-2 -bottom-8 h-28 w-28 rounded-full bg-white/10" />
                          <Icon className="h-8 w-8 text-white relative z-10" />
                          <h3 className="mt-3 font-bold text-white text-lg relative z-10 leading-tight">{p.title}</h3>
                          {isEnrolled && (
                            <span className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white relative z-10">✓ Enrolled</span>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          <p className="text-sm text-slate-600 line-clamp-2">{p.description}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${DIFF_COLOR[p.difficulty] ?? "bg-slate-100 text-slate-600"}`}>
                              {p.difficulty.charAt(0) + p.difficulty.slice(1).toLowerCase()}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <Clock className="h-3.5 w-3.5" /> {p.estimatedDurationWeeks}w
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <BarChart3 className="h-3.5 w-3.5" /> {p._count.modules} modules
                            </span>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  );
                })}
              </div>
            </section>
          </FadeIn>
        );
      })}
    </div>
  );
}
