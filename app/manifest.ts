import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cosmos — Your Cosmic Blueprint",
    short_name: "Cosmos",
    description:
      "Premium astrology platform. Birth charts, daily horoscopes, and AI interpretations.",
    start_url: "/sanctum",
    display: "standalone",
    background_color: "#0A0A0F",
    theme_color: "#0A0A0F",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
