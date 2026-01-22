import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  iconColor: string;
}

const StatsCard = ({ title, value, change, changeType, icon, iconColor }: StatsCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return 'ArrowTrendingUpIcon';
      case 'decrease':
        return 'ArrowTrendingDownIcon';
      default:
        return 'MinusIcon';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center`}>
          <Icon name={icon as any} size={24} variant="outline" className="text-white" />
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon() as any} size={16} variant="solid" />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      <h3 className="text-2xl font-heading font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
};

export default StatsCard;