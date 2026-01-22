'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  alt: string;
  popular?: boolean;
  owner: string; // Added to show the account name early
}

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect
}) => {
  // Filtered to only show the two active methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'orange',
      name: 'Orange Money',
      logo: "https://img.rocket.new/generatedImages/rocket_gen_img_167938021-1764807748256.png",
      alt: 'Orange Money logo',
      popular: true,
      owner: 'Aryanne Liza Siewe Monkam'
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c946bba2-1765127883084.png",
      alt: 'MTN Mobile Money logo',
      owner: 'Marie Maffo'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Select Payment Method
        </h3>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="ShieldCheckIcon" size={16} variant="solid" className="text-success" />
          <span>Secure Transfer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
              selectedMethod === method.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            {method.popular && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-border">
                <AppImage
                  src={method.logo}
                  alt={method.alt}
                  className="w-full h-full object-contain p-1" 
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-heading font-bold text-foreground leading-tight">{method.name}</p>
                <p className="text-[10px] font-medium text-primary mt-0.5 uppercase tracking-tighter">
                  {method.owner.split(' ')[0]}'s Account
                </p>
              </div>
              {selectedMethod === method.id && (
                <Icon name="CheckCircleIcon" size={24} variant="solid" className="text-primary" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-xl border border-dashed border-border">
        <Icon name="InformationCircleIcon" size={20} variant="outline" className="text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">How it works:</p>
          <p>After selecting, you will see the phone number and account name for the transfer.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;