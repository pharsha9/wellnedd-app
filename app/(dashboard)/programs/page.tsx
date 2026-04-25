import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({ where: { isPublic: true } });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Programs</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {programs.map((p) => (
          <Link href={`/programs/${p.slug}`} key={p.id} className="rounded-xl border bg-white p-4">
            <p className="font-semibold">{p.title}</p>
            <p className="text-sm text-slate-600">{p.category} · {p.difficulty}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
