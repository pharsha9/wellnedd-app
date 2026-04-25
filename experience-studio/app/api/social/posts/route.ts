import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
  }

  const posts = await prisma.contentPost.findMany({
    where: { workspaceId },
    include: { socialAccount: true, campaign: true },
    orderBy: { scheduledAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const post = await prisma.contentPost.create({
    data: {
      ...data,
      status: data.scheduledAt ? "SCHEDULED" : "DRAFT",
    },
  });

  return NextResponse.json(post);
}
