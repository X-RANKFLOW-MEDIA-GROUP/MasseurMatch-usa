import { ReactNode } from "react";
import { sectionDefinitions } from "@/lib/dashboard/section-config";

export default async function EditAdLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ adId: string }>;
}) {
  const { adId } = await params;
  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">Edit ad</div>
        <div className="mt-1 text-sm text-slate-500">Ad ID: {adId}</div>

        <nav className="mt-4 flex flex-col gap-1">
          {sectionDefinitions.map((s) => (
            <a
              key={s.key}
              className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              href={`/dashboard/ads/${adId}/edit/${s.key}`}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </aside>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">{children}</section>
    </div>
  );
}
