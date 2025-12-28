export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone layout - no navbar, no footer, just pure content
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
