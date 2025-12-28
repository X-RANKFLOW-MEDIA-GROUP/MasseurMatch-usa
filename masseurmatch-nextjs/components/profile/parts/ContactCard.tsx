import type { PublicProfile } from "@/lib/profile";

function normalizeUrl(u: string): string {
  const s = u.trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

export default function ContactCard({ profile }: { profile: PublicProfile }) {
  const phone = profile.contact_phone?.trim() || "";
  const email = profile.contact_email?.trim() || "";
  const site = profile.contact_website?.trim() || "";
  const ig = profile.contact_instagram?.trim() || "";

  const hasAny = Boolean(phone || email || site || ig);

  return (
    <div className="rounded-2xl border p-4 dark:border-gray-700">
      <div className="text-base font-semibold">Contact Options</div>
      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
        Contact happens outside the platform. No in-site booking.
      </div>

      {!hasAny ? (
        <div className="mt-4 rounded-xl border bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          No contact options listed yet.
        </div>
      ) : (
        <div className="mt-4 space-y-2 text-sm">
          {phone && (
            <a
              className="block rounded-xl border px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              href={`tel:${phone}`}
              aria-label={`Call or text ${phone}`}
            >
              📞 Call/Text: {phone}
            </a>
          )}

          {email && (
            <a
              className="block rounded-xl border px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              href={`mailto:${email}`}
              aria-label={`Email ${email}`}
            >
              ✉️ Email: {email}
            </a>
          )}

          {site && (
            <a
              className="block rounded-xl border px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              href={normalizeUrl(site)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Visit website"
            >
              🌐 Website
            </a>
          )}

          {ig && (
            <a
              className="block rounded-xl border px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              href={normalizeUrl(ig)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Visit Instagram profile"
            >
              📷 Instagram
            </a>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        Always verify details directly with the provider before booking.
      </div>
    </div>
  );
}
