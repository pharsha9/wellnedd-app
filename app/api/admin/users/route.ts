import { Role } from "@prisma/client";
import { fail, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireRole(Role.ADMIN);
    const role = new URL(request.url).searchParams.get("role") ?? undefined;
    const users = await prisma.user.findMany({
      where: role ? { role: role as Role } : {},
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return ok(users);
  } catch {
    return fail("Forbidden", 403);
  }
}

export async function PUT(request: Request) {
  try {
    await requireRole(Role.ADMIN);
    const body = await request.json();
    const user = await prisma.user.update({
      where: { id: body.userId },
      data: { role: body.role as Role },
    });
    return ok(user);
  } catch {
    return fail("Update failed");
  }
}
