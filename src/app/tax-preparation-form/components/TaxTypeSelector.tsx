import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TaxTypeSelectorProps {
  selectedType: 'individual' | 'business';
  onTypeChange: (type: 'individual' | 'business') => void;
}

const TaxTypeSelector = ({ selectedType, onTypeChange }: TaxTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <button
        type="button"
        onClick={() => onTypeChange('individual')}
        className={`p-6 rounded-lg border-2 transition-smooth text-left ${
          selectedType === 'individual' ?'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-lg ${
              selectedType === 'individual' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon name="UserIcon" size={24} variant={selectedType === 'individual' ? 'solid' : 'outline'} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg mb-1">Individual Tax Return</h3>
            <p className="text-sm text-muted-foreground">
              For personal income, investments, and individual deductions
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onTypeChange('business')}
        className={`p-6 rounded-lg border-2 transition-smooth text-left ${
          selectedType === 'business' ?'border-primary bg-primary/5' :'border-border bg-card hover:border-primary/50'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-lg ${
              selectedType === 'business' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon name="BuildingOfficeIcon" size={24} variant={selectedType === 'business' ? 'solid' : 'outline'} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg mb-1">Business Tax Return</h3>
            <p className="text-sm text-muted-foreground">
              For SMEs, corporations, and business entities
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default TaxTypeSelector;