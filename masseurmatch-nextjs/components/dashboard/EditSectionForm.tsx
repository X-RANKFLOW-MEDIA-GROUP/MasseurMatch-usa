import { SectionField } from "@/lib/dashboard/section-config";
import { saveAdSection } from "@/app/dashboard/ads/[adId]/edit/actions";

type Props = {
  adId: string;
  sectionKey: string;
  sectionLabel: string;
  description?: string;
  sectionData: Record<string, any>;
  fields: SectionField[];
};

export default function EditSectionForm({
  adId,
  sectionKey,
  sectionLabel,
  description,
  sectionData,
  fields,
}: Props) {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Section</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">{sectionLabel}</h2>
        {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
      </div>

      <form
        className="space-y-5"
        action={async (formData) => {
          "use server";

          const payload: Record<string, string> = {};
          formData.forEach((value, key) => {
            payload[key] = value.toString();
          });

          await saveAdSection(adId, sectionKey, payload);
        }}
      >
        <div className="space-y-4">
          {fields.map((field) => {
            const defaultValue =
              sectionData[field.name] ?? (field.type === "textarea" ? "" : "");

            return (
              <label key={field.name} className="block space-y-2 text-sm font-medium text-slate-700">
                <span className="text-base font-semibold text-slate-900">{field.label}</span>
                {field.helper && <span className="text-xs text-slate-500">{field.helper}</span>}
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    defaultValue={defaultValue}
                    placeholder={field.placeholder}
                    rows={field.rows ?? 4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    name={field.name}
                    defaultValue={defaultValue}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  />
                )}
              </label>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save {sectionLabel}
          </button>
          <p className="text-xs text-slate-500">
            Changes are saved immediately once you submit this form.
          </p>
        </div>
      </form>
    </div>
  );
}
