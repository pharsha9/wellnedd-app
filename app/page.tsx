import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <main className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-900">WellNedd</h1>
        <p className="mt-3 text-slate-600">
          A complete wellness platform for daily check-ins, programs, coaching, rewards, and
          admin analytics.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-lg bg-teal-600 px-4 py-2 text-white" href="/auth/login">
            Log in
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2" href="/auth/register">
            Register
          </Link>
          <Link className="rounded-lg border border-slate-300 px-4 py-2" href="/dashboard">
            Open dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
