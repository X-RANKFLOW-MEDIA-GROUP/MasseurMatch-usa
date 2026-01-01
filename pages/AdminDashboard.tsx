"use client";

import type { ReactNode } from "react";
import { useAdminEdits } from "@/src/hooks/useProfileEdits";

export default function AdminDashboard() {
  const { allEdits, loading } = useAdminEdits();
  let content: ReactNode;

  if (loading) {
    content = (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading edits...
      </div>
    );
  } else if (allEdits.length === 0) {
    content = (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        No pending edits to review yet.
      </div>
    );
  } else {
    content = (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Therapist</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {allEdits.map((edit) => (
              <tr key={edit.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-700">
                  {edit.therapist_id}
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">
                  {edit.status}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(edit.submitted_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">
          Manage therapist profile edits waiting for review.
        </p>
      </header>
      {content}
    </main>
  );
}
