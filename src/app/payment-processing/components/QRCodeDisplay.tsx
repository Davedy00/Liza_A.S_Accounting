'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QRCodeDisplayProps {
  paymentMethod: string;
  amount: number;
  transactionId: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  paymentMethod,
  amount,
  transactionId,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isHydrated]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    if (!isHydrated) return;
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `${paymentMethod}:${transactionId}:${amount}`
  )}`;

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-heading font-semibold text-foreground">Scan QR Code to Pay</h3>
        <p className="text-sm text-muted-foreground">
          Use your mobile money app to scan this code
        </p>
      </div>

      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="w-48 h-48 bg-muted flex items-center justify-center">
            {isHydrated ? (
              <img src={qrCodeUrl} alt="QR code for mobile money payment transaction" className="w-full h-full" />
            ) : (
              <Icon name="QrCodeIcon" size={96} variant="outline" className="text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
            <p className="text-sm font-mono font-semibold text-foreground">{transactionId}</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
            aria-label="Copy transaction ID"
          >
            <Icon
              name={copied ? 'CheckIcon' : 'ClipboardDocumentIcon'}
              size={20}
              variant="outline"
              className={copied ? 'text-success' : 'text-muted-foreground'}
            />
          </button>
        </div>

        {isHydrated && timeRemaining > 0 && (
          <div className="flex items-center justify-center space-x-2 p-3 bg-warning/10 rounded-lg">
            <Icon name="ClockIcon" size={20} variant="outline" className="text-warning" />
            <span className="text-sm font-semibold text-warning">
              Code expires in {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Payment Instructions:</p>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-primary">1.</span>
            <span>Open your {paymentMethod} mobile app</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-primary">2.</span>
            <span>Select "Scan QR Code" or "Pay with QR"</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-primary">3.</span>
            <span>Scan the QR code displayed above</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-primary">4.</span>
            <span>Confirm the payment amount and complete transaction</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodeDisplay;