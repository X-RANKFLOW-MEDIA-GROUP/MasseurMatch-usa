import AdminEditsPanel from '@/pages/AdminDashboard';
import { ensureAdminAccess } from '../utils';

export default async function AdminEditsPage() {
  await ensureAdminAccess();

  return <AdminEditsPanel />;
}
