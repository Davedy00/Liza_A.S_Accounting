'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Icon from '@/components/ui/AppIcon';
import PaymentStatusCard from './PaymentStatusCard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const UserBillingOverview = () => {
  const [rawTransactions, setRawTransactions] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Added for refresh state
  const [statusData, setStatusData] = useState({
    totalPaid: "0 FCFA",
    pendingPayments: "0",
    lastPaymentDate: "None",
    lastPaymentAmount: "0 FCFA",
    paymentMethod: "N/A",
    receiptUrl: "" // Added to support viewing receipt
  });

  const fetchBillingInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_email', user.email)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const previousLastStatus = rawTransactions[0]?.status;
      const currentLastStatus = data[0]?.status;

      if (previousLastStatus === 'pending' && currentLastStatus === 'completed') {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }

      setRawTransactions(data);
      
      const total = data
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      setStatusData({
        totalPaid: `${total.toLocaleString()} FCFA`,
        pendingPayments: data.filter(t => t.status === 'pending').length.toString(),
        lastPaymentDate: data[0] ? new Date(data[0].created_at).toLocaleDateString() : 'None',
        lastPaymentAmount: data[0] ? `${data[0].amount.toLocaleString()} FCFA` : '0 FCFA',
        paymentMethod: data[0] ? data[0].payment_method : 'N/A',
        receiptUrl: data[0]?.receipt_url || ""
      });
    }
  };

  useEffect(() => {
    fetchBillingInfo();
    const channel = supabase
      .channel('user-billing')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchBillingInfo())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // --- MANUAL REFRESH ---
  const handleManualRefresh = async () => {
    setIsFetching(true);
    await fetchBillingInfo();
    setIsFetching(false);
  };

  // --- PDF GENERATION ---
  const downloadInvoice = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("AS ACCOUNTING SERVICES", 14, 22);
    doc.setFontSize(10);
    doc.text("Official Payment Receipt", 14, 30);
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 14, 35);

    // Table
    autoTable(doc, {
      startY: 45,
      head: [['Description', 'Date', 'Method', 'Amount']],
      body: [
        ['Service Payment', statusData.lastPaymentDate, statusData.paymentMethod, statusData.lastPaymentAmount],
      ],
      headStyles: { fillColor: [22, 163, 74] } // Green-600 to match success theme
    });

    doc.text("Thank you for choosing AS Accounting.", 14, doc.internal.pageSize.height - 20);
    doc.save(`Receipt_${statusData.lastPaymentDate.replace(/\//g, '-')}.pdf`);
  };

  return (
    <div className="max-w-md relative">
       <PaymentStatusCard 
         paymentStatus={statusData} 
         onRefresh={handleManualRefresh}
         isLoading={isFetching}
         onDownload={downloadInvoice}
       />

       {/* Toast Notification */}
       {showToast && (
         <div className="fixed bottom-10 right-10 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-full duration-500 z-50">
           <div className="bg-white/20 p-2 rounded-full">
             <Icon name="CheckCircleIcon" size={24} variant="solid" className="text-white" />
           </div>
           <div>
             <p className="font-bold">Payment Verified!</p>
             <p className="text-sm opacity-90">Your account has been updated.</p>
           </div>
           <button onClick={() => setShowToast(false)} className="ml-4 opacity-70 hover:opacity-100">
             <Icon name="XMarkIcon" size={20} />
           </button>
         </div>
       )}
    </div>
  );
};

export default UserBillingOverview;