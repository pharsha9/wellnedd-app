import { HabitCategory } from "@prisma/client";
import { z } from "zod";
import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.nativeEnum(HabitCategory),
  targetFrequency: z.number().int().min(1).max(14),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: { logs: { orderBy: { date: "desc" }, take: 14 } },
      orderBy: { createdAt: "desc" },
    });
    return ok(habits);
  } catch {
    return fail("Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return fail("Invalid payload");

    const habit = await prisma.habit.create({
      data: { ...parsed.data, userId: user.id },
    });
    return ok(habit, 201);
  } catch {
    return fail("Unauthorized", 401);
  }
}
