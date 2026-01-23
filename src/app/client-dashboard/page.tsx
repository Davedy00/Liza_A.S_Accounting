import type { Metadata } from 'next';
import { Suspense } from 'react'; // 1. Import Suspense
import ClientDashboardClient from './components/ClientDashboardClient';

export const metadata: Metadata = {
  title: 'My Dashboard - A.S Accounting',
  description: 'Manage your tax requests and track payment status.',
};

export default function Page() {
  return (
    // 2. Wrap the component in Suspense
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>}>
      <ClientDashboardClient />
    </Suspense>
  );
}