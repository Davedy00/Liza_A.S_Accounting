import React, { useState } from 'react';

export default function EditProfileForm({ profile, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    full_name: profile.name || '',
    phone: profile.phone === 'Not provided' ? '' : profile.phone,
    business_name: profile.businessName === 'No Business Name' ? '' : profile.businessName,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <input 
          className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
          value={formData.full_name}
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <input 
          className="w-full p-2 bg-background border border-border rounded-md"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Business Name</label>
        <input 
          className="w-full p-2 bg-background border border-border rounded-md"
          value={formData.business_name}
          onChange={(e) => setFormData({...formData, business_name: e.target.value})}
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}