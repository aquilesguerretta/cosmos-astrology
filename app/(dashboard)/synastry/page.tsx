import { getCurrentUser } from "@/lib/user";
import { getDict } from "@/lib/i18n";
import { SynastryClient, type Person } from "@/components/synastry";

export const metadata = { title: "Synastry" };

export default async function SynastryPage() {
  const [{ dict }, user] = await Promise.all([getDict(), getCurrentUser()]);

  const locParts = user.birthLocation.split(",").map((s) => s.trim());
  const initialA: Person = {
    name: user.name || dict.common.traveler,
    date: user.birth.date,
    time: user.birth.time,
    city: {
      name: locParts[0] || user.birthLocation || "—",
      country: locParts.slice(1).join(", "),
      lat: user.birth.lat,
      lng: user.birth.lng,
      timeZone: user.birth.timeZone ?? "UTC",
    },
  };

  return (
    <div className="w-full max-w-[1280px] px-4 py-10 sm:px-6 md:px-10">
      <header className="mb-10">
        <p className="label-caps text-[var(--gold)]/80">{dict.synastry.label}</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          {dict.synastry.title1}{" "}
          <em className="font-italic-display text-[var(--gold-light)]">{dict.synastry.title2}</em>
        </h1>
        <p className="mt-2 max-w-lg text-sm tracking-wide text-[var(--text-secondary-color)]">
          {dict.synastry.sub}
        </p>
      </header>
      <SynastryClient initialA={initialA} />
    </div>
  );
}
