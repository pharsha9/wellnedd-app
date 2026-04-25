import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { trackEngagement } from "@/lib/engagement";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = await prisma.contentItem.findUnique({ where: { id } });
  if (!item) return fail("Content not found", 404);
  return ok(item);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = await prisma.contentItem.update({ where: { id }, data: body });
    return ok(item);
  } catch {
    return fail("Could not update content");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.contentItem.delete({ where: { id } });
    return ok({ deleted: true });
  } catch {
    return fail("Could not delete content");
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    await trackEngagement(user.id, "CONTENT_VIEWED", {
      entityType: "ContentItem",
      entityId: id,
    });
    return ok({ tracked: true });
  } catch {
    return fail("Could not track view");
  }
}
