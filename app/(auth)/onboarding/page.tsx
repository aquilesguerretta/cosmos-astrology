"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, Button, Input } from "@/components/ui";
import { findCity, cityLabel, type City } from "@/lib/cities";
import { cn } from "@/lib/utils";

const FIELD =
  "group relative flex items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-4 py-3 transition-all duration-300 focus-within:border-[var(--gold)]/50 focus-within:bg-white/[0.04]";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [cityFocused, setCityFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  async function finish() {
    if (!date || !city) return;
    setLoading(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name || undefined,
        date,
        time: time || "12:00",
        lat: city.lat,
        lng: city.lng,
        utcOffset: city.utcOffset,
        location: cityLabel(city),
      }),
    }).catch(() => {});
    router.push("/sanctum");
  }

  const matches = findCity(cityQuery);

  return (
    <Card glow className="w-full max-w-md p-8">
      <div className="mb-6 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full transition", i <= step ? "bg-[var(--gold)]" : "bg-white/10")} />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div>
            <p className="label-caps text-[var(--gold)]/80">Step I · Identity</p>
            <h1 className="font-display mt-1 text-3xl">Who is being charted?</h1>
          </div>
          <Input label="Name" placeholder="Anaïs Lune" value={name} onChange={setName} />
          <label className="block">
            <span className="label-caps mb-2 block">Date of birth</span>
            <div className={FIELD}>
              <Calendar size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-transparent text-sm text-[var(--text-primary-color)] outline-none" />
            </div>
          </label>
          <Button onClick={() => setStep(1)} disabled={!date} className="w-full">
            Continue <ArrowRight size={14} />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="label-caps text-[var(--gold)]/80">Step II · The Moment</p>
            <h1 className="font-display mt-1 text-3xl">When &amp; where?</h1>
          </div>
          <label className="block">
            <span className="label-caps mb-2 block">Hour of birth</span>
            <div className={FIELD}>
              <Clock size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1 bg-transparent text-sm text-[var(--text-primary-color)] outline-none" />
            </div>
          </label>
          <div className="relative">
            <label className="block">
              <span className="label-caps mb-2 block">Place of birth</span>
              <div className={FIELD}>
                <MapPin size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
                <input
                  type="text"
                  value={city ? cityLabel(city) : cityQuery}
                  placeholder="Lisbon, Portugal"
                  autoComplete="off"
                  onChange={(e) => { setCity(null); setCityQuery(e.target.value); }}
                  onFocus={() => setCityFocused(true)}
                  onBlur={() => window.setTimeout(() => setCityFocused(false), 150)}
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary-color)] outline-none placeholder:text-[var(--text-muted-color)]"
                />
              </div>
            </label>
            {cityFocused && !city && matches.length > 0 && (
              <ul className="glass-strong absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto py-1">
                {matches.map((c) => (
                  <li key={cityLabel(c)}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); setCity(c); setCityFocused(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-primary-color)] transition hover:bg-white/[0.03]"
                    >
                      {c.name}, <span className="text-[var(--text-secondary-color)]">{c.country}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(0)}><ArrowLeft size={14} /> Back</Button>
            <Button onClick={() => setStep(2)} disabled={!city} className="flex-1">Continue <ArrowRight size={14} /></Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <p className="label-caps text-[var(--gold)]/80">Step III · Reveal</p>
            <h1 className="font-display mt-1 text-3xl">Your sky awaits</h1>
          </div>
          <div className="space-y-2 border border-[var(--gold)]/15 bg-white/[0.02] p-5 text-sm text-[var(--text-secondary-color)]">
            <div className="flex justify-between"><span className="label-caps">Name</span><span>{name || "—"}</span></div>
            <div className="flex justify-between"><span className="label-caps">Born</span><span>{date} {time || "—"}</span></div>
            <div className="flex justify-between"><span className="label-caps">Place</span><span>{city ? cityLabel(city) : "—"}</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft size={14} /> Back</Button>
            <Button onClick={finish} loading={loading} className="flex-1">Reveal my Sanctum <ArrowRight size={14} /></Button>
          </div>
        </div>
      )}
    </Card>
  );
}
