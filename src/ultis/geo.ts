type GeoResult = {
  city: string;
  state: string;
  lat: number;
  lng: number;
};

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search?format=json&q=";

async function fetchNominatim(query: string) {
  const res = await fetch(`${NOMINATIM_URL}${encodeURIComponent(query)}`);
  return res.json();
}

function asGeoResult(
  entry: { lat: string; lon: string },
  city: string,
  state = ""
): GeoResult {
  return {
    city,
    state,
    lat: parseFloat(entry.lat),
    lng: parseFloat(entry.lon),
  };
}

function isNumeric(value: string) {
  return (
    value.length > 0 && [...value].every((char) => char >= "0" && char <= "9")
  );
}

function isZipUS(value: string) {
  if (value.length === 5) return isNumeric(value);
  if (value.length === 10 && value[5] === "-") {
    return isNumeric(value.replace("-", ""));
  }
  return false;
}

function isCepBR(value: string) {
  if (value.length === 8) return isNumeric(value);
  if (value.length === 9 && value[5] === "-") {
    return isNumeric(value.replace("-", ""));
  }
  return false;
}

async function geocodeZipUS(loc: string): Promise<GeoResult | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${loc}`);
    if (!res.ok) return null;

    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;

    return {
      city: place["place name"],
      state: place["state abbreviation"],
      lat: parseFloat(place.latitude),
      lng: parseFloat(place.longitude),
    };
  } catch {
    return null;
  }
}

async function geocodeCepBR(loc: string): Promise<GeoResult | null> {
  try {
    const sanitized = loc.replace("-", "");
    const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
    const data = await res.json();
    if (data.erro === true) return null;

    // Consolida a busca de latitude/longitude via Nominatim.
    const geo = await fetchNominatim(`${data.localidade} ${data.uf}`);
    if (geo.length === 0) return null;

    return asGeoResult(geo[0], data.localidade, data.uf);
  } catch {
    return null;
  }
}

async function geocodeCityState(loc: string): Promise<GeoResult | null> {
  if (!loc.includes("-")) return null;

  const [city, state] = loc.split("-");
  const trimmedCity = city.trim();
  const trimmedState = state.trim();
  const geo = await fetchNominatim(`${trimmedCity} ${trimmedState}`);

  if (geo.length === 0) return null;

  return asGeoResult(geo[0], trimmedCity, trimmedState);
}

async function geocodeCity(loc: string): Promise<GeoResult | null> {
  const geoCity = await fetchNominatim(loc);
  if (geoCity.length === 0) return null;

  const city = geoCity[0].display_name.split(",")[0];
  return asGeoResult(geoCity[0], city);
}

export async function geocodeLocation(raw: string) {
  const loc = String(raw || "").trim();

  if (!loc) return null;

  // 1) ZIP CODE USA
  if (isZipUS(loc)) {
    const result = await geocodeZipUS(loc);
    if (result) return result;
  }

  // 2) CEP BRASIL
  if (isCepBR(loc)) {
    const result = await geocodeCepBR(loc);
    if (result) return result;
  }

  // 3) Cidade-Estado (ex: Atlanta-GA)
  const cityStateResult = await geocodeCityState(loc);
  if (cityStateResult) return cityStateResult;

  // 4) Só cidade (ex: Orlando)
  return geocodeCity(loc);
}
