import type { Metadata } from 'next';
import ClientDashboardClient from './components/ClientDashboardClient';

export const metadata: Metadata = {
  title: 'My Dashboard - A.S Accounting',
  description: 'Manage your tax requests and track payment status.',
};

export default function Page() {
  return <ClientDashboardClient />;
}