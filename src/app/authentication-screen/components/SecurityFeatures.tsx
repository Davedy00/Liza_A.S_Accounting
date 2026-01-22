import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
}

const SecurityFeatures = () => {
  const features: SecurityFeature[] = [
    {
      icon: 'LockClosedIcon',
      title: 'End-to-End Encryption',
      description: 'All your documents and personal information are encrypted during transmission and storage',
    },
    {
      icon: 'FingerPrintIcon',
      title: 'Two-Factor Authentication',
      description: 'Optional 2FA adds an extra layer of security to protect your account',
    },
    {
      icon: 'DocumentCheckIcon',
      title: 'Secure Document Storage',
      description: 'Your tax documents are stored securely and accessible only to you and authorized personnel',
    },
    {
      icon: 'ShieldExclamationIcon',
      title: 'Regular Security Audits',
      description: 'We conduct regular security assessments to ensure your data remains protected',
    },
  ];

  return (
    <div className="bg-muted/30 rounded-lg p-8">
      <div className="text-center mb-8">
        <h2 className="font-heading text-2xl font-bold text-primary mb-2">Your Security is Our Priority</h2>
        <p className="text-muted-foreground">
          We implement industry-leading security measures to protect your sensitive information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={feature.icon as any} size={20} variant="solid" className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} variant="solid" className="text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground">
              <strong>Privacy Guarantee:</strong> We never share your personal information with third parties without your
              explicit consent. Your data is used solely for providing our tax compliance services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;