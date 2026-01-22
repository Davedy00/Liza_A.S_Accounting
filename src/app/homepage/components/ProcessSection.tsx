import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface ProcessSectionProps {
  className?: string;
}

const ProcessSection = ({ className = '' }: ProcessSectionProps) => {
  const steps: ProcessStep[] = [
    {
      id: 1,
      title: 'Create Account',
      description: 'Sign up in minutes with your email or Google account. Set up your secure profile to get started.',
      icon: 'UserPlusIcon'
    },
    {
      id: 2,
      title: 'Select Service',
      description: 'Choose between Tax Preparation or TIN Creation. Review pricing and service details before proceeding.',
      icon: 'ClipboardDocumentCheckIcon'
    },
    {
      id: 3,
      title: 'Upload Documents',
      description: 'Securely upload required documents through our encrypted platform. Our system guides you through each requirement.',
      icon: 'CloudArrowUpIcon'
    },
    {
      id: 4,
      title: 'Make Payment',
      description: 'Pay conveniently using Orange Money, MTN Mobile Money, or other supported payment methods.',
      icon: 'CreditCardIcon'
    },
    {
      id: 5,
      title: 'Expert Processing',
      description: 'Our certified professionals review and process your request with attention to detail and compliance.',
      icon: 'UserGroupIcon'
    },
    {
      id: 6,
      title: 'Receive Documents',
      description: 'Download your completed tax documents or TIN certificate directly from your secure dashboard.',
      icon: 'DocumentCheckIcon'
    }
  ];

  return (
    <section className={`py-16 lg:py-24 bg-muted/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
            <Icon name="MapIcon" size={20} variant="solid" className="text-secondary" />
            <span className="text-sm font-medium text-secondary">How It Works</span>
          </div>
          
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Simple, Transparent Process
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From registration to document delivery, we've streamlined every step to make tax compliance effortless. Follow our proven six-step process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="bg-card rounded-xl shadow-md hover:shadow-lg transition-smooth p-6 h-full">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name={step.icon as any} size={24} variant="outline" className="text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {step.id}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <Icon name="ArrowRightIcon" size={24} variant="outline" className="text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-success/10 px-6 py-3 rounded-lg">
            <Icon name="ClockIcon" size={20} variant="outline" className="text-success" />
            <span className="text-sm font-medium text-success">Average completion time: 24-48 hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;