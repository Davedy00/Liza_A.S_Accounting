'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ConnectionToast() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    supabase.from('_').select('*').limit(1).then(({ error }) => {
      // If we get an error that isn't a network failure, we are connected
      if (error && error.message.includes('fetch')) setStatus('failed');
      else setStatus('ok');
    });
  }, []);

  if (status === 'checking') return null;
  return (
    <div className={`fixed bottom-5 left-5 p-2 rounded border ${status === 'ok' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
      {status === 'ok' ? '✅ Connected to Supabase' : '❌ Supabase Connection Failed'}
    </div>
  );
}