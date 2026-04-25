import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { trackEngagement } from "@/lib/engagement";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const date = body.date ? new Date(body.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const habit = await prisma.habit.findFirst({ where: { id, userId: user.id } });
    if (!habit) return fail("Habit not found", 404);

    const log = await prisma.habitLog.upsert({
      where: { habitId_date: { habitId: id, date } },
      create: { habitId: id, date, completed: !!body.completed, value: body.value },
      update: { completed: !!body.completed, value: body.value },
    });

    if (log.completed) {
      await trackEngagement(user.id, "HABIT_COMPLETED", {
        entityType: "HabitLog",
        entityId: log.id,
      });
    }
    return ok(log);
  } catch {
    return fail("Could not log habit");
  }
}
