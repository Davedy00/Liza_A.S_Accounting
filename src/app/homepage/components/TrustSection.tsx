import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrustMetric {
  id: string;
  value: string;
  label: string;
  icon: string;
}

interface TrustBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface TrustSectionProps {
  className?: string;
}

const TrustSection = ({ className = '' }: TrustSectionProps) => {
  const metrics: TrustMetric[] = [
    {
      id: 'clients',
      value: '2,500+',
      label: 'Satisfied Clients',
      icon: 'UsersIcon'
    },
    {
      id: 'processed',
      value: '5,000+',
      label: 'Tax Returns Processed',
      icon: 'DocumentCheckIcon'
    },
    {
      id: 'rating',
      value: '4.9/5',
      label: 'Client Satisfaction',
      icon: 'StarIcon'
    },
    {
      id: 'experience',
      value: '10+ Years',
      label: 'Industry Experience',
      icon: 'AcademicCapIcon'
    }
  ];

  const badges: TrustBadge[] = [
    {
      id: 'dgi',
      title: 'DGI Certified Partner',
      description: 'Officially recognized by the Direction Générale des Impôts',
      icon: 'ShieldCheckIcon'
    },
    {
      id: 'security',
      title: 'Bank-Level Security',
      description: 'End-to-end encryption for all documents and transactions',
      icon: 'LockClosedIcon'
    },
    {
      id: 'compliance',
      title: '100% Compliance Rate',
      description: 'All submissions meet Cameroonian tax regulations',
      icon: 'CheckBadgeIcon'
    },
    {
      id: 'support',
      title: '24/7 Support Available',
      description: 'Expert assistance whenever you need it',
      icon: 'ChatBubbleLeftRightIcon'
    }
  ];

  return (
    <section className={`py-16 lg:py-24 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-success/10 px-4 py-2 rounded-full mb-4">
            <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-success" />
            <span className="text-sm font-medium text-success">Trusted by Thousands</span>
          </div>
          
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Your Trusted Tax Compliance Partner
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We've built our reputation on reliability, expertise, and exceptional service. Join thousands of satisfied clients who trust us with their tax compliance needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={metric.icon as any} size={24} variant="solid" className="text-primary" />
              </div>
              <div className="font-heading font-bold text-3xl text-primary mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {badges.map((badge) => (
            <div key={badge.id} className="bg-gradient-to-br from-card to-muted/30 rounded-xl shadow-md p-6 hover:shadow-lg transition-smooth">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={badge.icon as any} size={24} variant="solid" className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-center">
          <Icon name="ShieldCheckIcon" size={48} variant="solid" className="text-white mx-auto mb-4" />
          <h3 className="font-heading font-bold text-2xl lg:text-3xl text-white mb-4">
            Compliance Guarantee
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-6">
            We guarantee that all tax documents prepared by our team meet DGI requirements. If any issues arise due to our error, we'll handle corrections at no additional cost.
          </p>
          <div className="flex items-center justify-center space-x-2 text-white/80">
            <Icon name="DocumentCheckIcon" size={20} variant="outline" />
            <span className="text-sm">Backed by our professional liability insurance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;