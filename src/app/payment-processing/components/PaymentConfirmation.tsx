'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentConfirmationProps {
  onConfirm: (transactionId: string) => void;
  onCancel: () => void;
  method?: string; // New prop to identify 'orange' or 'mtn'
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  onConfirm,
  onCancel,
  method,
}) => {
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  // Determine dynamic text based on the method
  const isOrange = method === 'orange';
  const methodName = isOrange ? 'Orange Money' : 'MTN MoMo';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      setError(`Please enter your ${methodName} transaction ID`);
      return;
    }

    if (transactionId.length < 8) {
      setError('Transaction ID must be at least 8 characters');
      return;
    }

    setError('');
    onConfirm(transactionId);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="CheckBadgeIcon" size={24} variant="outline" className="text-primary" />
        <h3 className="text-lg font-heading font-semibold text-foreground">Confirm {methodName} Payment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="transactionId" className="block text-sm font-semibold text-foreground mb-2">
            {methodName} Transaction ID <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              setError('');
            }}
            // FIXED: No more repeating generic "mobile money"
            placeholder={`Paste the ID from your ${methodName} SMS here`}
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? 'border-error' : 'border-input'
            } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth`}
          />
          {error && (
            <div className="mt-2 text-sm text-error flex items-center space-x-1">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
          <Icon name="InformationCircleIcon" size={20} variant="outline" className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Check your SMS inbox for a message from <strong>{isOrange ? 'OrangeMoney' : 'MobileMoney'}</strong>. Copy the transaction ID and paste it above to verify your payment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-border rounded-lg text-sm font-heading font-semibold text-foreground hover:bg-muted transition-smooth"
          >
            Back to Instructions
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-heading font-semibold hover:bg-primary/90 shadow-sm hover:shadow-md transition-smooth"
          >
            Verify Payment
          </button>
        </div>
      </form>

      <div className="pt-4 border-t border-border">
        <p className="text-sm font-semibold text-foreground mb-2">Payment help?</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Icon name="PhoneIcon" size={16} variant="outline" className="flex-shrink-0 mt-0.5" />
            <span>Support: +237 655 802 752 (Aryanne)</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="EnvelopeIcon" size={16} variant="outline" className="flex-shrink-0 mt-0.5" />
            <span>Email: aryannesiewe@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;