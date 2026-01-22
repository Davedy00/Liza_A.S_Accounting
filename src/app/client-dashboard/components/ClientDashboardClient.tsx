'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import DashboardInteractive from './DashboardInteractive';
import ProfileSection from './ProfileSection';
import Modal from '@/components/ui/Modal';
import NewRequestForm from './NewRequestForm';
import RequestDetailsView from './RequestDetailsView';
import UserBillingOverview from './UserBillingOverview';

export default function ClientDashboardClient() {
  const { userProfile, loading: authLoading } = useAuth();
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const searchParams = useSearchParams();
  const activeRequestId = searchParams.get('request');
  const router = useRouter();

  const selectedRequest = serviceRequests.find(r => r.id === activeRequestId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Calculation for Payment Stats
  const paymentStats = {
    totalPaid: serviceRequests
      .filter(req => req.status === 'completed')
      .reduce((sum, req) => sum + (Number(req.amount) || 0), 0)
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    pendingPayments: serviceRequests
      .filter(req => req.status === 'requires-action')
      .length.toString(),
    lastPaymentDate: serviceRequests
      .filter(req => req.status === 'completed')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]?.updated_at 
      ? new Date(serviceRequests.filter(req => req.status === 'completed')[0].updated_at).toLocaleDateString()
      : '-',
    lastPaymentAmount: 'Variable',
    paymentMethod: 'Bank Transfer'
  };

  const fetchRequests = useCallback(async () => {
    if (!userProfile?.id) {
      setDataLoading(false);
      return;
    }
    try {
      const [requestsResponse, activitiesResponse] = await Promise.all([
        supabase.from('service_requests').select('*').eq('client_id', userProfile.id).order('created_at', { ascending: false }),
        supabase.from('user_activities').select('*').eq('user_id', userProfile.id).order('created_at', { ascending: false }).limit(5)
      ]);

      if (requestsResponse.data) setServiceRequests(requestsResponse.data);
      if (activitiesResponse.data) {
        setRecentActivities(activitiesResponse.data.map(act => ({
          id: act.id,
          type: act.type,
          title: act.title,
          description: act.description,
          timestamp: act.created_at,
        })));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setDataLoading(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    if (!authLoading && !userProfile) router.push('/login');
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    if (!authLoading) fetchRequests();
  }, [authLoading, fetchRequests]);

  const profileData = {
    name: userProfile?.name || 'User',
    email: userProfile?.email || '',
    phone: userProfile?.phone || 'Not provided',
    businessName: userProfile?.business_name || 'No Business Name',
    tinNumber: userProfile?.tin_number || 'N/A',
    verificationStatus: (userProfile?.verification_status || 'unverified') as any,
    avatar: userProfile?.avatar_url || '/default-avatar.png',
    avatarAlt: userProfile?.name || 'Profile Picture',
    memberSince: userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Recently'
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start New Tax Request">
          <NewRequestForm onSuccess={() => { setIsModalOpen(false); fetchRequests(); }} />
        </Modal>

        {selectedRequest ? (
          <RequestDetailsView request={selectedRequest} onBack={() => router.push('/client-dashboard')} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DashboardInteractive
                serviceRequests={serviceRequests}
                onRefresh={fetchRequests}
                onOpenNewRequest={() => setIsModalOpen(true)}
                quickActions={[]}
                recentActivities={recentActivities}
                paymentStatus={paymentStats}
                documents={[]}
                notifications={[]}
              />
            </div>
            <div className="lg:col-span-1">
              <ProfileSection profile={profileData} />
              <UserBillingOverview />
            </div>
          </div>
        )}
      </main>
    </>
  );
}