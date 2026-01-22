'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Icon from '@/components/ui/AppIcon';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  payment_method: string;
  status: 'completed' | 'pending' | 'failed';
  transaction_id: string;
  receipt_url?: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setTransactions(data);
      }
      setLoading(false);
    };

    fetchTransactions();
    
    // Optional: Set up real-time listener
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => fetchTransactions()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const formatCurrency = (amount: number) => `${amount?.toLocaleString()} FCFA`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'failed': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="ClockIcon" size={24} variant="outline" className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Recent Activity</h3>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : transactions.map((txn) => (
          <div key={txn.id} className="p-4 rounded-lg border border-border hover:shadow-sm transition-all bg-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-mono font-bold text-primary mb-1">{txn.transaction_id}</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  {formatDate(txn.created_at)} • {txn.payment_method}
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${getStatusStyles(txn.status)}`}>
                 <Icon name={txn.status === 'completed' ? 'CheckCircleIcon' : 'ClockIcon'} size={12} variant="solid" />
                 {txn.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <p className="text-sm font-bold text-foreground">{formatCurrency(txn.amount)}</p>
              
              {txn.receipt_url && (
                <a 
                  href={txn.receipt_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                  title="View Receipt"
                >
                  <Icon name="DocumentTextIcon" size={18} />
                </a>
              )}
            </div>
          </div>
        ))}

        {!loading && transactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            No transactions found yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;