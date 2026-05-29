import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmos — Your Cosmic Blueprint",
  description:
    "Premium astrology platform. Birth charts, daily horoscopes, and AI interpretations.",
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
