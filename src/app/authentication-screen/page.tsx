import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import AuthenticationForm from './components/AuthenticationForm';
import TrustIndicators from './components/TrustIndicators';
import SecurityFeatures from './components/SecurityFeatures';

export const metadata: Metadata = {
  title: 'Sign In / Register - A.S Accounting Platform',
  description:
    'Securely access your A.S Accounting account or create a new account to manage your tax compliance services in Cameroon. Bank-level security with Google OAuth integration.',
};

export default function AuthenticationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              Access Your Tax Compliance Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sign in to manage your services or create an account to start your seamless tax compliance journey with A.S
              Accounting
            </p>
          </div>

          <AuthenticationForm className="mb-16" />

          <TrustIndicators />

          <div className="mt-16">
            <SecurityFeatures />
          </div>

          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-primary mb-4">Need Help Getting Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our support team is available to assist you with account creation, login issues, or any questions about our
              services. We&apos;re here to make your tax compliance journey as smooth as possible.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="tel:+237600000000"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-medium">+237 6XX XXX XXX</span>
              </a>
              <a
                href="mailto:support@asaccounting.cm"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">support@asaccounting.cm</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} A.S Accounting Platform. All rights reserved. | Proudly serving Cameroon&apos;s
            tax compliance needs
          </p>
        </div>
      </footer>
    </div>
  );
}