import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const items = await prisma.contentItem.findMany({
    where: {
      published: true,
      ...(type ? { type: type as never } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: pageSize,
  });

  return ok(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.contentItem.create({ data: body });
    return ok(item, 201);
  } catch {
    return fail("Could not create content");
  }
}
