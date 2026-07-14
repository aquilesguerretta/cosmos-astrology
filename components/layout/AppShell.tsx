import { StarField } from "./StarField";
import { Sidebar, type SidebarUser } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { getCurrentUser } from "@/lib/user";
import { calculateNatalChart } from "@/lib/astrology";
import { getDict } from "@/lib/i18n";

/**
 * Authenticated app shell — persistent star field, sidebar (desktop) and
 * bottom nav (mobile). Resolves the active user server-side so the crest
 * shows the real Sun/Moon signs.
 */
export async function AppShell({ children }: { children: React.ReactNode }) {
  const [{ dict }, user] = await Promise.all([getDict(), getCurrentUser()]);

  let sidebarUser: SidebarUser | undefined;
  try {
    const chart = await calculateNatalChart(user.birth);
    const sun = chart.planets.find((p) => p.planet === "sun")!;
    const moon = chart.planets.find((p) => p.planet === "moon")!;
    sidebarUser = {
      name: user.name || dict.common.traveler,
      initial: user.initial,
      sign: sun.sign,
      summary: `${dict.zodiac.names[sun.sign]} · ${dict.zodiac.names[moon.sign]}`,
    };
  } catch {
    sidebarUser = undefined; // fall back to the component default
  }

  return (
    <div className="relative flex min-h-screen w-full bg-[#0A0A0F] text-[var(--text-primary-color)]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
        <StarField density={80} />
      </div>

      <Sidebar user={sidebarUser} />
      <main className="relative z-10 min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
