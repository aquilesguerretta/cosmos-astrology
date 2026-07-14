"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { Card, Button, Input } from "@/components/ui";
import { GoogleMark } from "@/components/auth/GoogleMark";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function LoginPage() {
  const router = useRouter();
  const { dict } = useI18n();
  const t = dict.auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError(t.invalidCreds);
    else router.push("/sanctum");
  }

  return (
    <Card glow className="w-full max-w-sm p-8">
      <h1 className="font-display text-3xl">{t.signInTitle}</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary-color)]">{t.signInSub}</p>

      <button
        onClick={() => signIn("google", { callbackUrl: "/sanctum" })}
        className="mt-6 flex w-full items-center justify-center gap-3 border border-[var(--gold)]/30 px-4 py-3 text-sm text-[var(--text-primary-color)] transition hover:bg-white/[0.04]"
      >
        <GoogleMark /> {t.google}
      </button>

      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted-color)]">
        <span className="h-px flex-1 bg-[var(--gold)]/15" /> {t.or} <span className="h-px flex-1 bg-[var(--gold)]/15" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input label={t.email} type="email" placeholder="you@stars.app" value={email} onChange={setEmail} required />
        <Input label={t.password} type="password" placeholder="••••••••" value={password} onChange={setPassword} error={error} required />
        <Button type="submit" loading={loading} className="w-full">{t.enterBtn}</Button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--text-secondary-color)]">
        {t.newHere}{" "}
        <Link href="/register" className="text-[var(--gold-light)] hover:text-[var(--gold)]">{t.createAccount}</Link>
      </p>

      <Link
        href="/onboarding"
        className="label-caps mt-5 flex items-center justify-center gap-2 border-t border-[var(--gold)]/15 pt-4 text-xs text-[var(--text-muted-color)] transition hover:text-[var(--gold-light)]"
      >
        <Sparkles size={11} /> {t.guest}
      </Link>
    </Card>
  );
}
