import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Deduction {
  id: string;
  type: string;
  description: string;
  amount: string;
}

interface DeductionsFormProps {
  deductions: Deduction[];
  onAddDeduction: () => void;
  onRemoveDeduction: (id: string) => void;
  onDeductionChange: (id: string, field: string, value: string) => void;
  taxType: 'individual' | 'business';
}

const DeductionsForm = ({
  deductions,
  onAddDeduction,
  onRemoveDeduction,
  onDeductionChange,
  taxType,
}: DeductionsFormProps) => {
  const deductionTypes = taxType === 'individual'
    ? [
        { value: 'medical', label: 'Medical Expenses' },
        { value: 'education', label: 'Education Expenses' },
        { value: 'charitable', label: 'Charitable Donations' },
        { value: 'mortgage', label: 'Mortgage Interest' },
        { value: 'pension', label: 'Pension Contributions' },
        { value: 'other', label: 'Other Deductions' },
      ]
    : [
        { value: 'operating', label: 'Operating Expenses' },
        { value: 'salaries', label: 'Salaries & Wages' },
        { value: 'rent', label: 'Rent & Utilities' },
        { value: 'depreciation', label: 'Depreciation' },
        { value: 'interest', label: 'Interest Expenses' },
        { value: 'other', label: 'Other Deductions' },
      ];

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon name="ReceiptPercentIcon" size={24} variant="outline" className="text-accent" />
          </div>
          <h2 className="font-heading font-semibold text-xl">Deductions & Expenses</h2>
        </div>
        <button
          type="button"
          onClick={onAddDeduction}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
        >
          <Icon name="PlusIcon" size={20} variant="outline" />
          <span className="text-sm font-medium">Add Deduction</span>
        </button>
      </div>

      <div className="space-y-4">
        {deductions.map((deduction, index) => (
          <div key={deduction.id} className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Deduction {index + 1}</span>
              {deductions.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveDeduction(deduction.id)}
                  className="text-error hover:text-error/80 transition-smooth"
                >
                  <Icon name="TrashIcon" size={20} variant="outline" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type <span className="text-error">*</span>
                </label>
                <select
                  value={deduction.type}
                  onChange={(e) => onDeductionChange(deduction.id, 'type', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                >
                  <option value="">Select type</option>
                  {deductionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={deduction.description}
                  onChange={(e) => onDeductionChange(deduction.id, 'description', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount (FCFA) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={deduction.amount}
                  onChange={(e) => onDeductionChange(deduction.id, 'amount', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {deductions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="ReceiptPercentIcon" size={48} variant="outline" className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No deductions added yet. Click "Add Deduction" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default DeductionsForm;