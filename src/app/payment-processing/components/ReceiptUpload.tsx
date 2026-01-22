'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import confetti from 'canvas-confetti';
import imageCompression from 'browser-image-compression'; // NEW: Compression

interface ReceiptUploadProps {
  onUpload: (file: File) => Promise<void> | void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    setError('');
    
    // IMAGE COMPRESSION LOGIC
    // This shrinks files to ~500KB while keeping text readable
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      if (file.size > 1 * 1024 * 1024) { // Only compress if > 1MB
        file = await imageCompression(file, options);
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing image. Try a different one.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a receipt image');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await onUpload(selectedFile);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#ffffff', '#22c55e'],
        zIndex: 9999,
      });

      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        handleRemove();
      }, 3000);

    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6 transition-all duration-300">
      {/* Header with status badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="DocumentArrowUpIcon" size={24} variant="outline" className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Payment Receipt</h3>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-1 text-success animate-in fade-in zoom-in duration-300">
            <Icon name="CheckCircleIcon" size={20} variant="solid" />
            <span className="text-xs font-bold uppercase tracking-wider">Received</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-smooth"
          >
            <Icon name="CloudArrowUpIcon" size={48} variant="outline" className="mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-semibold text-foreground mb-1">Click to upload receipt</p>
            <p className="text-xs text-muted-foreground">JPG, PNG (max. 5MB)</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`relative rounded-lg overflow-hidden border transition-colors ${showSuccess ? 'border-success' : 'border-border'}`}>
              <AppImage src={previewUrl} width={400} height={300} alt="Receipt Preview" />
              {!showSuccess && (
                <button onClick={handleRemove} disabled={isUploading} className="absolute top-2 right-2 p-2 bg-error text-error-foreground rounded-full shadow-md hover:bg-error/90 disabled:opacity-50">
                  <Icon name="XMarkIcon" size={20} variant="outline" />
                </button>
              )}
              {showSuccess && (
                <div className="absolute inset-0 bg-success/20 backdrop-blur-[2px] flex items-center justify-center animate-in zoom-in duration-300">
                   <div className="bg-success text-white p-3 rounded-full shadow-xl"><Icon name="CheckIcon" size={32} /></div>
                </div>
              )}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-error bg-error/10 p-3 rounded-lg">{error}</p>}

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={isUploading || showSuccess}
            className={`w-full px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              showSuccess ? 'bg-success text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            } disabled:opacity-70`}
          >
            {isUploading ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : null}
            {isUploading ? 'Uploading...' : showSuccess ? 'Upload Complete!' : 'Upload Receipt'}
          </button>
        )}
      </div>

     {/* Timeline Tracker - Perfectly Aligned */}
<div className="pt-4 border-t border-border">
  <div className="flex items-center justify-between text-[10px] uppercase tracking-tighter font-bold">
    {/* Step 1 */}
    <div className={`flex flex-col items-center gap-1.5 transition-opacity ${showSuccess ? 'opacity-100' : 'opacity-40'}`}>
      <div className={`w-2.5 h-2.5 rounded-full ${showSuccess ? 'bg-success animate-pulse' : 'bg-muted'}`} />
      <span className={showSuccess ? 'text-success' : 'text-muted-foreground'}>Submitted</span>
    </div>

    {/* Connector 1 */}
    <div className="flex-1 h-[2px] bg-border mx-2 mt-[-12px]" />

    {/* Step 2 */}
    <div className="flex flex-col items-center gap-1.5 opacity-40">
      <div className="w-2.5 h-2.5 rounded-full bg-muted" />
      <span className="text-muted-foreground">In Review</span>
    </div>

    {/* Connector 2 */}
    <div className="flex-1 h-[2px] bg-border mx-2 mt-[-12px]" />

    {/* Step 3 */}
    <div className="flex flex-col items-center gap-1.5 opacity-40">
      <div className="w-2.5 h-2.5 rounded-full bg-muted" />
      <span className="text-muted-foreground">Verified</span>
    </div>
  </div>
</div>
    </div>
  );
};

export default ReceiptUpload;