import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const reward = await prisma.reward.findUnique({ where: { id: body.rewardId } });
    if (!reward || !reward.active) return fail("Reward unavailable", 404);
    if (user.points < reward.pointsCost) return fail("Not enough points", 400);

    const redeemed = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { points: { decrement: reward.pointsCost } },
      });
      return tx.userReward.create({
        data: { userId: user.id, rewardId: reward.id },
      });
    });

    return ok(redeemed, 201);
  } catch {
    return fail("Redeem failed");
  }
}
