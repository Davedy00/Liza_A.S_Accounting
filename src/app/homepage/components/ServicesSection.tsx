import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: string;
  features: string[];
  href: string;
  popular?: boolean;
}

interface ServicesSectionProps {
  className?: string;
}

const ServicesSection = ({ className = '' }: ServicesSectionProps) => {
  const services: Service[] = [
    {
      id: 'tax-prep',
      title: 'Tax Preparation Services',
      description: 'Comprehensive tax filing for individuals and businesses with expert guidance through Cameroonian tax regulations.',
      icon: 'DocumentTextIcon',
      price: '15 000 FCFA',
      features: [
        'Individual & Business Tax Returns',
        'Tax Calculation & Optimization',
        'Document Review & Verification',
        'DGI Submission Support',
        'Compliance Guarantee',
        'Expert Consultation Included'
      ],
      href: '/tax-preparation-form',
      popular: true
    },
    {
      id: 'tin-creation',
      title: 'TIN Creation Service',
      description: 'Fast and reliable Tax Identification Number application processing for new taxpayers and businesses.',
      icon: 'IdentificationIcon',
      price: '5 000 FCFA',
      features: [
        'Individual & Business TIN',
        'Document Preparation',
        'Application Submission',
        'Status Tracking',
        '24-48 Hour Processing',
        'Digital Certificate Delivery'
      ],
      href: '/authentication-screen'
    }
  ];

  return (
    <section className={`py-16 lg:py-24 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Icon name="SparklesIcon" size={20} variant="solid" className="text-primary" />
            <span className="text-sm font-medium text-primary">Our Services</span>
          </div>
          
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Professional Tax Compliance Solutions
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the service that fits your needs. All services include expert support, secure document handling, and guaranteed compliance with Cameroonian tax regulations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative bg-card rounded-2xl shadow-lg hover:shadow-xl transition-smooth overflow-hidden ${
                service.popular ? 'ring-2 ring-conversion' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-conversion text-conversion-foreground px-4 py-1 rounded-bl-lg">
                  <span className="text-xs font-heading font-semibold">MOST POPULAR</span>
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name={service.icon as any} size={28} variant="outline" className="text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Starting from</div>
                    <div className="font-heading font-bold text-2xl text-primary">{service.price}</div>
                  </div>
                </div>
                
                <h3 className="font-heading font-bold text-2xl text-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon name="CheckCircleIcon" size={20} variant="solid" className="text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link
                  href={service.href}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-heading font-semibold transition-smooth ${
                    service.popular
                      ? 'bg-conversion text-conversion-foreground hover:bg-conversion/90 shadow-md hover:shadow-lg'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need a custom solution for your business? We offer tailored packages for enterprises and accounting firms.
          </p>
          <Link
            href="/authentication-screen"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            <span>Contact us for enterprise pricing</span>
            <Icon name="ArrowRightIcon" size={20} variant="outline" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;