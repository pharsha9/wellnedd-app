"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("CREATOR");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/workspaces", {
      method: "POST",
      body: JSON.stringify({ name, type }),
    });
    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome to Experience Studio</h2>
          <p className="mt-2 text-sm text-gray-600">Let's set up your first workspace.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Workspace Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                placeholder="My Brand / My Team"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Workspace Type</label>
              <select
                id="type"
                name="type"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="CREATOR">Creator</option>
                <option value="AGENCY">Agency</option>
                <option value="BRAND">Brand</option>
                <option value="PRODUCT_TEAM">Product Team</option>
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-600 py-2 px-4 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
