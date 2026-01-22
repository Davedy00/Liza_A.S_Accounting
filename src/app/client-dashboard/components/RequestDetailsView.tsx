'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Icon from '@/components/ui/AppIcon';
import DocumentUpload from './DocumentUpload';
import { useAuth } from '@/context/AuthContext'; // Import this

export default function RequestDetailsView({ request, onBack }: { request: any, onBack: () => void }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const { user } = useAuth(); // Get current user

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const { data, error } = await supabase
        .from('request_documents')
        .select('*')
        .eq('request_id', request.id)
        .eq('user_id', user?.id) // Extra security layer
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching docs:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Function to delete a document (Bucket + Database)
  const handleDelete = async (docId: string, filePath: string) => {
    if (!confirm("Remove this document?")) return;
    try {
      await supabase.storage.from('request-documents').remove([filePath]);
      await supabase.from('request_documents').delete().eq('id', docId);
      fetchDocuments();
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  useEffect(() => {
    if (user?.id) fetchDocuments();
  }, [request.id, user?.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center text-muted-foreground hover:text-primary mb-4 group transition-colors">
        <Icon name="ArrowLeftIcon" size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Tracker */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{request.service_type}</h2>
              <span className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-muted-foreground">ID: {request.id}</span>
            </div>
            
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-8 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-background">
                  <Icon name="CheckIcon" size={14} className="text-white" />
                </div>
                <p className="font-semibold text-sm">Request Submitted</p>
                <p className="text-xs text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-background ${request.status !== 'pending' ? 'bg-primary' : 'bg-muted'}`}>
                  <Icon name="ArrowPathIcon" size={14} className="text-white" />
                </div>
                <p className="font-semibold text-sm">Review in Progress</p>
                <p className="text-xs text-muted-foreground">
                  {request.status === 'pending' ? 'Waiting for administrator...' : 'Admin is verifying documents'}
                </p>
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center text-sm uppercase tracking-wide">
              <Icon name="DocumentTextIcon" size={18} className="mr-2 text-primary" />
              Attached Documents
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {loadingDocs ? (
                [1, 2].map(i => <div key={i} className="animate-pulse h-16 bg-muted rounded-lg" />)
              ) : documents.map((doc) => (
                <div key={doc.id} className="group flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-center min-w-0">
                    <Icon name="DocumentIcon" size={18} className="mr-3 text-muted-foreground shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-medium truncate">{doc.file_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/request-documents/${doc.file_path}`}
                      target="_blank" rel="noreferrer"
                      className="p-1.5 hover:text-primary transition-colors"
                    >
                      <Icon name="ArrowDownTrayIcon" size={16} />
                    </a>
                    <button onClick={() => handleDelete(doc.id, doc.file_path)} className="p-1.5 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                      <Icon name="TrashIcon" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <DocumentUpload requestId={request.id} onUploadSuccess={fetchDocuments} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold mb-4 text-sm">Billing Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee:</span>
                <span className="font-medium">{request.amount || 0} FCFA</span>
              </div>
              <div className="pt-3 border-t border-dashed border-border flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary text-lg">{request.amount || 0} FCFA</span>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}