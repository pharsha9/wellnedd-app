import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function HabitsPage() {
  const session = await auth();
  const habits = await prisma.habit.findMany({
    where: { userId: session!.user!.id },
    include: { logs: { orderBy: { date: "desc" }, take: 7 } },
  });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Habits</h1>
      <div className="space-y-3">
        {habits.map((h) => (
          <div key={h.id} className="rounded-xl border bg-white p-4">
            <p className="font-semibold">{h.name}</p>
            <p className="text-sm text-slate-600">{h.category} · {h.targetFrequency}/week</p>
          </div>
        ))}
      </div>
    </div>
  );
}
