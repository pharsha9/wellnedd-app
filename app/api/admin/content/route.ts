import { Role } from "@prisma/client";
import { fail, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(Role.ADMIN);
    return ok(await prisma.contentItem.findMany({ orderBy: { createdAt: "desc" } }));
  } catch {
    return fail("Forbidden", 403);
  }
}

export async function POST(request: Request) {
  try {
    await requireRole(Role.ADMIN);
    const body = await request.json();
    return ok(await prisma.contentItem.create({ data: body }), 201);
  } catch {
    return fail("Create failed");
  }
}
