export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
      <ol
        className="flex flex-wrap gap-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((it, idx) => (
          <li
            key={it.href}
            className="flex items-center gap-2"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <a
              className="text-violet-600 underline dark:text-violet-400"
              href={it.href}
              itemProp="item"
            >
              <span itemProp="name">{it.label}</span>
            </a>
            <meta itemProp="position" content={String(idx + 1)} />
            {idx < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
