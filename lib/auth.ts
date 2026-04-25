import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return user;
}

export async function requireRole(role: Role | Role[]) {
  const allowed = Array.isArray(role) ? role : [role];
  const user = await requireAuth();
  if (!allowed.includes(user.role)) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return user;
}
