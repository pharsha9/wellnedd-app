import { Role } from "@prisma/client";
import { fail, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(Role.ADMIN);
    const programs = await prisma.program.findMany({
      include: { modules: { include: { lessons: true }, orderBy: { order: "asc" } } },
    });
    return ok(programs);
  } catch {
    return fail("Forbidden", 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(Role.ADMIN);
    const body = await request.json();
    const created = await prisma.program.create({ data: body });
    return ok(created, 201);
  } catch {
    return fail("Create failed");
  }
}
