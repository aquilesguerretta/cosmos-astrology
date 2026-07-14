"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, Button, Input } from "@/components/ui";
import { CityAutocomplete } from "@/components/geo/CityAutocomplete";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cityLabel, type City } from "@/lib/cities";
import { cn } from "@/lib/utils";

const FIELD =
  "group relative flex items-center gap-3 border border-[var(--gold)]/15 bg-white/[0.025] px-4 py-3 transition-all duration-300 focus-within:border-[var(--gold)]/50 focus-within:bg-white/[0.04]";

export default function OnboardingPage() {
  const router = useRouter();
  const { dict } = useI18n();
  const t = dict.auth;

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [city, setCity] = useState<City | null>(null);
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
        timeZone: city.timeZone,
        location: cityLabel(city),
      }),
    }).catch(() => {});
    router.push("/sanctum");
  }

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
            <p className="label-caps text-[var(--gold)]/80">{t.step1Label}</p>
            <h1 className="font-display mt-1 text-3xl">{t.step1Title}</h1>
          </div>
          <Input label={t.name} placeholder={dict.landing.namePlaceholder} value={name} onChange={setName} />
          <label className="block">
            <span className="label-caps mb-2 block">{dict.landing.dateOfBirth}</span>
            <div className={FIELD}>
              <Calendar size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-transparent text-sm text-[var(--text-primary-color)] outline-none" />
            </div>
          </label>
          <Button onClick={() => setStep(1)} disabled={!date} className="w-full">
            {dict.common.continue} <ArrowRight size={14} />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="label-caps text-[var(--gold)]/80">{t.step2Label}</p>
            <h1 className="font-display mt-1 text-3xl">{t.step2Title}</h1>
          </div>
          <label className="block">
            <span className="label-caps mb-2 block">{dict.landing.hourOfBirth}</span>
            <div className={FIELD}>
              <Clock size={15} strokeWidth={1.4} className="text-[var(--gold)]/70" />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1 bg-transparent text-sm text-[var(--text-primary-color)] outline-none" />
            </div>
          </label>
          <CityAutocomplete
            label={dict.landing.placeOfArrival}
            placeholder={dict.landing.cityPlaceholder}
            value={city}
            onChange={setCity}
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(0)}><ArrowLeft size={14} /> {dict.common.back}</Button>
            <Button onClick={() => setStep(2)} disabled={!city} className="flex-1">
              {dict.common.continue} <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <p className="label-caps text-[var(--gold)]/80">{t.step3Label}</p>
            <h1 className="font-display mt-1 text-3xl">{t.step3Title}</h1>
          </div>
          <div className="space-y-2 border border-[var(--gold)]/15 bg-white/[0.02] p-5 text-sm text-[var(--text-secondary-color)]">
            <div className="flex justify-between gap-4"><span className="label-caps">{t.name}</span><span className="truncate">{name || "—"}</span></div>
            <div className="flex justify-between gap-4"><span className="label-caps">{t.born}</span><span>{date} {time || "12:00"}</span></div>
            <div className="flex justify-between gap-4"><span className="label-caps">{t.place}</span><span className="truncate">{city ? cityLabel(city) : "—"}</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft size={14} /> {dict.common.back}</Button>
            <Button onClick={finish} loading={loading} className="flex-1">
              {t.revealSanctum} <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
