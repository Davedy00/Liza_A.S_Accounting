'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ServiceItem {
  name: string;
  amount: number;
}

interface PaymentSummaryProps {
  serviceItems: ServiceItem[];
  subtotal: number;
  processingFee: number;
  total: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  serviceItems,
  subtotal,
  processingFee,
  total,
}) => {
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 bg-muted/30 border-b border-border flex items-center space-x-2">
        <Icon name="DocumentTextIcon" size={20} variant="outline" className="text-primary" />
        <h3 className="text-base font-heading font-bold text-foreground">Payment Summary</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Service Items List */}
        <div className="space-y-3">
          {serviceItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>

        {/* Calculations Section */}
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-sm font-medium text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">Network & Processing</span>
              <div className="group relative">
                <Icon name="QuestionMarkCircleIcon" size={14} className="text-muted-foreground/60 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Covers Mobile Money withdrawal charges and transaction processing.
                </div>
              </div>
            </div>
            <span className="text-sm font-medium text-primary">+{formatCurrency(processingFee)}</span>
          </div>
        </div>

        {/* Total Amount Section */}
        <div className="pt-4 border-t-2 border-dashed border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-base font-heading font-bold text-foreground">Total Amount</span>
            <span className="text-2xl font-heading font-extrabold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
          <p className="mt-2 text-[10px] text-center text-muted-foreground italic">
            Please transfer the exact amount above to avoid processing delays.
          </p>
        </div>

        {/* Success / Security Badge */}
        <div className="flex items-start space-x-2 p-3 bg-success/5 border border-success/10 rounded-lg">
          <Icon name="ShieldCheckIcon" size={18} variant="solid" className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight text-success font-medium">
            Your payment is secure and will be verified immediately upon receipt of the transaction ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;