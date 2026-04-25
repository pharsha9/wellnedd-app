import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const session = await auth();
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: session!.user!.id }, { recipientId: session!.user!.id }] },
    orderBy: { sentAt: "desc" },
    take: 25,
  });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Messages</h1>
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="rounded border bg-white p-3 text-sm">
            {m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
