import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentStatus {
  totalPaid: string;
  pendingPayments: string;
  lastPaymentDate: string;
  lastPaymentAmount: string;
  paymentMethod: string;
  receiptUrl?: string; 
}

interface PaymentStatusCardProps {
  paymentStatus: PaymentStatus;
  onRefresh?: () => void; 
  isLoading?: boolean;    
  onDownload?: () => void; // NEW: Prop for downloading PDF
}

const PaymentStatusCard = ({ paymentStatus, onRefresh, isLoading, onDownload }: PaymentStatusCardProps) => {
  const {
    totalPaid = "0 FCFA",
    pendingPayments = "0",
    lastPaymentDate = "N/A",
    lastPaymentAmount = "0 FCFA",
    paymentMethod = "N/A",
    receiptUrl
  } = paymentStatus || {};

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-heading font-semibold text-lg text-foreground">Payment Status</h2>
          
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground disabled:opacity-50"
            title="Refresh Status"
          >
            <Icon 
              name="ArrowPathIcon" 
              size={16} 
              className={isLoading ? "animate-spin" : ""} 
            />
          </button>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
          <Icon name="CreditCardIcon" size={20} variant="solid" className="text-success" />
        </div>
      </div>

      <div className="space-y-4">
        {/* TOTAL PAID SECTION */}
        <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
            <p className="font-heading font-bold text-2xl text-success">{totalPaid}</p>
          </div>
          <Icon name="CheckCircleIcon" size={32} variant="solid" className="text-success" />
        </div>

        {/* PENDING SECTION */}
        <div className="flex items-center justify-between p-4 bg-warning/5 rounded-lg border border-warning/20">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
            <p className="font-heading font-bold text-2xl text-warning">{pendingPayments}</p>
          </div>
          <Icon name="ClockIcon" size={32} variant="solid" className="text-warning" />
        </div>

        {/* DETAILS SECTION */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Payment:</span>
            <span className="font-medium text-foreground">{lastPaymentDate}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold text-primary">{lastPaymentAmount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Method:</span>
            <span className="font-medium text-foreground">{paymentMethod}</span>
          </div>

          <div className="pt-2 space-y-2">
            {/* VIEW PROOF BUTTON */}
            {receiptUrl && (
              <button 
                onClick={() => window.open(receiptUrl, '_blank')}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-lg text-xs font-semibold transition-colors"
              >
                <Icon name="EyeIcon" size={14} />
                View Uploaded Proof
              </button>
            )}

            {/* NEW: DOWNLOAD INVOICE BUTTON */}
            {totalPaid !== "0 FCFA" && (
              <button 
                onClick={onDownload}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                <Icon name="ArrowDownTrayIcon" size={14} />
                Download Official Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusCard;