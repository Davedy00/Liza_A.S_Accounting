'use client';

import React, { useState, useEffect } from 'react';
import ServiceRequestCard from './ServiceRequestCard';
import QuickActionButton from './QuickActionButton';
import ActivityFeedItem from './ActivityFeedItem';
import PaymentStatusCard from './PaymentStatusCard';
import DocumentLibraryCard from './DocumentLibraryCard';
import NotificationCenter from './NotificationCenter';
import ProfileSection from './ProfileSection';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/ui/Modal'; // Import your modal component
import EditProfileForm from './EditProfileForm'; // The form we discussed
import { supabase } from '@/lib/supabase';
import DocumentUpload from './DocumentUpload'; 
import Icon from '@/components/ui/AppIcon';
import PaymentReuploadForm from './PaymentReuploadForm';

interface ServiceRequest {
  id: string;
  serviceType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'requires-action';
  submittedDate: string;
  lastUpdated: string;
  progress: number;
  description: string;
  // ADD THESE THREE LINES:
  service_type?: string; 
  created_at?: string;
  amount?: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

interface Activity {
  id: string;
  type: 'message' | 'document' | 'payment' | 'status';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface PaymentStatus {
  totalPaid: string;
  pendingPayments: string;
  lastPaymentDate: string;
  lastPaymentAmount: string;
  paymentMethod: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'available' | 'processing';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  tinNumber: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  avatar: string;
  avatarAlt: string;
  memberSince: string;
}

interface DashboardInteractiveProps {
  serviceRequests: ServiceRequest[];
  quickActions: QuickAction[];
  recentActivities: Activity[];
  paymentStatus: PaymentStatus;
  documents: Document[];
  notifications: Notification[];
  onOpenNewRequest: () => void;
  onRefresh: () => Promise<void>;
}

const DashboardInteractive = ({
  serviceRequests,
  quickActions,
  recentActivities,
  paymentStatus,
  documents,
  notifications,
  onOpenNewRequest, 
  onRefresh, // Ensure this is here!
}: DashboardInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const { user, userProfile, loading, updateProfile } = useAuth();
  console.log("DB Profile:", userProfile);
console.log("Auth Metadata:", user?.user_metadata);
  if (loading) {
    return <div className="p-20 text-center">Loading Profile...</div>;
  }

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

// Find where you added the state earlier and make sure these exist:
const [isFixPaymentModalOpen, setIsFixPaymentModalOpen] = useState(false);
const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
const [selectedPaymentToFix, setSelectedPaymentToFix] = useState<any>(null);
const [showSuccessToast, setShowSuccessToast] = useState(false);

// Logic check:
// 1. Check database profile (full_name)
// 2. Fallback to Auth Metadata (name)
// 3. Fallback to Email

// This reconstructs the name even if it's stored as indexed characters
const rawMetadata = user?.user_metadata || {};
// This reconstructs the name from those numbered keys
const metadataName = Object.keys(rawMetadata)
  .filter(key => !isNaN(Number(key))) // Get only the numeric keys
  .sort((a, b) => Number(a) - Number(b)) // Put them in order
  .map(key => rawMetadata[key]) // Get the letters
  .join('');

  const displayName = userProfile?.full_name || metadataName || user?.email || 'Guest';

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  console.log("DEBUG - userProfile keys:", Object.keys(userProfile || {}));
  console.log("DEBUG - phone value:", userProfile?.phone);
  // This transforms your DB columns into the format ProfileSection expects
  const mappedProfile = {
    name: displayName,
    email: userProfile?.email || user?.email || '',
    // This line ensures that IF the DB is null, we show 'Not provided' 
    // instead of letting the app crash
    phone: userProfile?.phone || 'Not provided',
    businessName: userProfile?.business_name || 'No Business Name',
    tinNumber: userProfile?.tin_number || 'N/A',
    verificationStatus: (userProfile?.verification_status as 'verified' | 'pending' | 'unverified') || 'unverified',
    // Change this line in your mappedProfile object
    avatar: userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
    avatarAlt: displayName,
    memberSince: userProfile?.created_at 
      ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently',
  };

  // 1. Add this state at the top of your component
const [userDocuments, setUserDocuments] = useState<any[]>([]);
const [toastMessage, setToastMessage] = useState('');

// 2. Add this fetch function
const fetchDocuments = async () => {
  if (!user?.id) return;
  
  const { data, error } = await supabase
    .from('request_documents')
    .select('*')
    .eq('user_id', user.id) // Only get docs belonging to this user
    .order('created_at', { ascending: false });

  if (!error && data) {
    setUserDocuments(data);
  }
};
const [isSubmitting, setIsSubmitting] = useState(false);

const handleFixPayment = async (requestId: string, file: File) => {
  try {
    setIsSubmitting(true);

    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`; // Keep bucket name consistent

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Insert a NEW record in 'payments' so Admin sees the retry
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        client_id: user?.id,
        receipt_url: uploadData.path,
        status: 'processing',
        amount: 30500, // Or pull from the request data
        transaction_id: `RETRY-${requestId.slice(0,5)}` 
      });

    if (paymentError) throw paymentError;

    // 3. Update the Service Request status
    const { error: updateError } = await supabase
      .from('service_requests')
      .update({ 
        status: 'pending', 
        last_updated: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // 4. Success Actions
    await onRefresh(); 
    setIsFixPaymentModalOpen(false);
setToastMessage('Payment proof resubmitted!');
setShowSuccessToast(true);
  } catch (err: any) {
    console.error("Fix payment error:", err);
    alert(`Update failed: ${err.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

// 3. Trigger fetch on load and after upload
useEffect(() => {
  if (isHydrated) fetchDocuments();
}, [isHydrated, user?.id]);

useEffect(() => {
  if (!user?.id) return;

  // 1. Create the channel
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE', // Listen for updates (like admin changing status)
        schema: 'public',
        table: 'service_requests',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        console.log('Real-time update received!', payload);
        onRefresh(); // Refresh the whole dashboard UI
        fetchDocuments(); // Refresh local document list
      }
    )
    .subscribe();

  // 3. Cleanup on unmount
  return () => {
    supabase.removeChannel(channel);
  };
}, [user?.id]);

  useEffect(() => {
    // If the database has a name but the Auth metadata is still messy
    if (userProfile?.full_name && typeof user?.user_metadata?.full_name !== 'string') {
      updateProfile({ full_name: userProfile.full_name });
      console.log("Synced messy metadata with clean database name!");
    }
  }, [userProfile, user]);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-96 bg-muted rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-96 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
        <h1>Welcome back, {displayName}</h1>
          <p className="text-muted-foreground">
            Manage your tax services and track your requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <section>
              <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  // INTERCEPT THE "NEW TAX RETURN" BUTTON
                  if (action.title === 'New Tax Return') {
                    return (
                      <div 
                        key={index} 
                        onClick={onOpenNewRequest} 
                        className="cursor-pointer"
                      >
                        <QuickActionButton {...action} href="#" /> 
                      </div>
                    );
                  }
                  return <QuickActionButton key={index} {...action} />;
                })}
              </div>
            </section>

