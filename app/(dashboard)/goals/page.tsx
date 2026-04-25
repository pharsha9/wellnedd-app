import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function GoalsPage() {
  const session = await auth();
  const goals = await prisma.goal.findMany({ where: { userId: session!.user!.id } });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Goals</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {goals.map((g) => (
          <div key={g.id} className="rounded-xl border bg-white p-4">
            <p className="font-semibold">{g.title}</p>
            <p className="text-sm text-slate-600">{g.currentValue} / {g.targetValue} {g.targetMetric}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
