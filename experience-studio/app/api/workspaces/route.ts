import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, type } = await req.json();
  const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substring(2, 7);

  const workspace = await prisma.workspace.create({
    data: {
      name,
      type,
      slug,
      members: {
        create: {
          userId: session.user.id,
          role: "OWNER",
          joinedAt: new Date(),
        },
      },
    },
  });

  return NextResponse.json(workspace);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  return NextResponse.json(workspaces);
}
