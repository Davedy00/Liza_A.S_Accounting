import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  imageAlt: string;
  activeServices: number;
  totalSpent: string;
  lastActivity: string;
  status: 'active' | 'inactive';
}

interface ClientListItemProps {
  client: Client;
  onViewProfile: (id: string) => void;
  onSendMessage: (id: string) => void;
}

const ClientListItem = ({ client, onViewProfile, onSendMessage }: ClientListItemProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
            <AppImage
              src={client.image}
              alt={client.imageAlt}
              className="w-full h-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
              client.status === 'active' ? 'bg-success' : 'bg-muted'
            }`}></div>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">{client.name}</h3>
            <p className="text-xs text-muted-foreground">{client.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          client.status === 'active' ?'bg-success/10 text-success border border-success/20' :'bg-muted text-muted-foreground border border-border'
        }`}>
          {client.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Active Services</p>
          <p className="text-sm font-semibold text-foreground">{client.activeServices}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
          <p className="text-sm font-semibold text-foreground">{client.totalSpent}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="ClockIcon" size={14} variant="outline" />
          <span>Last active: {client.lastActivity}</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="PhoneIcon" size={14} variant="outline" />
          <span>{client.phone}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onSendMessage(client.id)}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded border border-primary transition-smooth flex items-center justify-center space-x-1"
        >
          <Icon name="ChatBubbleLeftRightIcon" size={16} variant="outline" />
          <span>Message</span>
        </button>
        <button
          onClick={() => onViewProfile(client.id)}
          className="flex-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-smooth flex items-center justify-center space-x-1"
        >
          <Icon name="UserIcon" size={16} variant="outline" />
          <span>View Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ClientListItem;