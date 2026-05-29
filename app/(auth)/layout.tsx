import type { Metadata } from "next";
import Link from "next/link";
import { StarField } from "@/components/layout";

export const metadata: Metadata = { title: "Sign in" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F]">
      <div className="absolute inset-0 opacity-60">
        <StarField density={140} />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 22 22" className="text-[var(--gold)]">
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="11" cy="11" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-display gold-text text-2xl">Cosmos</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
