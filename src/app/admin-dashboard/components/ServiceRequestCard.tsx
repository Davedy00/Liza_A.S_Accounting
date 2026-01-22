import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface ServiceRequest {
  id: string;
  clientName: string;
  clientImage: string;
  clientImageAlt: string;
  serviceType: 'Tax Preparation' | 'TIN Creation';
  status: 'pending' | 'in-progress' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  submittedDate: string;
  dueDate: string;
  documentsCount: number;
  paymentStatus: 'pending' | 'verified' | 'failed';
  amount: string;
}

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onViewDetails: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const ServiceRequestCard = ({ request, onViewDetails, onUpdateStatus }: ServiceRequestCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'review':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-success" />;
      case 'failed':
        return <Icon name="XCircleIcon" size={16} variant="solid" className="text-error" />;
      default:
        return <Icon name="ClockIcon" size={16} variant="outline" className="text-warning" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <AppImage
              src={request.user_avatar || '/images/default-avatar.png'} 
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">{request.clientName}</h3>
            <p className="text-xs text-muted-foreground">ID: {request.id}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(request.priority || 'low')}`}>
  {request.priority ? request.priority.toUpperCase() : 'NORMAL'}
</span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Service Type:</span>
          <span className="text-sm font-medium text-foreground">{request.serviceType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(request.status)}`}>
            {request.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Payment:</span>
          <div className="flex items-center space-x-1">
            {getPaymentStatusIcon(request.paymentStatus)}
            <span className="text-sm font-medium text-foreground">{request.amount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
        <div className="flex items-center space-x-1">
          <Icon name="CalendarIcon" size={14} variant="outline" />
          <span>Submitted: {request.submittedDate}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="ClockIcon" size={14} variant="outline" />
          <span>Due: {request.dueDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Icon name="DocumentTextIcon" size={16} variant="outline" />
          <span>{request.documentsCount} documents</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateStatus(request.id, 'in-progress')}
            className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-smooth"
          >
            Update
          </button>
          <button
            onClick={() => onViewDetails(request.id)}
            className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-smooth"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestCard;