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
    await prisma.habit.updateMany({
      where: { id, userId: user.id },
      data: {
        name: body.name,
        description: body.description,
        targetFrequency: body.targetFrequency,
        active: body.active,
      },
    });
    const habit = await prisma.habit.findFirst({ where: { id, userId: user.id } });
    if (!habit) return fail("Habit not found", 404);
    return ok(habit);
  } catch {
    return fail("Update failed", 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    await prisma.habit.deleteMany({ where: { id, userId: user.id } });
    return ok({ deleted: true });
  } catch {
    return fail("Delete failed", 400);
  }
}
