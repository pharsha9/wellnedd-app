import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProgramDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const program = await prisma.program.findUnique({
    where: { slug },
    include: { modules: { include: { lessons: true }, orderBy: { order: "asc" } } },
  });
  if (!program) notFound();
  const enrollment = await prisma.programEnrollment.findUnique({
    where: { userId_programId: { userId: session!.user!.id, programId: program.id } },
  });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{program.title}</h1>
      <p>{program.description}</p>
      <p className="text-sm">Progress: {enrollment?.progressPercent ?? 0}%</p>
      {program.modules.map((m) => (
        <div key={m.id} className="rounded-xl border bg-white p-4">
          <p className="font-semibold">{m.order}. {m.title}</p>
          {m.lessons.map((l) => <p key={l.id} className="text-sm text-slate-600">- {l.title}</p>)}
        </div>
      ))}
    </div>
  );
}
