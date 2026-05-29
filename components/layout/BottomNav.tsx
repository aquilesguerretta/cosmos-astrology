"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Compass, BookOpen, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/sanctum", label: "Sanctum", icon: LayoutGrid },
  { href: "/chart", label: "Chart", icon: Compass },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/synastry", label: "Synastry", icon: Users },
  { href: "/profile", label: "Self", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="glass-strong fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-[var(--gold)]/15 lg:hidden">
      {NAV.map((n) => {
        const Icon = n.icon;
        const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] tracking-wide transition",
              active ? "text-[var(--gold-light)]" : "text-[var(--text-muted-color)]",
            )}
          >
            <Icon size={18} strokeWidth={1.5} className={active ? "text-[var(--gold)]" : ""} />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
