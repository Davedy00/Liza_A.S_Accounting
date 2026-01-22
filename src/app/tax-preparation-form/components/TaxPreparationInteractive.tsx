'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import FormProgressIndicator from './FormProgressIndicator';
import TaxTypeSelector from './TaxTypeSelector';
import PersonalInfoForm from './PersonalInfoForm';
import IncomeSourcesForm from './IncomeSourcesForm';
import DeductionsForm from './DeductionsForm';
import DocumentUploadForm from './DocumentUploadForm';
import TaxCalculationSummary from './TaxCalculationSummary';

interface FormData {
  fullName: string;
  tin: string;
  email: string;
  phone: string;
  address: string;
  businessType?: string;
  registrationNumber?: string;
}

interface IncomeSource {
  id: string;
  type: string;
  description: string;
  amount: string;
}

interface Deduction {
  id: string;
  type: string;
  description: string;
  amount: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
}

const TaxPreparationInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [taxType, setTaxType] = useState<'individual' | 'business'>('individual');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    tin: '',
    email: '',
    phone: '',
    address: '',
  });
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: '1', type: '', description: '', amount: '' },
  ]);
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: '1', type: '', description: '', amount: '' },
  ]);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  const steps = [
    { id: 1, label: 'Tax Type' },
    { id: 2, label: 'Personal Info' },
    { id: 3, label: 'Income' },
    { id: 4, label: 'Deductions' },
    { id: 5, label: 'Documents' },
    { id: 6, label: 'Review' },
  ];

  useEffect(() => {
    setIsHydrated(true);
    const savedData = localStorage.getItem('taxFormDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTaxType(parsed.taxType || 'individual');
        setFormData(parsed.formData || formData);
        setIncomeSources(parsed.incomeSources || incomeSources);
        setDeductions(parsed.deductions || deductions);
        setCurrentStep(parsed.currentStep || 1);
        setLastSaved(parsed.lastSaved || '');
      } catch (error) {
        console.error('Error loading saved draft:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const saveTimeout = setTimeout(() => {
      setIsSaving(true);
      const draftData = {
        taxType,
        formData,
        incomeSources,
        deductions,
        currentStep,
        lastSaved: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      };
      localStorage.setItem('taxFormDraft', JSON.stringify(draftData));
      setLastSaved(draftData.lastSaved);
      setTimeout(() => setIsSaving(false), 500);
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [taxType, formData, incomeSources, deductions, currentStep, isHydrated]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddIncomeSource = () => {
    const newId = (incomeSources.length + 1).toString();
    setIncomeSources([...incomeSources, { id: newId, type: '', description: '', amount: '' }]);
  };

  const handleRemoveIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter((source) => source.id !== id));
  };

  const handleIncomeSourceChange = (id: string, field: string, value: string) => {
    setIncomeSources(
      incomeSources.map((source) =>
        source.id === id ? { ...source, [field]: value } : source
      )
    );
  };

  const handleAddDeduction = () => {
    const newId = (deductions.length + 1).toString();
    setDeductions([...deductions, { id: newId, type: '', description: '', amount: '' }]);
  };

  const handleRemoveDeduction = (id: string) => {
    setDeductions(deductions.filter((deduction) => deduction.id !== id));
  };

  const handleDeductionChange = (id: string, field: string, value: string) => {
    setDeductions(
      deductions.map((deduction) =>
        deduction.id === id ? { ...deduction, [field]: value } : deduction
      )
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: UploadedDocument[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      }));
      setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setUploadedDocuments(uploadedDocuments.filter((doc) => doc.id !== id));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      const newDocuments: UploadedDocument[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      }));
      setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.tin.trim()) newErrors.tin = 'TIN is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (taxType === 'business' && !formData.businessType) {
        newErrors.businessType = 'Business type is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const calculateTotals = () => {
    const totalIncome = incomeSources.reduce(
      (sum, source) => sum + (parseFloat(source.amount) || 0),
      0
    );
    const totalDeductions = deductions.reduce(
      (sum, deduction) => sum + (parseFloat(deduction.amount) || 0),
      0
    );
    const taxableIncome = Math.max(totalIncome - totalDeductions, 0);
    const estimatedTax = taxableIncome * 0.15;

    return { totalIncome, totalDeductions, taxableIncome, estimatedTax };
  };

  const handleSubmit = () => {
    localStorage.removeItem('taxFormDraft');
    router.push('/payment-processing');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="ArrowPathIcon" size={48} className="mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  const { totalIncome, totalDeductions, taxableIncome, estimatedTax } = calculateTotals();

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Tax Preparation Form</h1>
              <p className="text-muted-foreground">Complete your tax return with our guided process</p>
            </div>
            {lastSaved && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {isSaving ? (
                  <>
                    <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon name="CheckCircleIcon" size={16} className="text-success" />
                    <span>Saved at {lastSaved}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <FormProgressIndicator currentStep={currentStep} totalSteps={steps.length} steps={steps} />

        <div className="space-y-6">
          {currentStep === 1 && (
            <TaxTypeSelector selectedType={taxType} onTypeChange={setTaxType} />
          )}

          {currentStep === 2 && (
            <PersonalInfoForm
              formData={formData}
              onInputChange={handleInputChange}
              errors={errors}
              taxType={taxType}
            />
          )}

          {currentStep === 3 && (
            <IncomeSourcesForm
              incomeSources={incomeSources}
              onAddSource={handleAddIncomeSource}
              onRemoveSource={handleRemoveIncomeSource}
              onSourceChange={handleIncomeSourceChange}
              taxType={taxType}
            />
          )}

          {currentStep === 4 && (
            <DeductionsForm
              deductions={deductions}
              onAddDeduction={handleAddDeduction}
              onRemoveDeduction={handleRemoveDeduction}
              onDeductionChange={handleDeductionChange}
              taxType={taxType}
            />
          )}

          {currentStep === 5 && (
            <DocumentUploadForm
              uploadedDocuments={uploadedDocuments}
              onFileSelect={handleFileSelect}
              onRemoveDocument={handleRemoveDocument}
              isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <TaxCalculationSummary
                totalIncome={totalIncome}
                totalDeductions={totalDeductions}
                taxableIncome={taxableIncome}
                estimatedTax={estimatedTax}
              />

              <div className="bg-card rounded-lg shadow-sm p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Review Your Information</h3>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <span className="text-muted-foreground">Tax Type:</span>
                      <p className="font-medium text-foreground capitalize">{taxType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium text-foreground">{formData.fullName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">TIN:</span>
                      <p className="font-medium text-foreground">{formData.tin}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium text-foreground">{formData.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <span className="text-muted-foreground">Income Sources:</span>
                      <p className="font-medium text-foreground">{incomeSources.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Deductions:</span>
                      <p className="font-medium text-foreground">{deductions.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Documents:</span>
                      <p className="font-medium text-foreground">{uploadedDocuments.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-border rounded-md text-foreground hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeftIcon" size={20} variant="outline" />
            <span className="font-medium">Previous</span>
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
            >
              <span className="font-medium">Next Step</span>
              <Icon name="ChevronRightIcon" size={20} variant="outline" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-8 py-3 bg-conversion text-conversion-foreground rounded-md hover:bg-conversion/90 shadow-md hover:shadow-lg transition-smooth"
            >
              <span className="font-semibold">Proceed to Payment</span>
              <Icon name="ArrowRightIcon" size={20} variant="outline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxPreparationInteractive;