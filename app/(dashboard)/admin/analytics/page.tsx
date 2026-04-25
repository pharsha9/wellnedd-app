import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  const [userCount, eventsByType] = await Promise.all([
    prisma.user.count(),
    prisma.engagementEvent.groupBy({ by: ["type"], _count: { _all: true } }),
  ]);
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Admin analytics</h1>
      <div className="mb-3 rounded border bg-white p-4">Total users: {userCount}</div>
      <div className="rounded border bg-white p-4">
        {eventsByType.map((e) => (
          <p key={e.type}>{e.type}: {e._count._all}</p>
        ))}
      </div>
    </div>
  );
}
