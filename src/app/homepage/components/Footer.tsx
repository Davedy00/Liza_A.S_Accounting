import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Image from '@/components/ui/AppImage';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Tax Preparation', href: '/tax-preparation-form' },
      { label: 'TIN Creation', href: '/authentication-screen' },
      { label: 'Business Services', href: '/authentication-screen' },
      { label: 'Pricing', href: '/homepage' }
    ],
    company: [
      { label: 'About Us', href: '/homepage' },
      { label: 'Contact', href: '/authentication-screen' },
      { label: 'Careers', href: '/homepage' },
      { label: 'Blog', href: '/homepage' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/homepage' },
      { label: 'Terms of Service', href: '/homepage' },
      { label: 'Cookie Policy', href: '/homepage' },
      { label: 'Compliance', href: '/homepage' }
    ],
    support: [
      { label: 'Help Center', href: '/authentication-screen' },
      { label: 'Documentation', href: '/homepage' },
      { label: 'FAQ', href: '/homepage' },
      { label: 'Contact Support', href: '/authentication-screen' }
    ]
  };

  return (
    <footer className={`bg-foreground text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link href="/homepage" className="flex items-center space-x-2 mb-4">
              <Image
                src="/assets/images/1000035431-1767950957123.png"
                alt="A.S Accounting Platform Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg leading-tight">A.S Accounting</span>
                <span className="font-sans text-xs text-white/70">Platform</span>
              </div>
            </Link>
            
            <p className="text-white/70 mb-6 max-w-md">
              Your trusted partner for tax compliance in Cameroon. We simplify complex tax processes and help individuals and businesses stay compliant with confidence.
            </p>
            
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-smooth"
                aria-label="Facebook"
              >
                <Icon name="GlobeAltIcon" size={20} variant="outline" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-smooth"
                aria-label="Twitter"
              >
                <Icon name="GlobeAltIcon" size={20} variant="outline" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-smooth"
                aria-label="LinkedIn"
              >
                <Icon name="GlobeAltIcon" size={20} variant="outline" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-smooth text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-smooth text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-smooth text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/70">
              © {currentYear} A.S Accounting Platform. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/70 hover:text-white transition-smooth"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-white/50">
            <Icon name="ShieldCheckIcon" size={16} variant="outline" />
            <span>DGI Certified Partner • Secure & Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;