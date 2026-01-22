'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Props {
  requestId: string;
  onSave: (file: File) => Promise<void>;
  onCancel: () => void;
}

const PaymentReuploadForm = ({ requestId, onSave, onCancel }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    await onSave(file);
    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-error/5 border border-dashed border-error/20 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Please upload a clear screenshot or PDF of your transaction receipt.
        </p>
        <input 
          type="file" 
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!file || isUploading}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Submit New Proof'}
        </button>
      </div>
    </form>
  );
};

export default PaymentReuploadForm;