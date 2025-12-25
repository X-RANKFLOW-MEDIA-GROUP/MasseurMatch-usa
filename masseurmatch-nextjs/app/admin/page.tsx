import AdminDashboard from "@/pages/AdminDashboard";
import { ensureAdminAccess } from "./utils";

export default async function AdminPage() {
  await ensureAdminAccess();

  return <AdminDashboard />;
}
