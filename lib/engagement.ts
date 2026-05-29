import { EngagementType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const POINTS_MAP: Record<EngagementType, number> = {
  LOGIN: 1,
  CHECKIN_CREATED: 5,
  HABIT_COMPLETED: 2,
  PROGRAM_PROGRESS: 10,
  CONTENT_VIEWED: 1,
  JOURNAL_ANALYZED: 15,
};

export function pointsForEvent(type: EngagementType): number {
  return POINTS_MAP[type] ?? 0;
}

export async function trackEngagement(
  userId: string,
  type: EngagementType,
  options?: { entityType?: string; entityId?: string; metadata?: object },
): Promise<void> {
  const points = pointsForEvent(type);
  await prisma.$transaction([
    prisma.engagementEvent.create({
      data: {
        userId,
        type,
        entityType: options?.entityType,
        entityId: options?.entityId,
        metadata: options?.metadata as object | undefined,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    }),
  ]);
}
