'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Icon from '@/components/ui/AppIcon';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentSummary from './PaymentSummary';
import PaymentConfirmation from './PaymentConfirmation';
import ReceiptUpload from './ReceiptUpload';
import TransactionHistory from './TransactionHistory';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PaymentStep = 'method' | 'instructions' | 'confirm' | 'receipt' | 'success';

const ACCOUNT_DETAILS = {
  orange: {
    name: 'Orange Money',
    number: '655 802 752',
    owner: 'Aryanne Liza Siewe Monkam',
    instructions: 'Dial #150# to send money'
  },
  mtn: {
    name: 'MTN Mobile Money',
    number: '676 294 289',
    owner: 'Marie Maffo',
    instructions: 'Dial *126# to send money'
  }
};

const PaymentProcessingInteractive: React.FC = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const serviceItems = [
    { name: 'Individual Tax Preparation', amount: 25000 },
    { name: 'Document Processing', amount: 5000 },
  ];

  const subtotal = 30000;
  const processingFee = 500;
  const total = 30500;
  const [historyKey, setHistoryKey] = useState(0);

  const handleMethodSelect = (methodId: string) => setSelectedMethod(methodId);
  
  const handleProceedToPayment = () => {
    if (selectedMethod) setCurrentStep('instructions');
  };

  const handlePaymentConfirm = (userTransactionId: string) => {
    setTransactionId(userTransactionId);
    setCurrentStep('receipt');
  };

 const handleReceiptUpload = async (file: File) => {
  setIsSubmitting(true);
  
  try {
    // 1. Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to upload a receipt.");
    }

    // 2. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from('receipts') 
      .upload(filePath, file);

    if (uploadError) {
      // If you see "Bucket not found" here, run the SQL script below
      throw uploadError;
    }

    // 3. Insert metadata into your DB table
    // 3. Insert metadata into your DB table
const { error: dbError } = await supabase
.from('payments') // Changed from 'payment_proofs'
.insert({
  client_id: user.id,
  receipt_url: data.path, // Match the name used in your Admin Table
  transaction_id: transactionId,
  amount: total,
  status: 'processing', // Use 'processing' so it shows up in the Admin's queue
  payment_method: selectedMethod // Good for record keeping
});

    if (dbError) throw dbError;

    // 4. Move to Success Screen
    setCurrentStep('success');
    setHistoryKey(prev => prev + 1);

  } catch (error: any) {
    console.error('Submission error:', error.message);
    // Re-throw so ReceiptUpload.tsx shows the error message to the user
    throw error;
  } finally {
    setIsSubmitting(false);
  }
};
  const handleStartNewPayment = () => {
    setCurrentStep('method');
    setSelectedMethod('');
    setTransactionId('');
  };

  // Updated step index logic to match 'instructions' vs the old 'qr'
  const getStepIndex = (step: PaymentStep): number => {
    const steps: PaymentStep[] = ['method', 'instructions', 'confirm', 'receipt', 'success'];
    return steps.indexOf(step);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'method', label: 'Provider', icon: 'CreditCardIcon' },
      { id: 'instructions', label: 'Transfer', icon: 'InformationCircleIcon' },
      { id: 'confirm', label: 'Verify ID', icon: 'CheckBadgeIcon' },
      { id: 'receipt', label: 'Receipt', icon: 'DocumentArrowUpIcon' },
      { id: 'success', label: 'Done', icon: 'CheckCircleIcon' },
    ];

    const currentStepIndex = getStepIndex(currentStep);

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-smooth ${
                    index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStepIndex ? <Icon name="CheckIcon" size={20} variant="solid" /> : <Icon name={step.icon as any} size={20} variant="outline" />}
                </div>
                <p className={`text-[10px] mt-2 text-center uppercase tracking-tighter ${index <= currentStepIndex ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${index < currentStepIndex ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">Payment Processing</h1>
          <p className="text-muted-foreground">Follow the steps below to complete your secure payment.</p>
        </div>

        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 'method' && (
              <div className="space-y-6">
                <PaymentMethodSelector selectedMethod={selectedMethod} onMethodSelect={handleMethodSelect} />
                <div className="flex justify-end">
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!selectedMethod}
                    className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${
                      selectedMethod ? 'bg-primary text-primary-foreground shadow-lg hover:scale-[1.02]' : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'instructions' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-6">Transfer Money</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Number</p>
                      <p className="text-xl font-mono font-bold text-primary">
                        {selectedMethod === 'orange' ? ACCOUNT_DETAILS.orange.number : ACCOUNT_DETAILS.mtn.number}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Owner</p>
                      <p className="text-sm font-bold truncate">
                        {selectedMethod === 'orange' ? ACCOUNT_DETAILS.orange.owner : ACCOUNT_DETAILS.mtn.owner}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">1. {selectedMethod === 'orange' ? ACCOUNT_DETAILS.orange.instructions : ACCOUNT_DETAILS.mtn.instructions}</p>
                    <p className="text-sm text-muted-foreground">2. Transfer exactly <strong>{total.toLocaleString()} FCFA</strong></p>
                    <p className="text-sm text-primary font-bold">3. Note down the Transaction ID from the confirmation SMS</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setCurrentStep('method')} className="px-6 py-3 border border-border rounded-lg text-sm">Back</button>
                  <button onClick={() => setCurrentStep('confirm')} className="px-8 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg">I Have Sent the Money</button>
                </div>
              </div>
            )}

            {currentStep === 'confirm' && (
              <PaymentConfirmation method={selectedMethod} onConfirm={handlePaymentConfirm} onCancel={() => setCurrentStep('instructions')} />
            )}

            {currentStep === 'receipt' && (
              <div className="space-y-6">
                <div className={`${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                   <ReceiptUpload onUpload={handleReceiptUpload} />
                </div>
                {isSubmitting && (
                  <div className="flex items-center justify-center gap-2 text-primary animate-pulse">
                    <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                    <span className="text-sm font-bold">Securing your transaction...</span>
                  </div>
                )}
                <button onClick={() => setCurrentStep('confirm')} className="px-6 py-3 border border-border rounded-lg text-sm" disabled={isSubmitting}>Back</button>
              </div>
            )}