            {/* Active Service Requests */}
            <section>
              <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                Active Service Requests
              </h2>
              <div className="grid grid-cols-1 gap-4">
              {serviceRequests.map((request) => (
  <ServiceRequestCard 
    key={request.id} 
    request={{
      ...request,
      // Ensure these match the component's expectations
      service_type: request.service_type || request.serviceType || 'General Service',
      created_at: request.created_at || request.submittedDate || new Date().toISOString(),
      amount: request.amount || 0
    }} 
    onFixPayment={() => {
      setSelectedRequestId(request.id);
      setIsFixPaymentModalOpen(true);
    }}
  />
))}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <ActivityFeedItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Combined Profile Section and Edit Button */}
            <div className="space-y-2">
              <ProfileSection profile={mappedProfile} />
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-full py-2 text-xs font-medium border border-border rounded-md hover:bg-accent transition-all active:scale-95"
              >
                Edit Profile Information
              </button>
            </div>

            {/* Other Sidebar Cards */}
            <PaymentStatusCard paymentStatus={paymentStatus} />
            <div className="bg-card border border-border rounded-xl p-4">
  <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">
    Your Documents ({userDocuments.length})
  </h3>
  
  <div className="space-y-3">
    {userDocuments.length > 0 ? (
      userDocuments.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-primary/10 rounded text-primary">
               {/* Icon based on file type */}
               <Icon name="DocumentIcon" size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{doc.file_name}</p>
              <p className="text-[10px] text-muted-foreground">
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/request-documents/${doc.file_path}`)}
            className="p-1 hover:text-primary transition-colors"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
          </button>
        </div>
      ))
    ) : (
      <p className="text-xs text-center text-muted-foreground py-4">No documents uploaded yet.</p>
    )}
  </div>

  {/* Integrate your Uploader here */}
  <div className="mt-4 border-t border-border pt-4">
     <DocumentUpload onUploadSuccess={() => {
       setShowSuccessToast(true);
       fetchDocuments(); // Refresh the list automatically!
     }} />
  </div>
</div>
            <NotificationCenter notifications={notifications} />
          </div>
        </div>
        {/* 3. PLACE YOUR MODAL HERE (AT THE BOTTOM) */}
        <Modal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          title="Update Profile"
        >
          <EditProfileForm 
            profile={mappedProfile} 
            onCancel={() => setIsProfileModalOpen(false)}
            onSave={async (updates: any) => {
              const { error } = await updateProfile(updates);
              if (!error) {
                setIsProfileModalOpen(false);
setToastMessage('Profile updated successfully!');
                setShowSuccessToast(true);
                // Hide the message after 3 seconds
                setTimeout(() => setShowSuccessToast(false), 3000);
              } else {
                alert("Update failed: " + error.message);
              }
            }}
          />
        </Modal>
       {/* --- FIX PAYMENT MODAL --- */}
<Modal 
  isOpen={isFixPaymentModalOpen} 
  onClose={() => {
    setIsFixPaymentModalOpen(false);
    setSelectedRequestId(null);
  }} 
  title="Resubmit Payment Proof"
>
  {selectedRequestId && (
    <PaymentReuploadForm 
      requestId={selectedRequestId}
      onCancel={() => setIsFixPaymentModalOpen(false)}
      onSave={async (file) => {
        await handleFixPayment(selectedRequestId, file);
      }}
    />
  )}
</Modal>
        {showSuccessToast && (
          <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Profile updated successfully!</span>
<span className="font-medium">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInteractive;