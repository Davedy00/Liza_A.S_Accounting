'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

/* ------------------ TYPES ------------------ */

interface UserProfile {
  id: string;
  updated_at?: string;
  full_name?: string;
  name?: string;
  email?: string;
  role?: string;
  account_type?: string;
  business_name?: string;
  phone?: string;
  [key: string]: any;
}

type SignUpMetadata = {
  full_name?: string;
  phone?: string;
  business_name?: string;
  account_type?: string;
  role?: string;
};

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
  isAuthenticated: boolean;
}

/* ------------------ CONTEXT ------------------ */

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

/* ------------------ PROVIDER ------------------ */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  /* ---------- OAuth ---------- */

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { data, error };
    } catch {
      return { error: { message: 'Network error during Google sign in.' } };
    }
  };

  /* ---------- Profile Ops ---------- */

  const profileOperations = {
    async load(userId: string) {
      if (!userId) return;
      setProfileLoading(true);

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        let { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                full_name:
                  authUser?.user_metadata?.full_name ||
                  authUser?.user_metadata?.name,
                email: authUser?.email,
                phone: authUser?.phone || null,
              },
            ])
            .select()
            .single();

          if (!createError) profileData = newProfile;
        }

        if (profileData) setUserProfile(profileData);
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setProfileLoading(false);
      }
    },

    clear() {
      setUserProfile(null);
      setProfileLoading(false);
    },
  };

  /* ---------- Auth State ---------- */

  const authStateHandlers = {
    onChange: (_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) profileOperations.load(session.user.id);
      else profileOperations.clear();
    },
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      authStateHandlers.onChange('SIGNED_IN' as AuthChangeEvent, session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(authStateHandlers.onChange);

    return () => subscription?.unsubscribe();
  }, []);

  /* ---------- Auth Actions ---------- */

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch {
      return { error: { message: 'Network error. Please try again.' } };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: SignUpMetadata
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { data, error };
    } catch {
      return { error: { message: 'Network error during registration.' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        profileOperations.clear();
      }
      return { error };
    } catch {
      return { error: { message: 'Network error. Please try again.' } };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: { message: 'No user logged in' } };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (!error) setUserProfile(data);
      return { data, error };
    } catch {
      return { error: { message: 'Network error. Please try again.' } };
    }
  };

  /* ---------- Context Value ---------- */

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
