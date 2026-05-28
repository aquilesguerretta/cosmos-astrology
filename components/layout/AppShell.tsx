import { StarField } from "./StarField";
import { Sidebar } from "./Sidebar";

/**
 * Authenticated app shell — persistent star field + sidebar + main column.
 * Ported from the figma App default export (non-landing branch).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full bg-[#0A0A0F] text-[var(--text-primary-color)]">
      {/* persistent star field on app pages */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
        <StarField density={80} />
      </div>

      <Sidebar />
      <main className="relative z-10 min-w-0 flex-1">{children}</main>
    </div>
  );
}
