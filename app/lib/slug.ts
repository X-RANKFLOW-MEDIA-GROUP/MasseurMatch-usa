export function makeSlug(name: string, city: string) {
  return `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}-${city}`;
}
