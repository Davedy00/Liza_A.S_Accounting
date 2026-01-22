'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface ServiceRequest {
  id: string;
  service_type: string; 
  status: 'pending' | 'in-progress' | 'completed' | 'requires-action';
  created_at: string;  
  amount: number;      
  progress: number;
  description: string;
  rejection_reason?: string; // Add this line!
}

interface ServiceRequestCardProps {
  request: ServiceRequest;
}

const statusConfig = {
  'pending': {
    label: 'Pending Review',
    color: 'bg-warning/10 text-warning border-warning/20',
    icon: 'ClockIcon' as const,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-secondary/10 text-secondary border-secondary/20',
    icon: 'ArrowPathIcon' as const,
  },
  'completed': {
    label: 'Completed',
    color: 'bg-success/10 text-success border-success/20',
    icon: 'CheckCircleIcon' as const,
  },
  'requires-action': {
    label: 'Action Required',
    color: 'bg-error/10 text-error border-error/20',
    icon: 'ExclamationTriangleIcon' as const,
  },
};

const ServiceRequestCard = ({ request }: ServiceRequestCardProps) => {
  // Safe fallback if status is missing
  const config = statusConfig[request.status] || statusConfig['pending'];

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
            {request.service_type}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{request.description || 'No description provided.'}</p>
        </div>
        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
          <Icon name={config.icon} size={14} variant="solid" />
          <span>{config.label}</span>
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Submitted:</span>
          <span className="font-medium text-foreground">
            {new Date(request.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated Fee:</span>
          <span className="font-medium text-foreground">
            {request.amount?.toLocaleString() || '0'} FCFA
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-primary">{request.progress || 0}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${request.progress || 5}%` }}
          />
        </div>
      </div>
      {/* --- REJECTION ALERT BLOCK --- */}
{request.status === 'requires-action' && (
  <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg animate-in fade-in duration-500">
    <div className="flex items-start gap-2">
      <Icon name="ExclamationTriangleIcon" size={16} className="text-error mt-0.5" />
      <div>
        <p className="text-xs font-bold text-error uppercase">Payment Rejected</p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          "{request.rejection_reason || 'Please re-upload your receipt.'}"
        </p>
      </div>
    </div>
  </div>
)}
      <Link
        href={`/client-dashboard?request=${request.id}`}
        className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-smooth"
      >
        <span>View Details</span>
        <Icon name="ArrowRightIcon" size={16} variant="outline" />
      </Link>
    </div>
  );
};

export default ServiceRequestCard;