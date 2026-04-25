"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    ageRange: "",
    primaryGoal: "reduce stress",
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return toast.error("Registration failed");
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    toast.success("Account created");
    router.push("/onboarding");
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <h1 className="text-2xl font-semibold">Create account</h1>
      <input className="w-full rounded border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Age range" value={form.ageRange} onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))} />
      <button className="w-full rounded bg-teal-600 p-2 text-white" type="submit">Register</button>
    </form>
  );
}
