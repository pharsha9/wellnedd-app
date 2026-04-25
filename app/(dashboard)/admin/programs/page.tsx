import { prisma } from "@/lib/prisma";

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    include: { modules: { include: { lessons: true } } },
  });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Admin programs</h1>
      {programs.map((p) => (
        <div key={p.id} className="mb-2 rounded border bg-white p-3">
          {p.title} ({p.modules.length} modules)
        </div>
      ))}
    </div>
  );
}
