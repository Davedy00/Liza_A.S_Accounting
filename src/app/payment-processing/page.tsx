import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import PaymentProcessingInteractive from './components/PaymentProcessingInteractive';

export const metadata: Metadata = {
  title: 'Payment Processing - A.S Accounting Platform',
  description: 'Complete your tax service payment securely using mobile money providers including Orange Money and MTN Mobile Money with instant processing and receipt verification.',
};

export default function PaymentProcessingPage() {
  return (
    <>
      <Header />
      <PaymentProcessingInteractive />
    </>
  );
}