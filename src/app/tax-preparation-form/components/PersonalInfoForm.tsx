import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PersonalInfoFormProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  taxType: 'individual' | 'business';
}

const PersonalInfoForm = ({ formData, onInputChange, errors, taxType }: PersonalInfoFormProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="UserCircleIcon" size={24} variant="outline" className="text-primary" />
        </div>
        <h2 className="font-heading font-semibold text-xl">
          {taxType === 'individual' ? 'Personal Information' : 'Business Information'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
            {taxType === 'individual' ? 'Full Name' : 'Business Name'} <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName || ''}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.fullName ? 'border-error' : 'border-input'
            }`}
            placeholder={taxType === 'individual' ? 'Enter your full name' : 'Enter business name'}
          />
          {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="tin" className="block text-sm font-medium text-foreground mb-2">
            Tax Identification Number (TIN) <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="tin"
            value={formData.tin || ''}
            onChange={(e) => onInputChange('tin', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.tin ? 'border-error' : 'border-input'
            }`}
            placeholder="Enter TIN"
          />
          {errors.tin && <p className="text-error text-xs mt-1">{errors.tin}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email || ''}
            onChange={(e) => onInputChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.email ? 'border-error' : 'border-input'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
            Phone Number <span className="text-error">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => onInputChange('phone', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.phone ? 'border-error' : 'border-input'
            }`}
            placeholder="+237 6XX XXX XXX"
          />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>

        {taxType === 'business' && (
          <>
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-foreground mb-2">
                Business Type <span className="text-error">*</span>
              </label>
              <select
                id="businessType"
                value={formData.businessType || ''}
                onChange={(e) => onInputChange('businessType', e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.businessType ? 'border-error' : 'border-input'
                }`}
              >
                <option value="">Select business type</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="sarl">SARL (Limited Liability Company)</option>
                <option value="sa">SA (Public Limited Company)</option>
                <option value="other">Other</option>
              </select>
              {errors.businessType && <p className="text-error text-xs mt-1">{errors.businessType}</p>}
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-foreground mb-2">
                Business Registration Number
              </label>
              <input
                type="text"
                id="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={(e) => onInputChange('registrationNumber', e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                placeholder="Enter registration number"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
            Address <span className="text-error">*</span>
          </label>
          <textarea
            id="address"
            value={formData.address || ''}
            onChange={(e) => onInputChange('address', e.target.value)}
            rows={3}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.address ? 'border-error' : 'border-input'
            }`}
            placeholder="Enter complete address"
          />
          {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;