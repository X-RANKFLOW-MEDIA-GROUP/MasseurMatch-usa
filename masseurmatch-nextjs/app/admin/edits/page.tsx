import AdminDashboard from '@/components/admin/AdminDashboard';
import { ensureAdminAccess } from '../utils';

export default async function AdminEditsPage() {
  await ensureAdminAccess();

  return <AdminDashboard />;
}
