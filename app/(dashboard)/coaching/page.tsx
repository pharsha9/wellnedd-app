import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CoachingPage() {
  const coaches = await prisma.user.findMany({ where: { role: "COACH" } });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Coaching</h1>
      <p>Schedule virtual sessions with wellness coaches (demo data only).</p>
      <div className="grid gap-3 md:grid-cols-2">
        {coaches.map((c) => <div key={c.id} className="rounded border bg-white p-3">{c.name}</div>)}
      </div>
      <div className="flex gap-2">
        <Link className="rounded border px-3 py-2" href="/coaching/appointments">Appointments</Link>
        <Link className="rounded border px-3 py-2" href="/coaching/messages">Messages</Link>
      </div>
    </div>
  );
}
