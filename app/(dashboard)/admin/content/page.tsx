import { prisma } from "@/lib/prisma";

export default async function AdminContentPage() {
  const content = await prisma.contentItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Admin content</h1>
      {content.map((c) => (
        <div key={c.id} className="mb-2 rounded border bg-white p-3">
          {c.title} ({c.published ? "Published" : "Draft"})
        </div>
      ))}
    </div>
  );
}
