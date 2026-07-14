"use client";

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplainerProps {
  title: string;
  /** Bullet lines (already localized). */
  items?: string[];
  /** Free paragraph (already localized). */
  body?: string;
  className?: string;
  defaultOpen?: boolean;
}

/** Collapsible "how this works" box — used to make every page self-explaining. */
export function Explainer({ title, items, body, className = "", defaultOpen = false }: ExplainerProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("border border-[var(--gold)]/15 bg-white/[0.02]", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <BookOpen size={13} className="shrink-0 text-[var(--gold)]" />
        <span className="label-caps flex-1 text-[var(--gold-light)]">{title}</span>
        <ChevronDown size={14} className={cn("shrink-0 text-[var(--gold)]/60 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="animate-fade-up border-t border-[var(--gold)]/10 px-4 py-4">
          {body && <p className="text-sm leading-relaxed text-[var(--text-secondary-color)]">{body}</p>}
          {items && (
            <ul className={cn("space-y-2.5", body && "mt-3")}>
              {items.map((it, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-secondary-color)]">
                  <span className="mt-0.5 text-[var(--gold)]">✦</span>
                  {it}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
