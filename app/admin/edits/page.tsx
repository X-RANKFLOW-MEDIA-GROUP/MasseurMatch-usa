// app/admin/edits/page.tsx
"use client";

export default function AdminEditsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold">Profile Edits</h1>
      <p className="text-sm text-muted-foreground">
        Review and approve pending therapist profile edits here. The review
        queue will appear once it is configured.
      </p>
    </main>
  );
}
