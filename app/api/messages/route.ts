import { fail, ok } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const conversationId = new URL(request.url).searchParams.get("conversationId");
    const where = conversationId
      ? { conversationId }
      : { OR: [{ senderId: user.id }, { recipientId: user.id }] };
    const messages = await prisma.message.findMany({ where, orderBy: { sentAt: "asc" } });
    return ok(messages);
  } catch {
    return fail("Unauthorized", 401);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const message = await prisma.message.create({
      data: {
        conversationId: body.conversationId,
        senderId: user.id,
        recipientId: body.recipientId,
        content: body.content,
      },
    });
    return ok(message, 201);
  } catch {
    return fail("Could not send message");
  }
}
