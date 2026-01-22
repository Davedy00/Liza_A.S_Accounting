import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface CTASectionProps {
  className?: string;
}

const CTASection = ({ className = '' }: CTASectionProps) => {
  return (
    <section className={`py-16 lg:py-24 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6TTQgNHYyaDJ2LTJINHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6">
            Ready to Simplify Your Tax Compliance?
          </h2>
          
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied clients who trust A.S Accounting for their tax preparation and TIN creation needs. Get started today and experience hassle-free compliance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/authentication-screen"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-conversion text-conversion-foreground rounded-lg text-base font-heading font-semibold hover:bg-conversion/90 shadow-lg hover:shadow-xl transition-smooth"
            >
              <span>Create Free Account</span>
              <Icon name="ArrowRightIcon" size={20} variant="outline" />
            </Link>
            
            <Link
              href="/authentication-screen"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg text-base font-heading font-semibold hover:bg-white/20 transition-smooth"
            >
              <Icon name="ChatBubbleLeftRightIcon" size={20} variant="outline" />
              <span>Talk to an Expert</span>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Icon name="ClockIcon" size={32} variant="outline" className="text-white mx-auto mb-3" />
              <div className="font-heading font-bold text-2xl text-white mb-1">24-48h</div>
              <div className="text-sm text-white/80">Processing Time</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Icon name="ShieldCheckIcon" size={32} variant="outline" className="text-white mx-auto mb-3" />
              <div className="font-heading font-bold text-2xl text-white mb-1">100%</div>
              <div className="text-sm text-white/80">Compliance Rate</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Icon name="UserGroupIcon" size={32} variant="outline" className="text-white mx-auto mb-3" />
              <div className="font-heading font-bold text-2xl text-white mb-1">2,500+</div>
              <div className="text-sm text-white/80">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;