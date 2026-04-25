import { GoalStatus, HabitCategory } from "@prisma/client";
import { z } from "zod";
import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.nativeEnum(HabitCategory),
  startDate: z.string(),
  targetDate: z.string(),
  status: z.nativeEnum(GoalStatus).optional(),
  targetMetric: z.string(),
  baselineValue: z.number(),
  targetValue: z.number(),
  currentValue: z.number(),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return ok(goals);
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
    const goal = await prisma.goal.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        targetDate: new Date(parsed.data.targetDate),
        userId: user.id,
      },
    });
    return ok(goal, 201);
  } catch {
    return fail("Create failed");
  }
}
