import AdminShell from '@/components/admin/AdminShell';
import { requireAdminPage } from '@/lib/auth';

// Oturum her istekte sunucuda doğrulanır; geçersizse /admin/login'e yönlendirilir.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <AdminShell>{children}</AdminShell>;
}
