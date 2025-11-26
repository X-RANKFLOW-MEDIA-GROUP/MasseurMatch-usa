import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Buscar massagistas e localizações
  const { data, error } = await supabase
    .from("profile_edits")
    .select("user_id, location, profiles:profile_id(profile_photo)");

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];

  for (const therapist of data) {
    if (!therapist.location) continue;

    // Geocode → transformar localização em lat/lng
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        therapist.location
      )}`
    ).then((r) => r.json());

    if (!geoRes?.length) continue;

    const { lat, lon } = geoRes[0];

    results.push({
      id: therapist.user_id,
      location: therapist.location,
      photo: therapist.profiles?.profile_photo || null,
      latitude: Number(lat),
      longitude: Number(lon),
    });
  }

  return NextResponse.json(results);
}
