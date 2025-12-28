export const metadata = {
  title: 'Support | Dashboard',
  robots: { index: false, follow: false },
};

export default function SupportPage() {
  return (
    <div className="support-page">
      <h1>Support & Help</h1>

      <div className="support-content">
        {/* Quick Actions */}
        <section className="support-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <a href="mailto:support@masseurmatch.com" className="action-card">
              <span className="action-icon">📧</span>
              <h3>Email Support</h3>
              <p>Get help via email</p>
            </a>

            <a href="/help" className="action-card">
              <span className="action-icon">📖</span>
              <h3>Help Center</h3>
              <p>Browse our guides</p>
            </a>

            <a href="/faq" className="action-card">
              <span className="action-icon">❓</span>
              <h3>FAQ</h3>
              <p>Frequently asked questions</p>
            </a>

            <a href="/contact" className="action-card">
              <span className="action-icon">💬</span>
              <h3>Live Chat</h3>
              <p>Chat with support</p>
            </a>
          </div>
        </section>

        {/* Common Issues */}
        <section className="support-section">
          <h2>Common Issues</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>How do I update my profile?</summary>
              <p>
                Go to Dashboard → My Ads → Click on your ad → Edit. You can update different
                sections of your profile including basic info, services, rates, and photos.
              </p>
            </details>

            <details className="faq-item">
              <summary>How do I upgrade my plan?</summary>
              <p>
                Visit Dashboard → Billing to view available plans and upgrade your subscription.
                Premium and Professional plans offer additional features and better visibility.
              </p>
            </details>

            <details className="faq-item">
              <summary>Why isn't my profile showing in search?</summary>
              <p>
                Make sure your profile status is "active" and you've completed all required fields.
                New profiles may take 24-48 hours to appear in search results after approval.
              </p>
            </details>

            <details className="faq-item">
              <summary>How do I delete my account?</summary>
              <p>
                Go to Dashboard → Settings → Scroll to "Danger Zone" → Click "Delete Account".
                Note: This action is permanent and cannot be undone.
              </p>
            </details>

            <details className="faq-item">
              <summary>How do I change my profile URL/slug?</summary>
              <p>
                Your profile slug is automatically generated from your name and city. To change it,
                update your display name or city in the "Basic Settings" or "Location" section.
              </p>
            </details>
          </div>
        </section>

        {/* Contact Form */}
        <section className="support-section">
          <h2>Contact Support</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" required>
                <option value="">Select a category</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="profile">Profile Help</option>
                <option value="account">Account Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={6}
                placeholder="Please describe your issue in detail..."
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </section>

        {/* Resources */}
        <section className="support-section">
          <h2>Helpful Resources</h2>
          <ul className="resource-list">
            <li>
              <a href="/help/getting-started">Getting Started Guide</a>
            </li>
            <li>
              <a href="/help/profile-optimization">Profile Optimization Tips</a>
            </li>
            <li>
              <a href="/help/seo">SEO Best Practices</a>
            </li>
            <li>
              <a href="/help/safety">Safety Guidelines</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
