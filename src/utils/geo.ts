export async function geocodeLocation(raw: string) {
    const loc = String(raw || "").trim();
  
    if (!loc) return null;
  
    const cepBR = /^\d{5}-?\d{3}$/;
    const zipUS = /^\d{5}(-\d{4})?$/;
  
    // 1) ZIP CODE USA
    if (zipUS.test(loc)) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${loc}`);
        if (res.ok) {
          const data = await res.json();
          const place = data.places?.[0];
  
          return {
            city: place["place name"],
            state: place["state abbreviation"],
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude)
          };
        }
      } catch {}
    }
  
    // 2) CEP BRASIL
    if (cepBR.test(loc)) {
      try {
        const sanitized = loc.replace("-", "");
        const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
        const data = await res.json();
  
        if (data.erro !== true) {
          // para pegar latitude/longitude no Brasil -> API Nominatim
          const q = `${data.localidade} ${data.uf}`;
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              q
            )}`
          ).then((r) => r.json());
  
          if (geo.length > 0) {
            return {
              city: data.localidade,
              state: data.uf,
              lat: parseFloat(geo[0].lat),
              lng: parseFloat(geo[0].lon)
            };
          }
        }
      } catch {}
    }
  
    // 3) Cidade-Estado (ex: Atlanta-GA)
    if (loc.includes("-")) {
      const [city, state] = loc.split("-");
  
      const q = `${city.trim()} ${state.trim()}`;
  
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}`
      ).then((r) => r.json());
  
      if (geo.length > 0) {
        return {
          city: city.trim(),
          state: state.trim(),
          lat: parseFloat(geo[0].lat),
          lng: parseFloat(geo[0].lon)
        };
      }
    }
  
    // 4) Só cidade (ex: Orlando)
    const geoCity = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        loc
      )}`
    ).then((r) => r.json());
  
    if (geoCity.length > 0) {
      return {
        city: geoCity[0].display_name.split(",")[0],
        state: "",
        lat: parseFloat(geoCity[0].lat),
        lng: parseFloat(geoCity[0].lon)
      };
    }
  
    return null;
  }
  