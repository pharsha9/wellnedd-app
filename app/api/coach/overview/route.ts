import { Role } from "@prisma/client";
import { fail, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole([Role.COACH, Role.ADMIN]);
    const users = await prisma.user.findMany({
      where: { role: Role.USER },
      include: {
        checkIns: { take: 5, orderBy: { date: "desc" } },
        goals: { where: { status: "ACTIVE" } },
        enrollments: { include: { program: true } },
      },
      take: 20,
    });
    return ok(users);
  } catch {
    return fail("Forbidden", 403);
  }
}
