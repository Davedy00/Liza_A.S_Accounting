import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

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

interface PaymentVerificationCardProps {
  payment: PaymentVerification;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  onViewReceipt: (receiptUrl: string) => void;
}

const PaymentVerificationCard = ({ payment, onVerify, onReject, onViewReceipt }: PaymentVerificationCardProps) => {
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Orange Money':
        return 'bg-orange-500 text-white';
      case 'MTN Mobile Money':
        return 'bg-yellow-500 text-foreground';
      case 'Express Union':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <AppImage
              src={payment.clientImage}
              alt={payment.clientImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">{payment.clientName}</h3>
            <p className="text-xs text-muted-foreground">{payment.serviceType}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentMethodColor(payment.paymentMethod)}`}>
          {payment.paymentMethod}
        </span>
      </div>

      <div className="space-y-2 mb-3 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Amount:</span>
          <span className="text-lg font-heading font-bold text-foreground">{payment.amount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Transaction ID:</span>
          <span className="text-xs font-mono text-foreground">{payment.transactionId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Submitted:</span>
          <span className="text-xs text-muted-foreground">{payment.submittedDate}</span>
        </div>
      </div>

      <button
        onClick={() => onViewReceipt(payment.receiptImage)}
        className="w-full mb-3 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-smooth flex items-center justify-center space-x-2"
      >
        <Icon name="DocumentTextIcon" size={20} variant="outline" className="text-primary" />
        <span className="text-sm font-medium text-primary">View Payment Receipt</span>
      </button>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onReject(payment.id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded border border-error transition-smooth flex items-center justify-center space-x-1"
        >
          <Icon name="XMarkIcon" size={16} variant="outline" />
          <span>Reject</span>
        </button>
        <button
          onClick={() => onVerify(payment.id)}
          className="flex-1 px-3 py-2 text-sm font-medium bg-success text-success-foreground rounded hover:bg-success/90 transition-smooth flex items-center justify-center space-x-1"
        >
          <Icon name="CheckIcon" size={16} variant="outline" />
          <span>Verify</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentVerificationCard;