import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ take: 50, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Admin users</h1>
      <div className="rounded border bg-white">
        {users.map((u) => (
          <div key={u.id} className="border-b p-3 text-sm">
            {u.name} - {u.email} - {u.role}
          </div>
        ))}
      </div>
    </div>
  );
}
