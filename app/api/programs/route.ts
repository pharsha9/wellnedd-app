import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;

  const programs = await prisma.program.findMany({
    where: {
      isPublic: true,
      ...(category ? { category: category as never } : {}),
      ...(difficulty ? { difficulty: difficulty as never } : {}),
    },
    include: {
      modules: {
        include: { lessons: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { title: "asc" },
  });
  return ok(programs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prisma.program.create({ data: body });
    return ok(created, 201);
  } catch {
    return fail("Could not create program");
  }
}
