import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckinTrendChart } from "@/components/checkin-trend-chart";

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
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <CheckinTrendChart data={chartData} />
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Active goals</h2>
          {goals.map((g) => (
            <p key={g.id} className="mt-2 text-sm">{g.title}: {g.currentValue}/{g.targetValue}</p>
          ))}
        </section>
        <section className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Programs</h2>
          {enrollments.map((e) => (
            <p key={e.id} className="mt-2 text-sm">{e.program.title} - {e.progressPercent}%</p>
          ))}
        </section>
        <section className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Suggested content</h2>
          {content.map((c) => (
            <p key={c.id} className="mt-2 text-sm">{c.title}</p>
          ))}
        </section>
      </div>
    </div>
  );
}
