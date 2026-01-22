'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', href: '/homepage', icon: 'HomeIcon' },
    { label: 'Dashboard', href: '/client-dashboard', icon: 'ChartBarIcon' },
    { label: 'Tax Preparation', href: '/tax-preparation-form', icon: 'DocumentTextIcon' },
    { label: 'Payment', href: '/payment-processing', icon: 'CreditCardIcon' },
  ];

  const moreMenuItems = [
    { label: 'Admin', href: '/admin-dashboard', icon: 'CogIcon' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card shadow-md ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <Link href="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 flex-shrink-0 relative">
              <AppImage
                src="/assets/images/1000035431-1767950957123.png"
                alt="A.S Accounting logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-primary leading-tight">A.S Accounting</span>
              <span className="font-sans text-xs text-muted-foreground">Platform</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-smooth"
              >
                <Icon name={item.icon as any} size={20} variant="outline" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-smooth">
                <Icon name="EllipsisHorizontalIcon" size={20} variant="outline" />
                <span>More</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-card shadow-modal rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
                {moreMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-smooth first:rounded-t-md last:rounded-b-md"
                  >
                    <Icon name={item.icon as any} size={20} variant="outline" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/authentication-screen"
              className="px-6 py-2 text-sm font-heading font-semibold text-primary hover:text-primary/80 transition-smooth"
            >
              Sign In
            </Link>
            <Link
              href="/authentication-screen"
              className="px-6 py-2 bg-conversion text-conversion-foreground rounded-md text-sm font-heading font-semibold hover:bg-conversion/90 shadow-sm hover:shadow-md transition-smooth"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-smooth"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} variant="outline" />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border">
            <nav className="flex flex-col py-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-6 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-smooth"
                >
                  <Icon name={item.icon as any} size={20} variant="outline" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-border my-2"></div>
              
              {moreMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-6 py-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-smooth"
                >
                  <Icon name={item.icon as any} size={20} variant="outline" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-border my-2"></div>
              
              <div className="flex flex-col space-y-2 px-6 pt-2">
                <Link
                  href="/authentication-screen"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full px-6 py-3 text-center text-sm font-heading font-semibold text-primary hover:text-primary/80 border border-primary rounded-md transition-smooth"
                >
                  Sign In
                </Link>
                <Link
                  href="/authentication-screen"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full px-6 py-3 text-center bg-conversion text-conversion-foreground rounded-md text-sm font-heading font-semibold hover:bg-conversion/90 shadow-sm transition-smooth"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;