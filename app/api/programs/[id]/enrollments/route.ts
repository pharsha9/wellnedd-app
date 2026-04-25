import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { trackEngagement } from "@/lib/engagement";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const enrollment = await prisma.programEnrollment.upsert({
      where: { userId_programId: { userId: user.id, programId: id } },
      create: { userId: user.id, programId: id },
      update: {},
    });
    return ok(enrollment, 201);
  } catch {
    return fail("Could not enroll");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const progressPercent = Number(body.progressPercent ?? 0);
    const updated = await prisma.programEnrollment.update({
      where: { userId_programId: { userId: user.id, programId: id } },
      data: {
        progressPercent,
        currentLessonId: body.currentLessonId,
        currentModuleId: body.currentModuleId,
        completedAt: progressPercent >= 100 ? new Date() : null,
      },
    });
    await trackEngagement(user.id, "PROGRAM_PROGRESS", {
      entityType: "ProgramEnrollment",
      entityId: updated.id,
      metadata: { progressPercent },
    });
    return ok(updated);
  } catch {
    return fail("Could not update enrollment");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    await prisma.programEnrollment.delete({
      where: { userId_programId: { userId: user.id, programId: id } },
    });
    return ok({ deleted: true });
  } catch {
    return fail("Could not unenroll");
  }
}
