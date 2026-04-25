import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const goal = await prisma.goal.findFirst({ where: { id, userId: user.id } });
    if (!goal) return fail("Goal not found", 404);
    const updated = await prisma.goal.update({
      where: { id },
      data: {
        title: body.title ?? goal.title,
        description: body.description ?? goal.description,
        status: body.status ?? goal.status,
        currentValue: body.currentValue ?? goal.currentValue,
      },
    });
    return ok(updated);
  } catch {
    return fail("Update failed");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const goal = await prisma.goal.findFirst({ where: { id, userId: user.id } });
    if (!goal) return fail("Goal not found", 404);
    await prisma.goal.delete({ where: { id } });
    return ok({ deleted: true });
  } catch {
    return fail("Delete failed");
  }
}
