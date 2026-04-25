"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"user" | "staff">("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onUserSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    setLoading(true);
    const res = await signIn("user-login", { name, redirect: false });
    setLoading(false);
    if (res?.ok) {
      toast.success("Welcome!");
      router.push("/dashboard");
    } else {
      toast.error("Failed to login");
    }
  }

  async function onStaffSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("staff-login", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      toast.success("Welcome back");
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Log in</h1>
      
      <div className="flex border-b">
        <button
          className={`flex-1 pb-2 ${activeTab === "user" ? "border-b-2 border-teal-600 font-medium" : "text-gray-500"}`}
          onClick={() => setActiveTab("user")}
          type="button"
        >
          Quick Access
        </button>
        <button
          className={`flex-1 pb-2 ${activeTab === "staff" ? "border-b-2 border-teal-600 font-medium" : "text-gray-500"}`}
          onClick={() => setActiveTab("staff")}
          type="button"
        >
          Staff Login
        </button>
      </div>

      {activeTab === "user" ? (
        <form className="space-y-4" onSubmit={onUserSubmit}>
          <p className="text-sm text-gray-500">Just enter your name to access your wellness dashboard.</p>
          <input className="w-full rounded border p-2" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          <button className="w-full rounded bg-teal-600 p-2 text-white disabled:opacity-50" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Enter Dashboard"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onStaffSubmit}>
          <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          <button className="w-full rounded bg-teal-600 p-2 text-white disabled:opacity-50" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Log in"}
          </button>
        </form>
      )}
    </div>
  );
}
