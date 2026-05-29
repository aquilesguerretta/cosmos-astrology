"use client";

import { useEffect, useState } from "react";

export function Greeting({ name }: { name: string }) {
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => setHour(new Date().getHours()), []);

  const word =
    hour === null ? "Welcome" : hour >= 5 && hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const glyph = hour === null ? "✦" : hour >= 5 && hour < 18 ? "☀️" : "🌙";

  return (
    <h1 className="font-display text-4xl md:text-5xl">
      {word}, <em className="font-italic-display text-[var(--gold-light)]">{name.split(" ")[0]}</em>{" "}
      <span className="text-2xl">{glyph}</span>
    </h1>
  );
}
