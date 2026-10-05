"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const login = useAuthStore((state: any) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy signup logic
    if (email && password && name) {
      login({ email, name });
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-bold font-serif">Instagram</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="rounded border p-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            className="rounded border p-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded border p-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="rounded bg-blue-500 py-2 text-sm font-semibold text-white hover:bg-blue-600">
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-500">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
