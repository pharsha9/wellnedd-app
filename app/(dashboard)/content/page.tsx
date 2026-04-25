import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ContentPage() {
  const items = await prisma.contentItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Content Library</h1>
      <div className="space-y-2">
        {items.map((i) => (
          <Link key={i.id} href={`/content/${i.slug}`} className="block rounded-xl border bg-white p-4">
            <p className="font-semibold">{i.title}</p>
            <p className="text-sm text-slate-600">{i.type}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
