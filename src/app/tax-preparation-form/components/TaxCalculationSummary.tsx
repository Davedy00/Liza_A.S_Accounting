import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TaxCalculationSummaryProps {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  estimatedTax: number;
}

const TaxCalculationSummary = ({
  totalIncome,
  totalDeductions,
  taxableIncome,
  estimatedTax,
}: TaxCalculationSummaryProps) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace(/,/g, ' ');
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-success/10 rounded-lg">
          <Icon name="CalculatorIcon" size={24} variant="outline" className="text-success" />
        </div>
        <h2 className="font-heading font-semibold text-xl">Tax Calculation Summary</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="BanknotesIcon" size={20} variant="outline" className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Total Income</span>
          </div>
          <span className="text-lg font-semibold text-foreground">{formatCurrency(totalIncome)} FCFA</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="ReceiptPercentIcon" size={20} variant="outline" className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Total Deductions</span>
          </div>
          <span className="text-lg font-semibold text-error">- {formatCurrency(totalDeductions)} FCFA</span>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="CurrencyDollarIcon" size={20} variant="solid" className="text-primary" />
              <span className="text-sm font-medium text-foreground">Taxable Income</span>
            </div>
            <span className="text-lg font-semibold text-primary">{formatCurrency(taxableIncome)} FCFA</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border-2 border-success/30">
          <div className="flex items-center space-x-3">
            <Icon name="DocumentCheckIcon" size={20} variant="solid" className="text-success" />
            <span className="text-base font-semibold text-foreground">Estimated Tax</span>
          </div>
          <span className="text-xl font-bold text-success">{formatCurrency(estimatedTax)} FCFA</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} variant="solid" className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>This is an estimated calculation based on current Cameroonian tax rates</li>
              <li>Final tax amount may vary after professional review</li>
              <li>Additional taxes or credits may apply based on your specific situation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculationSummary;