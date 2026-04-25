import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ContentDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const item = await prisma.contentItem.findUnique({ where: { slug } });
  if (item && session?.user?.id) {
    await prisma.engagementEvent.create({
      data: {
        userId: session.user.id,
        type: "CONTENT_VIEWED",
        entityType: "ContentItem",
        entityId: item.id,
      },
    });
  }
  if (!item) return <p>Not found</p>;
  return (
    <article className="prose max-w-none rounded-xl border bg-white p-6">
      <h1>{item.title}</h1>
      <p>{item.body}</p>
      {item.mediaUrl ? <a href={item.mediaUrl}>Open media</a> : null}
    </article>
  );
}