{currentStep === 'success' && (
  <div className="bg-card rounded-xl border border-border p-10 text-center space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
    <Icon name="CheckCircleIcon" size={64} variant="solid" className="text-success mx-auto" />
    
    <div>
      <h2 className="text-2xl font-bold">Payment Logged!</h2>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
        Your transaction <strong>{transactionId}</strong> is being verified. 
        Verification usually takes less than 15 minutes.
      </p>
    </div>

    <div className="flex flex-col gap-3">
      {/* NEW: Download Invoice Button */}
      <button 
        onClick={() => window.print()} 
        className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
      >
        <Icon name="ArrowDownTrayIcon" size={18} />
        Download Invoice (PDF)
      </button>

      <button onClick={handleStartNewPayment} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold">
        Make Another Payment
      </button>
      
      <button onClick={() => window.location.href = '/client-dashboard'} className="w-full py-3 border border-border rounded-lg font-bold">
        Go to Dashboard
      </button>
    </div>

    {/* HIDDEN INVOICE TEMPLATE (Only shows when printing) */}
    <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:p-10 text-left text-black">
      <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">AS ACCOUNTING</h1>
          <p className="text-sm">Douala, Cameroon</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase">Invoice</h2>
          <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="my-10">
        <h3 className="font-bold mb-2">Payment Details</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {serviceItems.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="py-2 text-right">{item.amount.toLocaleString()} FCFA</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="py-4">Total Paid</td>
              <td className="py-4 text-right text-lg">{total.toLocaleString()} FCFA</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <p className="text-xs font-mono">Transaction Reference: {transactionId}</p>
        <p className="text-xs font-mono">Method: {selectedMethod.toUpperCase()}</p>
      </div>

      <p className="mt-20 text-center text-gray-400 text-xs">
        This is a computer-generated receipt. Verification pending admin approval.
      </p>
    </div>
  </div>
)}
          </div>

          <div className="space-y-6">
            <PaymentSummary serviceItems={serviceItems} subtotal={subtotal} processingFee={processingFee} total={total} />
            <TransactionHistory key={historyKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingInteractive;