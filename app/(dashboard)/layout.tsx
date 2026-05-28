// TODO: Prompt 2 — replace with AppShell (Sidebar + StarField + main)
// See figma-export/src/app/App.tsx → Sidebar component (lines 232-306)
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-screen">{children}</div>;
}
