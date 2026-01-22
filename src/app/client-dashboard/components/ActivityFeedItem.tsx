import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: string;
  type: 'message' | 'document' | 'payment' | 'status';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface ActivityFeedItemProps {
  activity: Activity;
}

const ActivityFeedItem = ({ activity }: ActivityFeedItemProps) => {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-smooth">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.color} flex items-center justify-center`}>
        <Icon name={activity.icon as any} size={20} variant="solid" className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground mb-1">{activity.title}</p>
        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
      </div>
    </div>
  );
};

export default ActivityFeedItem;