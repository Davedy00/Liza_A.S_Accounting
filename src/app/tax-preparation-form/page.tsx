import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import TaxPreparationInteractive from './components/TaxPreparationInteractive';

export const metadata: Metadata = {
  title: 'Tax Preparation Form - A.S Accounting Platform',
  description: 'Complete your individual or business tax return with our guided multi-step form. Upload documents, calculate deductions, and submit your tax preparation request securely.',
};

export default function TaxPreparationFormPage() {
  return (
    <>
      <Header />
      <TaxPreparationInteractive />
    </>
  );
}