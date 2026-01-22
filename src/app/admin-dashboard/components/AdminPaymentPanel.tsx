'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Icon from '@/components/ui/AppIcon';
import PaymentVerificationCard from './PaymentVerificationCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AdminPaymentPanel: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // --- NEW UI STATES ---
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchAllTransactions = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.email !== 'admin@as-accounting.com') {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTransactions(data);
      const total = data
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      setTotalRevenue(total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllTransactions();
    const channel = supabase
      .channel('admin-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => fetchAllTransactions()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    // Add a safety check for rejections
    if (newStatus === 'failed') {
      const confirmed = window.confirm("Are you sure you want to REJECT this payment?");
      if (!confirmed) return;
    }
    const { error } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      
      // TRIGGER TOAST
      setToast({ 
        message: `Transaction ${newStatus === 'completed' ? 'Verified' : 'Rejected'}`, 
        type: 'success' 
      });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ message: "Action failed", type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Date,Transaction ID,Method,Amount,Status,Email\n"];
    const rows = filteredTransactions.map(t => {
      return `${new Date(t.created_at).toLocaleDateString()},${t.transaction_id},${t.payment_method},${t.amount},${t.status},${t.client_email || ''}\n`;
    });
    const blob = new Blob(["\ufeff" + headers + rows.join("")], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8 bg-background min-h-screen relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Payment Approvals</h1>
            <p className="text-muted-foreground text-sm">Verify mobile money transfers and receipts</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-smooth"
            >
              <Icon name="ArrowDownTrayIcon" size={18} />
              Export CSV
            </button>
            <button onClick={fetchAllTransactions} className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              <Icon name="ArrowPathIcon" size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* --- STATS SUMMARY --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-primary">{totalRevenue.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Pending Reviews</p>
            <p className="text-2xl font-black text-amber-500">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Success Rate</p>
            <p className="text-2xl font-black">
              {transactions.length > 0 ? Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon name="MagnifyingGlassIcon" size={18} />
            </span>
            <input 
              type="text"
              placeholder="Search Transaction ID..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* --- CARDS GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-muted rounded-lg" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTransactions.map((txn) => (
                <PaymentVerificationCard 
                  key={txn.id}
                  payment={{
                    id: txn.id,
                    clientName: txn.client_email || 'Anonymous User',
                    clientImage: '/images/avatars/default.png',
                    clientImageAlt: 'Client Avatar',
                    serviceType: 'Service Payment',
                    amount: `${txn.amount?.toLocaleString()} FCFA`,
                    paymentMethod: txn.payment_method,
                    transactionId: txn.transaction_id || 'N/A',
                    receiptImage: txn.receipt_url,
                    receiptImageAlt: 'Payment Receipt',
                    submittedDate: new Date(txn.created_at).toLocaleDateString(),
                    status: txn.status === 'completed' ? 'verified' : txn.status === 'failed' ? 'rejected' : 'pending'
                  } as any}
                  onVerify={() => updateStatus(txn.id, 'completed')}
                  onReject={() => updateStatus(txn.id, 'failed')}
                  onViewReceipt={(url) => setPreviewImage(url)} 
                />
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center text-muted-foreground italic bg-card border border-dashed rounded-xl mt-4">
                No transactions match your current filters.
              </div>
            )}
          </>
        )}
      </div>

      {/* --- FLOATING UI ELEMENTS --- */}

      {/* 1. RECEIPT PREVIEW MODAL */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-card rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
            <img 
              src={previewImage} 
              alt="Receipt" 
              className="w-full h-auto max-h-[80vh] object-contain bg-muted"
            />
            <div className="p-4 flex justify-between items-center bg-card border-t border-border">
              <p className="text-sm font-medium">Payment Receipt Proof</p>
              <a href={previewImage} download className="text-primary text-sm font-bold flex items-center gap-2">
                <Icon name="ArrowDownTrayIcon" size={16} /> Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-lg text-white z-50 animate-in slide-in-from-right-full duration-300 flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <Icon name={toast.type === 'success' ? 'CheckCircleIcon' : 'ExclamationCircleIcon'} size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentPanel;