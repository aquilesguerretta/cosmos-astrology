import { StarField } from "./StarField";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

/**
 * Authenticated app shell — persistent star field, sidebar (desktop) and
 * bottom nav (mobile). Ported from the figma App default export.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full bg-[#0A0A0F] text-[var(--text-primary-color)]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
        <StarField density={80} />
      </div>

      <Sidebar />
      <main className="relative z-10 min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
