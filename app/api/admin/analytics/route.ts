import { Role } from "@prisma/client";
import { fail, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(Role.ADMIN);
    const [users, checkIns, events, programs] = await Promise.all([
      prisma.user.count(),
      prisma.wellnessCheckIn.groupBy({
        by: ["date"],
        _count: { _all: true },
        orderBy: { date: "asc" },
      }),
      prisma.engagementEvent.groupBy({
        by: ["type"],
        _count: { _all: true },
      }),
      prisma.programEnrollment.groupBy({
        by: ["programId"],
        _count: { _all: true },
      }),
    ]);

    return ok({ users, checkIns, events, programs });
  } catch {
    return fail("Forbidden", 403);
  }
}
