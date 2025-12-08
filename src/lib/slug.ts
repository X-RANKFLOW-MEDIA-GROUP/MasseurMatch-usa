export function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function therapistSlug(name: string, city?: string) {
  const base = slugify(name);
  if (!city) return base;
  return `${base}-${slugify(city)}`;
}
