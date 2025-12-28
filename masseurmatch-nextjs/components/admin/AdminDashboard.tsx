"use client";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-effect border-slate-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gradient mb-4">Admin Dashboard</h1>
          <p className="text-slate-400 mb-6">
            Admin dashboard functionality coming soon...
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">Pending Reviews</h3>
              <p className="text-3xl font-bold text-purple-400">0</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">Active Therapists</h3>
              <p className="text-3xl font-bold text-pink-400">0</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">Flagged Content</h3>
              <p className="text-3xl font-bold text-cyan-400">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
