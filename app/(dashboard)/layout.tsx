import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUser } from "@/lib/user";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The Initiation gate: without an identity (account session or inscribed
  // natal data), every personal page routes through /welcome first.
  const user = await getCurrentUser();
  if (user.source === "demo") redirect("/welcome");

  return <AppShell>{children}</AppShell>;
}
