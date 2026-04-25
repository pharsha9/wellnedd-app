import Link from "next/link";
import { auth, signOut } from "@/auth";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Check-ins", "/check-ins"],
  ["Habits", "/habits"],
  ["Goals", "/goals"],
  ["Programs", "/programs"],
  ["Content", "/content"],
  ["Coaching", "/coaching"],
  ["Rewards", "/rewards"],
  ["Coach", "/coach"],
  ["Admin", "/admin"],
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-slate-200 bg-white p-4">
        <h2 className="mb-4 text-xl font-semibold text-teal-700">WellNedd</h2>
        <nav className="space-y-1">
          {nav.map(([label, href]) => (
            <Link key={href} className="block rounded px-3 py-2 hover:bg-slate-100" href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div className="text-sm text-slate-700">
            {session?.user?.name} ({session?.user?.role})
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded border border-slate-300 px-3 py-1.5 text-sm" type="submit">
              Sign out
            </button>
          </form>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
