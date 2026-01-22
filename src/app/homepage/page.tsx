import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import TrustSection from './components/TrustSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ConnectionToast from '@/components/common/ConnectionToast';

export const metadata: Metadata = {
  title: 'Homepage - A.S Accounting Platform',
  description: 'Professional tax compliance and accounting services platform for individuals and SMEs in Cameroon. Simplify tax preparation and TIN creation with expert guidance.',
};

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        <TrustSection />
        <TestimonialsSection />
        <CTASection />
        <ConnectionToast />
      </main>
      
      <Footer />
    </div>
  );
}