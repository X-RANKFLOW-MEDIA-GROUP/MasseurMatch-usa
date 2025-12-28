export default function ServicesList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border p-4 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
        {emptyText}
      </div>
    );
  }

  const unique = Array.from(new Set(items.map((x) => x.trim()).filter(Boolean))).slice(0, 40);

  return (
    <div className="flex flex-wrap gap-2">
      {unique.map((s) => (
        <span
          key={s}
          className="rounded-full border bg-violet-50 px-3 py-1 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
