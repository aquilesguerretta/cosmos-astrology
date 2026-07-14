"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Compass, BookOpen, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";

export function BottomNav() {
  const pathname = usePathname();
  const { dict } = useI18n();

  const NAV = [
    { href: "/sanctum", label: dict.nav.sanctum, icon: LayoutGrid },
    { href: "/chart", label: dict.nav.chartShort, icon: Compass },
    { href: "/tarot", label: dict.nav.tarotShort, icon: Layers },
    { href: "/reading", label: dict.nav.readingShort, icon: BookOpen },
    { href: "/profile", label: dict.nav.selfShort, icon: Settings },
  ];

  return (
    <nav className="glass-strong fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-[var(--gold)]/15 pb-[env(safe-area-inset-bottom)] lg:hidden">
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
