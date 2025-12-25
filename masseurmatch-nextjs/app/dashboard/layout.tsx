import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | MasseurMatch',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-brand">
          <Link href="/">MasseurMatch</Link>
        </div>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/search">Search</Link>
          <Link href="/about">About</Link>
          <Link href="/dashboard">Dashboard</Link>
          <form action="/api/auth/signout" method="post">
            <button type="submit">Logout</button>
          </form>
        </div>

        <div className="nav-user">
          <span>{session.user.email}</span>
        </div>
      </nav>

      {/* Dashboard Container */}
      <div className="dashboard-main">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <Link href="/dashboard/ads" className="nav-item">
              My Ads
            </Link>
            <Link href="/dashboard/billing" className="nav-item">
              Billing
            </Link>
            <Link href="/dashboard/settings" className="nav-item">
              Settings
            </Link>
            <Link href="/dashboard/favorites" className="nav-item">
              Favorites
            </Link>
            <Link href="/dashboard/support" className="nav-item">
              Support
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}





