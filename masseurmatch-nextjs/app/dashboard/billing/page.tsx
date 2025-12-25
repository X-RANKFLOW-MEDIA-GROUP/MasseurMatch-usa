import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Billing | Dashboard',
  robots: { index: false, follow: false },
};

export default async function BillingPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  // Get user's therapist profile for subscription info
  const { data: therapist } = await supabase
    .from('therapists')
    .select('plan, plan_name, price_monthly, subscription_status, paid_until, stripe_current_period_end')
    .eq('user_id', session.user.id)
    .single();

  return (
    <div className="billing-page">
      <h1>Billing & Subscription</h1>

      {therapist ? (
        <>
          <div className="current-plan">
            <h2>Current Plan</h2>
            <div className="plan-card">
              <div className="plan-header">
                <h3>{therapist.plan_name || therapist.plan || 'Free'}</h3>
                <span className={`status-badge status-${therapist.subscription_status}`}>
                  {therapist.subscription_status || 'inactive'}
                </span>
              </div>

              {therapist.price_monthly && (
                <p className="plan-price">${therapist.price_monthly}/month</p>
              )}

              {therapist.paid_until && (
                <p className="plan-expires">
                  {therapist.subscription_status === 'active' ? 'Renews' : 'Expires'} on:{' '}
                  {new Date(therapist.paid_until).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="available-plans">
            <h2>Available Plans</h2>
            <div className="plans-grid">
              <div className="plan-option">
                <h3>Free</h3>
                <p className="price">$0/month</p>
                <ul>
                  <li>Basic profile listing</li>
                  <li>Contact information</li>
                  <li>Featured placement</li>
                  <li>Photo gallery</li>
                </ul>
                <button className="btn-secondary">Current Plan</button>
              </div>

              <div className="plan-option featured">
                <h3>Premium</h3>
                <p className="price">$49.99/month</p>
                <ul>
                  <li>Everything in Free</li>
                  <li>Featured placement</li>
                  <li>Unlimited photos</li>
                  <li>Priority support</li>
                  <li>Advanced analytics</li>
                </ul>
                <button className="btn-primary">Upgrade to Premium</button>
              </div>

              <div className="plan-option">
                <h3>Professional</h3>
                <p className="price">$99.99/month</p>
                <ul>
                  <li>Everything in Premium</li>
                  <li>Top placement</li>
                  <li>Custom branding</li>
                  <li>Dedicated account manager</li>
                </ul>
                <button className="btn-primary">Upgrade to Professional</button>
              </div>
            </div>
          </div>

          <div className="billing-history">
            <h2>Billing History</h2>
            <p className="placeholder-text">No billing history available.</p>
            {/* TODO: Fetch from Stripe */}
          </div>
        </>
      ) : (
        <div className="no-profile">
          <p>Create a therapist profile to manage your subscription.</p>
          <Link href="/dashboard/ads/new" className="btn-primary">
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );
}
