import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Admin panel</h1>
      <div className="flex flex-wrap gap-2">
        <Link className="rounded border px-3 py-2" href="/admin/users">Users</Link>
        <Link className="rounded border px-3 py-2" href="/admin/content">Content</Link>
        <Link className="rounded border px-3 py-2" href="/admin/programs">Programs</Link>
        <Link className="rounded border px-3 py-2" href="/admin/analytics">Analytics</Link>
      </div>
    </div>
  );
}
