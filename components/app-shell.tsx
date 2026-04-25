import Link from "next/link";
import { auth, signOut } from "@/auth";
import { 
  LayoutDashboard, CheckSquare, Activity, Target, List, BookOpen, Video,
  Gift, Users, Shield, LogOut, Footprints, ClipboardCheck, Utensils,
  Syringe, FileText, Heart, Brain
} from "lucide-react";
import { Chatbot } from "@/components/chatbot";

const NAV_GROUPS = [
  {
    label: "Health",
    items: [
      { label: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
      { label: "Check-ins",    href: "/check-ins",    icon: CheckSquare },
      { label: "Tracker",      href: "/tracker",      icon: Footprints },
      { label: "Goals",        href: "/goals",        icon: Target },
    ],
  },
  {
    label: "Wellness",
    items: [
      { label: "Programs",     href: "/programs",     icon: List },
      { label: "Habits",       href: "/habits",       icon: Activity },
      { label: "Coaching",     href: "/coaching",     icon: Video },
      { label: "Assess Wellbeing", href: "/wellness", icon: ClipboardCheck },
    ],
  },
  {
    label: "Learn",
    items: [
      { label: "Nutrition & Recipes", href: "/nutrition", icon: Utensils },
      { label: "Blogs",        href: "/blogs",        icon: FileText },
      { label: "Vaccine Guide",href: "/vaccine",      icon: Syringe },
      { label: "Content",      href: "/content",      icon: BookOpen },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Rewards",      href: "/rewards",      icon: Gift },
      { label: "Coach Panel",  href: "/coach",        icon: Users },
      { label: "Admin",        href: "/admin",        icon: Shield },
    ],
  },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="relative flex min-h-screen vibrant-mesh-bg">
      <div className="watermark-bg">WELLNEDD</div>
      
      <aside className="relative z-10 w-60 border-r border-slate-200/50 glass flex flex-col shadow-lg overflow-y-auto">
        <div className="p-4 pb-2">
          <h2 className="mt-2 px-2 text-xl font-black bg-gradient-to-r from-sky-500 to-violet-600 bg-clip-text text-transparent">
            WellNedd
          </h2>
        </div>
        <nav className="flex-1 p-3 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-white/80 hover:text-sky-700 hover:shadow-sm">
                    <Icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-sky-500" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      
      <div className="relative z-10 flex flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between border-b border-slate-200/50 glass px-6 py-3 shadow-sm">
          <div className="font-bold text-slate-800 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white font-bold shadow-sm text-sm">
              {session?.user?.name?.[0] || "U"}
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">{session?.user?.name}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{session?.user?.role}</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200" type="submit">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </header>
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      
      <Chatbot />
    </div>
  );
}


