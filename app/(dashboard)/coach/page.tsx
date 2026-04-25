import { prisma } from "@/lib/prisma";

export default async function CoachPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: { checkIns: { take: 3, orderBy: { date: "desc" } }, goals: true, enrollments: true },
    take: 10,
  });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Coach panel</h1>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="rounded border bg-white p-4">
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm text-slate-600">
              {u.checkIns.length} recent check-ins · {u.goals.length} goals · {u.enrollments.length} programs
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
