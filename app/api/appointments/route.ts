import { z } from "zod";
import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  coachId: z.string(),
  scheduledAt: z.string(),
  mode: z.enum(["VIDEO", "CHAT", "PHONE"]),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();
    const appointments = await prisma.appointment.findMany({
      where: { OR: [{ userId: user.id }, { coachId: user.id }] },
      include: { coach: true, user: true },
      orderBy: { scheduledAt: "desc" },
    });
    return ok(appointments);
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
    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        coachId: parsed.data.coachId,
        scheduledAt: new Date(parsed.data.scheduledAt),
        mode: parsed.data.mode,
        notes: parsed.data.notes,
      },
    });
    return ok(appointment, 201);
  } catch {
    return fail("Could not schedule appointment");
  }
}
