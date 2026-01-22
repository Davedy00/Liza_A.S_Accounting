'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/AppIcon';

export default function NewRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: 'Individual Tax Return',
    amount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            client_id: userProfile.id,      // Matches your column name
            client_name: userProfile.name, // Matches your column name
            service_type: formData.serviceType,
            amount: parseFloat(formData.amount),
            status: 'pending'               // Default status
          }
        ]);

      if (error) throw error;
      
      setFormData({ serviceType: 'Individual Tax Return', amount: '' });
      onSuccess(); // Refresh the list in the parent
      alert("Request submitted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-4">
      <h2 className="text-lg font-semibold">New Service Request</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Service Type</label>
        <select 
          className="w-full p-2 rounded border bg-background"
          value={formData.serviceType}
          onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
        >
          <option>Individual Tax Return</option>
          <option>Business Tax Filing</option>
          <option>TIN Registration</option>
          <option>Tax Consultation</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estimated Amount (FCFA)</label>
        <input 
          type="number"
          required
          className="w-full p-2 rounded border bg-background"
          placeholder="e.g. 50000"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}