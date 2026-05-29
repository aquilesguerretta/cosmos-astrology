"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, Button, Input } from "@/components/ui";
import { GoogleMark } from "@/components/auth/GoogleMark";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Could not create your account.");
      return;
    }
    const signRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push(signRes?.error ? "/login" : "/onboarding");
  }

  return (
    <Card glow className="w-full max-w-sm p-8">
      <h1 className="font-display text-3xl">Begin your chart</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary-color)]">Two millennia of sky, made personal.</p>

      <button
        onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
        className="mt-6 flex w-full items-center justify-center gap-3 border border-[var(--gold)]/30 px-4 py-3 text-sm text-[var(--text-primary-color)] transition hover:bg-white/[0.04]"
      >
        <GoogleMark /> Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
        <span className="h-px flex-1 bg-[var(--gold)]/15" /> or <span className="h-px flex-1 bg-[var(--gold)]/15" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Name" placeholder="Anaïs Lune" value={name} onChange={setName} required />
        <Input label="Email" type="email" placeholder="you@stars.app" value={email} onChange={setEmail} required />
        <Input label="Password" type="password" placeholder="At least 8 characters" value={password} onChange={setPassword} error={error} required />
        <Button type="submit" loading={loading} className="w-full">Create account</Button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--text-secondary-color)]">
        Already inscribed?{" "}
        <Link href="/login" className="text-[var(--gold-light)] hover:text-[var(--gold)]">Sign in</Link>
      </p>
    </Card>
  );
}
