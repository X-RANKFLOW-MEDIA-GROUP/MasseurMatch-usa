export function makeSlug(name, city) {
  return `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}-${city}`;
}
