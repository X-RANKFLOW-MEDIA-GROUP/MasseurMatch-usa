import AdminDashboard from "@/components/admin/AdminDashboard";
import { ensureAdminAccess } from "./utils";

export default async function AdminPage() {
  await ensureAdminAccess();

  return <AdminDashboard />;
}
