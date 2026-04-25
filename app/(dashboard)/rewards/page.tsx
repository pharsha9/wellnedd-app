import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function RewardsPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  const [rewards, redeemed] = await Promise.all([
    prisma.reward.findMany({ where: { active: true } }),
    prisma.userReward.findMany({
      where: { userId: session!.user!.id },
      include: { reward: true },
      orderBy: { redeemedAt: "desc" },
    }),
  ]);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Rewards</h1>
      <p>Current points: {user?.points ?? 0}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {rewards.map((r) => (
          <div key={r.id} className="rounded border bg-white p-4">
            {r.name} - {r.pointsCost} pts
          </div>
        ))}
      </div>
      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Redeemed</h2>
        {redeemed.map((x) => <p key={x.id} className="text-sm">{x.reward.name}</p>)}
      </div>
    </div>
  );
}
