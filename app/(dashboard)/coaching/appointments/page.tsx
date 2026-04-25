import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AppointmentsPage() {
  const session = await auth();
  const appointments = await prisma.appointment.findMany({
    where: { userId: session!.user!.id },
    include: { coach: true },
    orderBy: { scheduledAt: "desc" },
  });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Appointments</h1>
      <div className="space-y-2">
        {appointments.map((a) => (
          <div key={a.id} className="rounded border bg-white p-4">
            {new Date(a.scheduledAt).toLocaleString()} with {a.coach.name} ({a.mode})
          </div>
        ))}
      </div>
    </div>
  );
}
