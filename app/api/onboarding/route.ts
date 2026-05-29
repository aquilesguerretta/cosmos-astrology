import { z } from "zod";
import { auth, AUTH_ENABLED } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateNatalChart, signOf } from "@/lib/astrology";

const Schema = z.object({
  name: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  lat: z.number(),
  lng: z.number(),
  utcOffset: z.number().optional(),
  location: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: "Invalid natal data." }, { status: 400 });
  }
  const d = parsed.data;

  // Demo mode: accept without persisting.
  if (!AUTH_ENABLED) return Response.json({ ok: true, demo: true });

  const session = await auth();
  const id = session?.user?.id;
  if (!id) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const chart = await calculateNatalChart({
    date: d.date,
    time: d.time,
    lat: d.lat,
    lng: d.lng,
    utcOffset: d.utcOffset,
  });
  const sun = chart.planets.find((p) => p.planet === "sun")!;
  const moon = chart.planets.find((p) => p.planet === "moon")!;

  await prisma.user.update({
    where: { id },
    data: {
      ...(d.name ? { name: d.name } : {}),
      birthDate: new Date(`${d.date}T${d.time}:00Z`),
      birthTime: d.time,
      birthLat: d.lat,
      birthLng: d.lng,
      birthLocation: d.location,
      utcOffset: d.utcOffset,
      sunSign: sun.sign,
      moonSign: moon.sign,
      ascendant: signOf(chart.angles.asc),
      chartData: JSON.parse(JSON.stringify(chart)),
    },
  });

  return Response.json({ ok: true });
}
