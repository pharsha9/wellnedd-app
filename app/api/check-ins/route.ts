import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { trackEngagement } from "@/lib/engagement";

const checkinSchema = z.object({
  date: z.string().optional(),
  mood: z.number().min(1).max(5),
  stressLevel: z.number().min(1).max(5),
  energyLevel: z.number().min(1).max(5),
  sleepHours: z.number().min(0).max(24),
  sleepQuality: z.number().min(1).max(5),
  activityMinutes: z.number().min(0).max(1440),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const items = await prisma.wellnessCheckIn.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 60,
    });
    return ok(items);
  } catch {
    return fail("Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const parsed = checkinSchema.safeParse(body);
    if (!parsed.success) return fail("Invalid payload");

    const date = parsed.data.date ? new Date(parsed.data.date) : new Date();
    date.setHours(0, 0, 0, 0);

    const result = await prisma.wellnessCheckIn.upsert({
      where: { userId_date: { userId: user.id, date } },
      create: { ...parsed.data, date, userId: user.id },
      update: { ...parsed.data, date },
    });

    await trackEngagement(user.id, "CHECKIN_CREATED", {
      entityType: "WellnessCheckIn",
      entityId: result.id,
    });

    return ok(result, 201);
  } catch {
    return fail("Unauthorized", 401);
  }
}
