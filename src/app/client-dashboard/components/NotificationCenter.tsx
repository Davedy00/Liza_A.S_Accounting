'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter = ({ notifications: initialNotifications }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  const typeConfig = {
    info: { color: 'bg-primary/10 text-primary', icon: 'InformationCircleIcon' as const },
    success: { color: 'bg-success/10 text-success', icon: 'CheckCircleIcon' as const },
    warning: { color: 'bg-warning/10 text-warning', icon: 'ExclamationTriangleIcon' as const },
    error: { color: 'bg-error/10 text-error', icon: 'XCircleIcon' as const },
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="font-heading font-semibold text-lg text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-error text-error-foreground text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {displayedNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          return (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-smooth ${
                notification.read
                  ? 'bg-muted/30 border-border' :'bg-card border-primary/20 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
                  <Icon name={config.icon} size={16} variant="solid" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground mb-1">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
        >
          {showAll ? 'Show Less' : `View All (${notifications.length - 3} more)`}
        </button>
      )}
    </div>
  );
};

export default NotificationCenter;