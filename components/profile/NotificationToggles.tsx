"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "daily", t: "Morning horoscope", d: "Delivered at 07:00 each day, with the Sun's first light." },
  { key: "weekly", t: "Sunday almanac", d: "A longer reading for the week ahead, by your Moon sign." },
  { key: "transit", t: "Major transits & ingresses", d: "When a slow planet enters a new sign or aspects your chart." },
] as const;

const CHANNELS = [
  { k: "email", l: "Email" },
  { k: "push", l: "Push" },
  { k: "sms", l: "SMS · soon" },
] as const;

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={cn(
        "relative h-6 w-11 rounded-full transition-all duration-300",
        on ? "bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold-dark)]" : "bg-white/10",
      )}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full border border-[var(--gold)]/40 bg-[#0A0A0F] transition-all duration-300", on ? "left-5" : "left-0.5")} />
    </button>
  );
}

export function NotificationToggles() {
  const [notif, setNotif] = useState<Record<string, boolean>>({
    daily: true,
    weekly: true,
    transit: false,
    email: true,
    push: false,
  });

  return (
    <div>
      <div className="space-y-4">
        {ITEMS.map((n) => (
          <div key={n.key} className="flex items-start justify-between gap-6 border-b border-[var(--gold)]/10 py-3 last:border-0">
            <div>
              <p className="text-[var(--text-primary-color)]" style={{ fontFamily: "var(--font-display)", fontSize: "19px" }}>{n.t}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary-color)]">{n.d}</p>
            </div>
            <Toggle on={notif[n.key]} onChange={(v) => setNotif((s) => ({ ...s, [n.key]: v }))} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        {CHANNELS.map((m, i) => (
          <button
            key={m.k}
            onClick={() => i < 2 && setNotif((s) => ({ ...s, [m.k]: !s[m.k] }))}
            disabled={i === 2}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-widest transition",
              notif[m.k]
                ? "border-[var(--gold)] bg-[var(--gold)]/5 text-[var(--gold)]"
                : "border-[var(--gold)]/15 text-[var(--text-muted-color)] hover:text-[var(--text-secondary-color)]",
              i === 2 && "cursor-not-allowed opacity-50",
            )}
          >
            {m.l}
          </button>
        ))}
      </div>
    </div>
  );
}
