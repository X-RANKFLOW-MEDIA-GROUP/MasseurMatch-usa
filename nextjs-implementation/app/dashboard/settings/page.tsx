import { createServerSupabaseClient } from '@/lib/supabase';

export const metadata = {
  title: 'Settings | Dashboard',
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-sections">
        {/* Account Settings */}
        <section className="settings-section">
          <h2>Account Settings</h2>

          <div className="setting-item">
            <label>Email</label>
            <input
              type="email"
              defaultValue={session.user.email}
              disabled
              className="input-disabled"
            />
            <p className="setting-help">Contact support to change your email</p>
          </div>

          <div className="setting-item">
            <label>Password</label>
            <button className="btn-secondary">Change Password</button>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="settings-section">
          <h2>Notification Preferences</h2>

          <div className="setting-item checkbox">
            <input type="checkbox" id="email-notifications" defaultChecked />
            <label htmlFor="email-notifications">
              Email notifications for new messages
            </label>
          </div>

          <div className="setting-item checkbox">
            <input type="checkbox" id="marketing-emails" />
            <label htmlFor="marketing-emails">
              Marketing and promotional emails
            </label>
          </div>

          <div className="setting-item checkbox">
            <input type="checkbox" id="weekly-summary" defaultChecked />
            <label htmlFor="weekly-summary">
              Weekly activity summary
            </label>
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="settings-section">
          <h2>Privacy</h2>

          <div className="setting-item checkbox">
            <input type="checkbox" id="show-online-status" defaultChecked />
            <label htmlFor="show-online-status">
              Show online status
            </label>
          </div>

          <div className="setting-item checkbox">
            <input type="checkbox" id="public-profile" defaultChecked />
            <label htmlFor="public-profile">
              Make profile visible in search results
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="settings-section danger-zone">
          <h2>Danger Zone</h2>

          <div className="setting-item">
            <button className="btn-danger">Deactivate Account</button>
            <p className="setting-help">
              Temporarily hide your profile from search results
            </p>
          </div>

          <div className="setting-item">
            <button className="btn-danger">Delete Account</button>
            <p className="setting-help">
              Permanently delete your account and all data. This cannot be undone.
            </p>
          </div>
        </section>

        <div className="settings-actions">
          <button className="btn-primary">Save Changes</button>
          <button className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}
