import Link from "next/link";
import { auth, signOut } from "@/auth";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Activity, 
  Target, 
  List, 
  BookOpen, 
  Video, 
  Gift, 
  Users, 
  Shield, 
  LogOut 
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Check-ins", href: "/check-ins", icon: CheckSquare },
  { label: "Habits", href: "/habits", icon: Activity },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Programs", href: "/programs", icon: List },
  { label: "Content", href: "/content", icon: BookOpen },
  { label: "Coaching", href: "/coaching", icon: Video },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Coach", href: "/coach", icon: Users },
  { label: "Admin", href: "/admin", icon: Shield },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="relative flex min-h-screen vibrant-mesh-bg">
      <div className="watermark-bg">BALANCE</div>
      
      <aside className="relative z-10 w-64 border-r border-slate-200/50 glass p-4 flex flex-col shadow-lg">
        <h2 className="mb-8 mt-2 px-2 text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
          WellNedd
        </h2>
        <nav className="flex-1 space-y-2">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link key={href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-white/60 hover:text-teal-700 hover:shadow-sm" href={href}>
              <Icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-teal-600" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      
      <div className="relative z-10 flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200/50 glass px-8 py-4 shadow-sm">
          <div className="font-medium text-slate-700 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold">
              {session?.user?.name?.[0] || "U"}
            </span>
            {session?.user?.name} 
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
              {session?.user?.role}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex items-center gap-2 rounded-lg border border-slate-200/60 bg-white/50 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100" type="submit">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </header>
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
