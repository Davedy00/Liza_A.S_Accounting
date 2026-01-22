import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Activity {
  id: string;
  type: 'service_request' | 'payment_verified' | 'document_uploaded' | 'status_updated' | 'message_sent';
  clientName: string;
  clientImage: string;
  clientImageAlt: string;
  description: string;
  timestamp: string;
  serviceId?: string;
}

interface RecentActivityItemProps {
  activity: Activity;
}

const RecentActivityItem = ({ activity }: RecentActivityItemProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'service_request':
        return { name: 'DocumentPlusIcon', color: 'bg-blue-500' };
      case 'payment_verified':
        return { name: 'CheckBadgeIcon', color: 'bg-success' };
      case 'document_uploaded':
        return { name: 'ArrowUpTrayIcon', color: 'bg-accent' };
      case 'status_updated':
        return { name: 'ArrowPathIcon', color: 'bg-warning' };
      case 'message_sent':
        return { name: 'ChatBubbleLeftRightIcon', color: 'bg-primary' };
      default:
        return { name: 'BellIcon', color: 'bg-muted' };
    }
  };

  const iconConfig = getActivityIcon(activity.type);

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-border last:border-0">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <AppImage
            src={activity.clientImage}
            alt={activity.clientImageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{activity.clientName}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
          </div>
          <div className={`w-8 h-8 rounded-lg ${iconConfig.color} flex items-center justify-center flex-shrink-0 ml-2`}>
            <Icon name={iconConfig.name as any} size={16} variant="outline" className="text-white" />
          </div>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <Icon name="ClockIcon" size={12} variant="outline" className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityItem;