import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: number; label: string; }>;
}

const FormProgressIndicator = ({ currentStep, totalSteps, steps }: FormProgressIndicatorProps) => {
  return (
    <div className="w-full bg-card rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth ${
                  currentStep > step.id
                    ? 'bg-success text-success-foreground'
                    : currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <Icon name="CheckIcon" size={20} variant="solid" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 mt-[-24px]">
                <div
                  className={`h-full rounded transition-smooth ${
                    currentStep > step.id ? 'bg-success' : 'bg-muted'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default FormProgressIndicator;