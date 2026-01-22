import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface DocumentUploadFormProps {
  uploadedDocuments: UploadedDocument[];
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (id: string) => void;
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const DocumentUploadForm = ({
  uploadedDocuments,
  onFileSelect,
  onRemoveDocument,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDrop,
}: DocumentUploadFormProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="DocumentTextIcon" size={24} variant="outline" className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-semibold text-xl">Supporting Documents</h2>
          <p className="text-sm text-muted-foreground">Upload relevant tax documents (PDF, JPG, PNG)</p>
        </div>
      </div>

      <div
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
        }`}
      >
        <Icon name="CloudArrowUpIcon" size={48} variant="outline" className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground mb-2">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Supported formats: PDF, JPG, PNG (Max 10MB per file)
        </p>
        <label className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-smooth">
          <span className="text-sm font-medium">Choose Files</span>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {uploadedDocuments.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground">Uploaded Documents ({uploadedDocuments.length})</h3>
          {uploadedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="p-2 bg-card rounded">
                  <Icon
                    name={doc.type === 'pdf' ? 'DocumentTextIcon' : 'PhotoIcon'}
                    size={20}
                    variant="outline"
                    className="text-primary"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDocument(doc.id)}
                className="ml-3 p-2 text-error hover:bg-error/10 rounded transition-smooth"
              >
                <Icon name="TrashIcon" size={20} variant="outline" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} variant="solid" className="text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <p className="font-medium mb-1">Required Documents:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Previous year tax returns (if applicable)</li>
              <li>Income statements and pay slips</li>
              <li>Bank statements for the tax year</li>
              <li>Receipts for deductible expenses</li>
              <li>Business registration documents (for business returns)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;