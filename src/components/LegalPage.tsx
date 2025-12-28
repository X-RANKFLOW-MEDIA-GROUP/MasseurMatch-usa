"use client";

export function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect border-slate-800 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gradient mb-6">Legal Information</h1>

          <div className="space-y-8 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Terms of Service</h2>
              <p className="mb-4">
                Legal documentation coming soon. Please check back later for our complete terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Privacy Policy</h2>
              <p className="mb-4">
                Privacy policy documentation coming soon. We are committed to protecting your data and privacy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookie Policy</h2>
              <p className="mb-4">
                Cookie policy documentation coming soon.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
