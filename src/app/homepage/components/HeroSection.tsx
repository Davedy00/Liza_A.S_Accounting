import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface HeroSectionProps {
  className?: string;
}

const HeroSection = ({ className = '' }: HeroSectionProps) => {
  return (
    <section className={`relative bg-gradient-to-br from-primary via-primary/95 to-secondary py-20 lg:py-32 ${className}`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6TTQgNHYyaDJ2LTJINHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Icon name="CheckBadgeIcon" size={20} variant="solid" className="text-brand-golden" />
              <span className="text-sm font-medium text-white">DGI Certified Tax Compliance Partner</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Simplify Your Tax Compliance in Cameroon
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              Professional tax preparation and TIN creation services designed for individuals and SMEs. Navigate Cameroonian tax regulations with confidence and expert guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/authentication-screen"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-conversion text-conversion-foreground rounded-lg text-base font-heading font-semibold hover:bg-conversion/90 shadow-lg hover:shadow-xl transition-smooth"
              >
                <span>Get Started Today</span>
                <Icon name="ArrowRightIcon" size={20} variant="outline" />
              </Link>
              
              <Link
                href="/authentication-screen"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg text-base font-heading font-semibold hover:bg-white/20 transition-smooth"
              >
                <Icon name="UserCircleIcon" size={20} variant="outline" />
                <span>Sign In</span>
              </Link>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Icon name="ClockIcon" size={20} variant="outline" />
                <span className="text-sm">24-48 Hour Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="ShieldCheckIcon" size={20} variant="outline" />
                <span className="text-sm">Secure & Confidential</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="DevicePhoneMobileIcon" size={20} variant="outline" />
                <span className="text-sm">Mobile Money Accepted</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-golden/20 to-secondary/20 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon name="DocumentCheckIcon" size={24} variant="solid" className="text-success" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-foreground">Quick Service Request</h3>
                    <p className="text-sm text-muted-foreground">Start your tax compliance journey</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Icon name="DocumentTextIcon" size={24} variant="outline" className="text-primary" />
                      <span className="font-medium text-foreground">Tax Preparation</span>
                    </div>
                    <Icon name="ChevronRightIcon" size={20} variant="outline" className="text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <Icon name="IdentificationIcon" size={24} variant="outline" className="text-secondary" />
                      <span className="font-medium text-foreground">TIN Creation</span>
                    </div>
                    <Icon name="ChevronRightIcon" size={20} variant="outline" className="text-muted-foreground" />
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Starting from</span>
                      <span className="font-heading font-bold text-xl text-primary">5 000 FCFA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;