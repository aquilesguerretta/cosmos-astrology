import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getDict } from "@/lib/i18n";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "https://cosmos-astrology.vercel.app"),
  title: {
    default: "Cosmos — Your Cosmic Blueprint",
    template: "%s · Cosmos",
  },
  description:
    "Premium astrology platform. Birth charts, daily horoscopes, and AI interpretations.",
  applicationName: "Cosmos",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Cosmos" },
  openGraph: {
    title: "Cosmos — Your Cosmic Blueprint",
    description:
      "Premium astrology platform. Birth charts, daily horoscopes, and AI interpretations.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, dict } = await getDict();

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
