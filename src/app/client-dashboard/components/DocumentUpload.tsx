'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Icon from '@/components/ui/AppIcon';

interface DocumentUploadProps {
  requestId: string;
  onUploadSuccess: () => void;
}

export default function DocumentUpload({ requestId, onUploadSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 1. Create a unique path for the file in the bucket
      // Pattern: requestId/timestamp-filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${requestId}/${fileName}`;

      // 2. Upload the actual file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('request-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Save the "Link" in your request_documents table
      const { error: dbError } = await supabase
        .from('request_documents')
        .insert([
          {
            request_id: requestId, // The UUID from your service_requests table
            file_path: filePath,
            file_name: file.name,
          },
        ]);

      if (dbError) throw dbError;

      // 4. Refresh the list in the parent component
      onUploadSuccess();
      
    } catch (error: any) {
      console.error('Upload error:', error.message);
      alert('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <label 
        className={`
          flex flex-col items-center justify-center w-full h-32 
          border-2 border-dashed rounded-xl transition-all cursor-pointer
          ${isUploading 
            ? 'bg-muted border-muted-foreground/20 cursor-not-allowed' 
            : 'border-border hover:border-primary hover:bg-primary/5'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (
            <>
              <Icon name="ArrowUpTrayIcon" size={24} className="text-muted-foreground mb-2" />
              <p className="text-sm text-foreground font-medium">Click to upload document</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG (Max 5MB)</p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileChange} 
          disabled={isUploading}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </label>
    </div>
  );
}