import { getCurrentUser } from "@/lib/user";
import { SynastryClient, type Person } from "@/components/synastry";

export const metadata = { title: "Synastry" };

export default async function SynastryPage() {
  const user = await getCurrentUser();
  const initialA: Person = {
    name: user.name,
    date: user.birth.date,
    time: user.birth.time,
    cityName: user.birthLocation,
    lat: user.birth.lat,
    lng: user.birth.lng,
    utcOffset: user.birth.utcOffset ?? Math.round(user.birth.lng / 15),
  };

  return (
    <div className="w-full max-w-[1280px] px-6 py-10 md:px-10">
      <header className="mb-10">
        <p className="label-caps text-[var(--gold)]/80">The Art of Synastry</p>
        <h1 className="font-display mt-2 text-4xl md:text-5xl">
          Two charts, <em className="font-italic-display text-[var(--gold-light)]">one weather</em>
        </h1>
        <p className="mt-2 max-w-lg text-sm tracking-wide text-[var(--text-secondary-color)]">
          The cosmos does not measure love in stars, only in how the planets choose to speak when
          placed beside each other.
        </p>
      </header>
      <SynastryClient initialA={initialA} />
    </div>
  );
}
