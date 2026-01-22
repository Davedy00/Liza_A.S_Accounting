import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrustIndicator {
  icon: string;
  title: string;
  description: string;
}

const TrustIndicators = () => {
  const indicators: TrustIndicator[] = [
    {
      icon: 'ShieldCheckIcon',
      title: 'Bank-Level Security',
      description: 'Your data is encrypted and protected with industry-standard security protocols',
    },
    {
      icon: 'CheckBadgeIcon',
      title: 'DGI Compliant',
      description: 'Fully compliant with Cameroonian tax regulations and requirements',
    },
    {
      icon: 'UserGroupIcon',
      title: '500+ Clients Served',
      description: 'Trusted by individuals and businesses across Cameroon',
    },
    {
      icon: 'ClockIcon',
      title: '24/7 Support',
      description: 'Our team is available to assist you with any questions or concerns',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-smooth"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name={indicator.icon as any} size={24} variant="solid" className="text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-foreground">{indicator.title}</h3>
            <p className="text-sm text-muted-foreground">{indicator.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustIndicators;