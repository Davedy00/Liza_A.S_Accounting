import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface IncomeSource {
  id: string;
  type: string;
  description: string;
  amount: string;
}

interface IncomeSourcesFormProps {
  incomeSources: IncomeSource[];
  onAddSource: () => void;
  onRemoveSource: (id: string) => void;
  onSourceChange: (id: string, field: string, value: string) => void;
  taxType: 'individual' | 'business';
}

const IncomeSourcesForm = ({
  incomeSources,
  onAddSource,
  onRemoveSource,
  onSourceChange,
  taxType,
}: IncomeSourcesFormProps) => {
  const incomeTypes = taxType === 'individual'
    ? [
        { value: 'salary', label: 'Salary/Wages' },
        { value: 'business', label: 'Business Income' },
        { value: 'rental', label: 'Rental Income' },
        { value: 'investment', label: 'Investment Income' },
        { value: 'pension', label: 'Pension' },
        { value: 'other', label: 'Other Income' },
      ]
    : [
        { value: 'sales', label: 'Sales Revenue' },
        { value: 'services', label: 'Service Revenue' },
        { value: 'rental', label: 'Rental Income' },
        { value: 'investment', label: 'Investment Income' },
        { value: 'other', label: 'Other Revenue' },
      ];

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Icon name="BanknotesIcon" size={24} variant="outline" className="text-secondary" />
          </div>
          <h2 className="font-heading font-semibold text-xl">
            {taxType === 'individual' ? 'Income Sources' : 'Revenue Sources'}
          </h2>
        </div>
        <button
          type="button"
          onClick={onAddSource}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
        >
          <Icon name="PlusIcon" size={20} variant="outline" />
          <span className="text-sm font-medium">Add Source</span>
        </button>
      </div>

      <div className="space-y-4">
        {incomeSources.map((source, index) => (
          <div key={source.id} className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Source {index + 1}</span>
              {incomeSources.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveSource(source.id)}
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
                  value={source.type}
                  onChange={(e) => onSourceChange(source.id, 'type', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                >
                  <option value="">Select type</option>
                  {incomeTypes.map((type) => (
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
                  value={source.description}
                  onChange={(e) => onSourceChange(source.id, 'description', e.target.value)}
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
                  value={source.amount}
                  onChange={(e) => onSourceChange(source.id, 'amount', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {incomeSources.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="BanknotesIcon" size={48} variant="outline" className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No income sources added yet. Click "Add Source" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default IncomeSourcesForm;