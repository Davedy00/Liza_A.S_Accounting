import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import AdminDashboardInteractive from './components/AdminDashboardInteractive';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Management interface',
};

export default function Page() {
  return (
    <>
      <Header />
      <AdminDashboardInteractive />
    </>
  );
}