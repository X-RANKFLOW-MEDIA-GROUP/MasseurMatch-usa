import type { PublicProfile } from "@/lib/profile";
import { planPhotoLimit, safeAlt } from "@/lib/profile";

export default function PhotoGrid({ profile }: { profile: PublicProfile }) {
  const photos = Array.isArray(profile.photos) ? profile.photos : [];
  const limit = planPhotoLimit(profile.plan_tier);
  const visible = photos.slice(0, limit);
  const hiddenCount = Math.max(0, photos.length - visible.length);

  if (!visible.length) {
    return (
      <div className="rounded-xl border p-6 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
        No photos added yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Photos</h2>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Plan: {profile.plan_tier} | Showing {visible.length} of {photos.length}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {visible.map((ph, i) => (
          <a
            key={`${ph.url}:${i}`}
            href={ph.url}
            className="group relative overflow-hidden rounded-xl border dark:border-gray-700"
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${safeAlt(profile, ph, i)}`}
          >
            <img
              src={ph.url}
              alt={safeAlt(profile, ph, i)}
              className="h-40 w-full object-cover transition-transform group-hover:scale-105 md:h-44"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-4 rounded-xl border bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <strong>{hiddenCount}</strong> additional {hiddenCount === 1 ? "photo" : "photos"}{" "}
          available on higher subscription plans.
        </div>
      )}
    </div>
  );
}
