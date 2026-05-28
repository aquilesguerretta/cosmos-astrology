"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Atlas", href: "#" },
  { label: "Practitioners", href: "#" },
  { label: "Almanac", href: "#" },
  { label: "Membership", href: "#" },
];

/** Marketing top bar — desktop nav (figma landing header) + mobile hamburger. */
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
      <Link href="/" className="flex items-center gap-2.5">
        <svg width="22" height="22" viewBox="0 0 22 22" className="text-[var(--gold)]">
          <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <circle cx="11" cy="11" r="1.5" fill="currentColor" />
        </svg>
        <span className="font-display gold-text text-xl">Cosmos</span>
      </Link>

      {/* desktop nav */}
      <nav className="hidden items-center gap-9 text-[13px] tracking-wide text-[var(--text-secondary-color)] md:flex">
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} className="transition hover:text-[var(--gold-light)]">
            {l.label}
          </a>
        ))}
      </nav>

      <Link
        href="/sanctum"
        className="label-caps hidden items-center gap-2 text-xs text-[var(--gold-light)] transition hover:text-[var(--gold)] md:flex"
      >
        Enter Sanctum <ArrowRight size={14} />
      </Link>

      {/* mobile toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[var(--gold-light)] md:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* mobile menu */}
      {open && (
        <div className="glass-strong absolute left-4 right-4 top-full z-30 flex flex-col gap-1 p-4 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm tracking-wide text-[var(--text-secondary-color)] transition hover:text-[var(--gold-light)]"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/sanctum"
            onClick={() => setOpen(false)}
            className="label-caps mt-1 flex items-center gap-2 border-t border-[var(--gold)]/15 px-3 pt-3 text-xs text-[var(--gold-light)]"
          >
            Enter Sanctum <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </header>
  );
}
