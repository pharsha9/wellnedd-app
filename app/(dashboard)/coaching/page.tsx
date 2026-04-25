import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/fade-in";
import { Dumbbell, Brain, Calendar, MessageSquare, Star, Users } from "lucide-react";

const TRACKS = [
  {
    id: "fitness",
    title: "Fitness Coaching",
    icon: Dumbbell,
    gradient: "from-sky-500 to-cyan-600",
    description: "Work 1-on-1 with a certified fitness coach to build personalized workout plans, improve strength, and reach your body composition goals.",
    features: ["Custom workout programming", "Weekly progress check-ins", "Form correction & injury prevention", "Nutrition guidance for fitness goals"],
    sessions: "3x per week",
    cta: "Book a Fitness Session",
  },
  {
    id: "meditation",
    title: "Meditation Coaching",
    icon: Brain,
    gradient: "from-violet-500 to-purple-600",
    description: "Learn mindfulness and meditation techniques with a trained guide. Reduce stress, improve focus, and build emotional resilience.",
    features: ["Guided breathwork sessions", "Personalized meditation practice", "Stress & anxiety management", "Sleep improvement protocols"],
    sessions: "2x per week",
    cta: "Book a Meditation Session",
  },
];

export default async function CoachingPage() {
  const coaches = await prisma.user.findMany({ where: { role: "COACH" } });

  return (
    <div className="space-y-10">
      <FadeIn delay={0.05}>
        <h1 className="text-3xl font-bold text-slate-900">Coaching</h1>
        <p className="mt-1 text-slate-600">Work with expert coaches tailored to your wellness journey.</p>
      </FadeIn>

      {/* Coaching Tracks */}
      <div className="grid gap-6 md:grid-cols-2">
        {TRACKS.map((track, i) => {
          const Icon = track.icon;
          return (
            <FadeIn key={track.id} delay={0.1 + i * 0.1}>
              <div className="rounded-2xl glass shadow-sm hover:shadow-lg transition-all overflow-hidden">
                <div className={`bg-gradient-to-r ${track.gradient} p-6 relative overflow-hidden`}>
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                  <div className="absolute -right-4 -bottom-12 h-40 w-40 rounded-full bg-white/10" />
                  <Icon className="h-10 w-10 text-white relative z-10" />
                  <h2 className="mt-3 text-2xl font-bold text-white relative z-10">{track.title}</h2>
                  <div className="mt-2 flex items-center gap-2 relative z-10">
                    <Users className="h-4 w-4 text-white/70" />
                    <span className="text-sm text-white/80">{track.sessions}</span>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <p className="text-slate-600">{track.description}</p>
                  <ul className="space-y-2">
                    {track.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/coaching/appointments"
                    className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${track.gradient} py-3 font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.01]`}>
                    <Calendar className="h-4 w-4" />
                    {track.cta}
                  </Link>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Coach roster */}
      {coaches.length > 0 && (
        <FadeIn delay={0.3}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Meet Your Coaches</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coaches.map(coach => (
                <div key={coach.id} className="rounded-2xl glass p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white font-bold text-lg shadow-md flex-shrink-0">
                    {coach.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{coach.name}</h3>
                    <div className="mt-0.5 flex items-center gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Quick links */}
      <FadeIn delay={0.35}>
        <div className="flex gap-3">
          <Link href="/coaching/appointments"
            className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 font-bold text-sky-700 shadow-sm transition-all hover:bg-sky-100">
            <Calendar className="h-4 w-4" /> My Appointments
          </Link>
          <Link href="/coaching/messages"
            className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-5 py-3 font-bold text-violet-700 shadow-sm transition-all hover:bg-violet-100">
            <MessageSquare className="h-4 w-4" /> Messages
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
