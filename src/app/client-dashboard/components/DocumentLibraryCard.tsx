import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'available' | 'processing';
}

interface DocumentLibraryCardProps {
  documents: Document[];
}

const DocumentLibraryCard = ({ documents }: DocumentLibraryCardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg text-foreground">Document Library</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-smooth">
          <Icon name="ArrowUpTrayIcon" size={16} variant="outline" />
          <span>Upload</span>
        </button>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="DocumentTextIcon" size={20} variant="solid" className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.uploadDate}</span>
                </div>
              </div>
            </div>
            {doc.status === 'available' ? (
              <button className="flex-shrink-0 p-2 hover:bg-primary/10 rounded-md transition-smooth">
                <Icon name="ArrowDownTrayIcon" size={20} variant="outline" className="text-primary" />
              </button>
            ) : (
              <span className="flex-shrink-0 px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                Processing
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentLibraryCard;