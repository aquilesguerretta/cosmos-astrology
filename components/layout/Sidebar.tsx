"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Compass,
  BookOpen,
  Users,
  Settings,
  Crown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/sanctum", label: "Sanctum", icon: LayoutGrid },
  { href: "/chart", label: "Natal Chart", icon: Compass },
  { href: "/reading", label: "Daily Reading", icon: BookOpen },
  { href: "/synastry", label: "Synastry", icon: Users },
  { href: "/profile", label: "The Self", icon: Settings },
] as const;

export interface SidebarUser {
  name: string;
  initial: string;
  signGlyph: string;
  summary: string;
}

const DEFAULT_USER: SidebarUser = {
  name: "Anaïs Lune",
  initial: "A",
  signGlyph: "♎",
  summary: "Libra Sun · Pisces Moon",
};

export function Sidebar({ user = DEFAULT_USER }: { user?: SidebarUser }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-[var(--gold)]/10 bg-[linear-gradient(180deg,rgba(10,10,15,0.95)_0%,rgba(18,18,26,0.95)_100%)] backdrop-blur-md">
      {/* Brand */}
      <Link href="/" className="block border-b border-[var(--gold)]/10 px-7 pb-6 pt-7 text-left">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 22 22" className="text-[var(--gold)]">
            <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="11" cy="11" r="1.5" fill="currentColor" />
            <circle cx="17" cy="11" r="1" fill="currentColor" />
            <circle cx="11" cy="17" r="0.8" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="font-display gold-text text-2xl tracking-wide">Cosmos</span>
        </div>
        <p className="label-caps mt-1.5 text-[10px]">Est · MMXXVI</p>
      </Link>

      {/* User crest */}
      <div className="border-b border-[var(--gold)]/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="font-display grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[var(--purple-mid)] to-[var(--indigo-deep)] text-xl text-[var(--gold-light)]">
              {user.initial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-[linear-gradient(135deg,#E8C97A,#9A7A2E)] text-[10px] text-[#0A0A0F]">
              {user.signGlyph}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-[var(--text-primary-color)]">{user.name}</p>
            <p className="text-[11px] tracking-wider text-[var(--text-secondary-color)]">
              {user.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-5">
        <p className="label-caps px-4 pb-3">Constellations</p>
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "group relative flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all duration-300",
                active
                  ? "text-[var(--gold-light)]"
                  : "text-[var(--text-secondary-color)] hover:text-[var(--text-primary-color)]",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-[linear-gradient(180deg,#E8C97A,#9A7A2E)]" />
              )}
              <Icon size={16} strokeWidth={1.5} className={active ? "text-[var(--gold)]" : ""} />
              <span className="tracking-[0.04em]">{n.label}</span>
              {active && <span className="ml-auto text-xs text-[var(--gold)]/60">✦</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-[var(--gold)]/10 px-5 py-5">
        <div className="glass flex items-center gap-2.5 px-3 py-2.5">
          <Crown size={14} className="text-[var(--gold)]" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[var(--text-primary-color)]">Celestial Plan</p>
            <p className="text-[10px] text-[var(--text-muted-color)]">Renews 14 Jun</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-xs text-[var(--text-muted-color)] transition hover:text-[var(--text-primary-color)]">
          <LogOut size={13} strokeWidth={1.5} /> Retire from session
        </button>
      </div>
    </aside>
  );
}
