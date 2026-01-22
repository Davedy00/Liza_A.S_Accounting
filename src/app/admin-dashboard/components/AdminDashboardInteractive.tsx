'use client';



import React, { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase';

import { useRouter } from 'next/navigation';

import Icon from '@/components/ui/AppIcon';

import ServiceRequestCard from './ServiceRequestCard';

import StatsCard from './StatsCard';

import ClientListItem from './ClientListItem';



interface ServiceRequest {

  id: string;

  clientName: string;

  clientImage: string;

  clientImageAlt: string;

  serviceType: 'Tax Preparation' | 'TIN Creation';

  status: 'pending' | 'in-progress' | 'review' | 'completed';

  priority: 'high' | 'medium' | 'low';

  submittedDate: string;

  dueDate: string;

  documentsCount: number;

  paymentStatus: 'pending' | 'verified' | 'failed';

  amount: string;

}



interface Activity {

  id: string;

  type: 'service_request' | 'payment_verified' | 'document_uploaded' | 'status_updated' | 'message_sent';

  clientName: string;

  clientImage: string;

  clientImageAlt: string;

  description: string;

  timestamp: string;

  serviceId?: string;

}



interface Client {

  id: string;

  name: string;

  email: string;

  phone: string;

  image: string;

  imageAlt: string;

  activeServices: number;

  totalSpent: string;

  lastActivity: string;

  status: 'active' | 'inactive';
}

interface PaymentVerification {
  id: string;
  clientName: string;
  clientImage: string;
  clientImageAlt: string;
  serviceType: string;
  amount: string;
  paymentMethod: 'Orange Money' | 'MTN Mobile Money' | 'Express Union';
  transactionId: string;
  receiptImage: string;
  receiptImageAlt: string;
  submittedDate: string;
  status: 'pending' | 'verified' | 'rejected';

}

const AdminDashboardInteractive = () => {
 const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'clients' | 'payments'>('overview');
  
  const [clients, setClients] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & UI States
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // Keyboard shortcut to close the zoom modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedReceiptUrl(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

 const initializeDashboard = async () => {
  setLoading(true);
  try {
    // 1. Fetch Profiles (Exclude admins)
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin');

    // 2. Fetch Service Requests with Profile Join
    const { data: requestsData } = await supabase
      .from('service_requests')
      .select('*, profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false });

    // 3. Fetch Payments with Profile Join
    const { data: paymentsData } = await supabase
      .from('payments')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });

    // 4. Update Clients State
    if (profilesData) {
      setClients(profilesData.map(p => ({
        id: p.id,
        name: p.full_name || p.name || p.email.split('@')[0],
        email: p.email,
        phone: p.phone || 'No phone',
        image: p.avatar_url || 'https://via.placeholder.com/150',
        status: 'active'
      })));
    }

    if (requestsData) setServiceRequests(requestsData);
    if (paymentsData) setPayments(paymentsData);

  } catch (error) {
    console.error("Dashboard Loading Error:", error);
  } finally {
    setLoading(false);
    setIsHydrated(true);
  }
};


  useEffect(() => { initializeDashboard(); }, [router]);



  // FIXED: Added missing handleUpdateStatus function

  const handleUpdateStatus = async (id: string, newStatus: string) => {

    try {

      const { error } = await supabase

        .from('service_requests')

        .update({ status: newStatus })

        .eq('id', id);



      if (error) throw error;



      // Optimistic Update

      setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));

    } catch (err: any) {

      alert("Failed to update status: " + err.message);

    }

  };

  const getReceiptUrl = (path: string) => {
    if (!path) return '';
    
    // 1. Remove the bucket name from the path if it's already there
    // This prevents the "receipts/receipts/..." error
    const cleanPath = path.replace(/^receipts\//, '');
  
    // 2. Fetch the URL from the 'receipts' bucket
    const { data } = supabase.storage
      .from('receipts') 
      .getPublicUrl(cleanPath);
      
    return data.publicUrl;
  };

// Add this helper inside your component
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  // Optional: Add a "Copied!" toast here
};

  // 2. Updated Verification Logic

  const handleVerifyPayment = async (paymentId: string, requestId: string, isApproved: boolean, reason?: string) => {

    const finalStatus = isApproved ? 'verified' : 'rejected';

    const requestStatus = isApproved ? 'in-progress' : 'pending';

  

    try {

      await supabase.from('payments').update({ 

        status: finalStatus,

        rejection_reason: reason || null 

      }).eq('id', paymentId);

  

      await supabase.from('service_requests').update({ status: requestStatus }).eq('id', requestId);

  

      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: finalStatus, rejection_reason: reason } : p));

      setServiceRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: requestStatus } : r));

      

      alert(`Payment ${isApproved ? 'Verified' : 'Rejected'}!`);

    } catch (err: any) {

      alert("Operation failed: " + err.message);

    }

  };



  // 3. Stats Calculations

  const totalRevenue = payments

    .filter(p => p.status === 'verified')

    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);



  const pendingPaymentsCount = payments.filter(p => p.status === 'processing').length;



  if (loading || !isHydrated) {

    return <div className="min-h-screen flex items-center justify-center font-heading text-xl">Loading...</div>;

  }



  return (

    <div className="min-h-screen bg-background pt-20 pb-8 px-4">

      <div className="max-w-7xl mx-auto">
        {/* Header & Stats Cards */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Managing {clients.length} clients.</p>
        </div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <StatsCard 
    title="Total Revenue" 
    value={`${totalRevenue.toLocaleString()} FCFA`} 
    icon="BanknotesIcon" 
    iconColor="bg-success"
    change=""           // Fixed: Added empty string to satisfy TypeScript
    changeType="neutral" // Fixed: Added default type to satisfy TypeScript
  />
  
  <div 
    onClick={() => setActiveTab('payments')} 
    className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
  >
    <StatsCard 
      title="Action Required" 
      value={pendingPaymentsCount.toString()} 
      icon="ExclamationCircleIcon" 
      iconColor={pendingPaymentsCount > 0 ? "bg-destructive animate-pulse" : "bg-muted"}
      change=""           // Fixed: Added empty string to satisfy TypeScript
      changeType="neutral" // Fixed: Added default type to satisfy TypeScript
    />
  </div>
</div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border mb-6">
          {['overview', 'requests', 'clients', 'payments'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 capitalize ${activeTab === tab ? 'border-b-2 border-primary text-primary' : ''}`}>
              {tab} {tab === 'payments' && pendingPaymentsCount > 0 && <span className="ml-2 bg-destructive text-white px-2 rounded-full text-xs">{pendingPaymentsCount}</span>}
            </button>
          ))}
        </div>

 {/* --- 1. OVERVIEW TAB --- */}
{activeTab === 'overview' && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <h3 className="text-lg font-bold mb-4">Dashboard Summary</h3>
      <p className="text-muted-foreground text-sm">Welcome! Use the tabs to manage your workflow.</p>
    </div>
  </div>
)}

{/* --- 2. REQUESTS TAB (Status Dropdown Goes Here) --- */}
{activeTab === 'requests' && (
  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
    <table className="w-full text-left">
      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
        <tr>
          <th className="px-6 py-4">Client</th>
          <th className="px-6 py-4">Service</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Last Update</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {serviceRequests.map((request) => (
          <tr key={request.id} className="text-sm hover:bg-muted/5 transition-colors">
            <td className="px-6 py-4 font-medium">
  {/* Priority: Profile Join -> Manual Client List -> Static client_name column */}
  {request.profiles?.full_name || 
   clients.find(c => c.id === request.client_id)?.name || 
   request.client_name || 'Client'}
</td>
            <td className="px-6 py-4">{request.service_type}</td>
            <td className="px-6 py-4">
              {/* THIS IS THE DROPDOWN YOU ASKED ABOUT */}
              <select 
                value={request.status}
                onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                className={`
                  text-xs font-bold py-1.5 px-3 rounded-lg border border-border cursor-pointer
                  focus:ring-2 focus:ring-primary outline-none transition-all
                  ${request.status === 'completed' ? 'bg-success/10 text-success' : 
                    request.status === 'pending' ? 'bg-warning/10 text-warning' : 
                    request.status === 'requires-action' ? 'bg-destructive/10 text-destructive' :
                    'bg-primary/10 text-primary'}
                `}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="requires-action">Requires Action</option>
              </select>
            </td>
            <td className="px-6 py-4 text-right text-muted-foreground">
              {new Date(request.updated_at || request.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{/* --- 3. PAYMENTS TAB --- */}
{activeTab === 'payments' && (
  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
    {payments.length === 0 ? (
      /* --- Empty State --- */
      <div className="p-20 text-center">
        <Icon name="CheckBadgeIcon" size={48} className="mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground italic">All payments are up to date!</p>
      </div>
    ) : (
      /* --- Payments Table --- */
      <table className="w-full text-left">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
          <tr>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Proof</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map((payment) => (
            <tr key={payment.id} className="text-sm hover:bg-muted/5 transition-colors">
              <td className="px-6 py-4 font-medium">{payment.profiles?.full_name}</td>
              <td className="px-6 py-4 font-bold text-primary">
                {Number(payment.amount).toLocaleString()} FCFA
              </td>
              <td className="px-6 py-4">
                {payment.receipt_url ? (
                  <div 
                    className="group relative w-12 h-12 cursor-pointer"
                    onClick={() => setSelectedReceiptUrl(payment.receipt_url)}
                  >
                    <img 
  src={getReceiptUrl(payment.receipt_url)} 
  alt="Proof" 
  className="w-full h-full object-cover rounded-lg border border-border group-hover:opacity-80 transition-opacity"
/>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="MagnifyingGlassPlusIcon" size={16} className="text-white drop-shadow-md" />
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs italic">No receipt</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex flex-col items-end gap-2">
                  {payment.status === 'processing' ? (
                    <>
                      <span 
                        onClick={() => copyToClipboard(payment.transaction_id)}
                        className="text-[10px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded cursor-copy hover:bg-primary/10 hover:text-primary transition-colors"
                        title="Click to copy ID"
                      >
                        {payment.transaction_id || 'No ID'}
                      </span>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleVerifyPayment(payment.id, payment.request_id, true)} 
                          className="p-2 bg-success/20 text-success hover:bg-success hover:text-white rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Icon name="CheckIcon" size={16}/>
                        </button>
                        <button 
                          onClick={() => setRejectionModalId(payment.id)} 
                          className="p-2 bg-destructive/20 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors"
                          title="Reject"
                        >
                          <Icon name="XMarkIcon" size={16}/>
                        </button>
                      </div>
                    </>
                  ) : (
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      payment.status === 'verified' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {payment.status}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

{/* --- 4. CLIENTS TAB --- */}
{activeTab === 'clients' && (
  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
    <div className="p-4 border-b border-border bg-muted/30">
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <Icon name="MagnifyingGlassIcon" size={18} />
        </span>
        <input 
          type="text" 
          placeholder="Search clients by name or email..." 
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
    <div className="divide-y divide-border">
      {clients
        .filter(c => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((client) => (
          <ClientListItem key={client.id} client={client} />
        ))
      }
      {clients.length === 0 && (
        <div className="p-10 text-center text-muted-foreground italic">
          No clients registered yet.
        </div>
      )}
    </div>
  </div>
)}

        {/* REJECTION MODAL (Fixed placement and scope) */}
        {rejectionModalId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-2">Reject Payment</h3>
              <p className="text-muted-foreground text-sm mb-4">Explain why this payment proof was rejected.</p>
              
              <textarea
                className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                rows={4}
                placeholder="e.g., Transaction ID not found or screenshot blurry."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => { setRejectionModalId(null); setRejectionReason(''); }}
                  className="px-4 py-2 text-sm text-muted-foreground"
                >Cancel</button>
                <button 
                  disabled={!rejectionReason.trim()}
                  onClick={() => {
                    const payment = payments.find(p => p.id === rejectionModalId);
                    if (payment) handleVerifyPayment(payment.id, payment.request_id, false, rejectionReason);
                    setRejectionModalId(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 bg-destructive text-white rounded-lg font-bold disabled:opacity-50"
                >Confirm Rejection</button>
              </div>
            </div>
          </div>
        )}
{/* --- RECEIPT ZOOM MODAL --- */}
{selectedReceiptUrl && (
  <div 
    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    onClick={() => setSelectedReceiptUrl(null)} // Close on background click
  >
    <div className="relative max-w-4xl w-full flex flex-col items-center">
      <button 
        className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold"
        onClick={() => setSelectedReceiptUrl(null)}
      >
        <Icon name="XMarkIcon" size={24} /> Close
      </button>

      {/* Change the src of the main image */}
      <img 
  src={getReceiptUrl(selectedReceiptUrl)} 
  alt="Receipt Full View" 
  className="max-h-[80vh] w-auto rounded-lg shadow-2xl border border-white/10"
  onClick={(e) => e.stopPropagation()} 
/>

{/* The download link */}
<a 
  href={getReceiptUrl(selectedReceiptUrl)} 
  target="_blank" 
  rel="noopener noreferrer"
  className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all flex items-center gap-2 font-semibold"
  onClick={(e) => e.stopPropagation()}
>
  <Icon name="ArrowDownTrayIcon" size={18} />
  Open Original File
</a>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default AdminDashboardInteractive;