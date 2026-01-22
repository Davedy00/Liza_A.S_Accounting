'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  updated_at?: string;
  full_name?: string;     // Matches your DB column
  name?: string;          // You mentioned you have both, but full_name is usually the primary
  email?: string;
  role?: string;
  account_type?: string;
  business_name?: string; // Matches your DB column
  phone?: string;         // Matches your DB column
  [key: string]: any;     // Keep this as a safety net
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, metadata: any) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  // ... (signInWithGoogle and profileOperations stay the same)

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error during Google sign in.' } };
    }
  };

  const profileOperations = {
    async load(userId: string) {
      if (!userId) return;
      setProfileLoading(true);
      try {
        // 1. Fetch the Auth User (Google data)
        const { data: { user: authUser } } = await supabase.auth.getUser();
    
        // 2. Try to get the profile from the table
        let { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
    
        // 3. IF NO PROFILE EXISTS, CREATE IT NOW
        if (error && error.code === 'PGRST116') { // PGRST116 means "No rows found"
          console.log("No profile found, creating one for:", authUser?.email);
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: userId, 
                full_name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name,
                email: authUser?.email,
                phone: authUser?.phone || null // Google doesn't usually provide phone
              }
            ])
            .select()
            .single();
    
          if (!createError) profileData = newProfile;
        }
    
        if (profileData) {
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error('Profile load error:', error);
      } finally {
        setProfileLoading(false);
      }
    },
    clear() {
      setUserProfile(null)
      setProfileLoading(false)
    },
  }

  // 2. UPDATE THE TYPE HERE FROM string | null TO AuthChangeEvent
  const authStateHandlers = {
    onChange: (event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) profileOperations.load(session.user.id)
      else profileOperations.clear()
    },
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Since getSession doesn't provide an event, we can pass 'SIGNED_IN' 
      // or 'INITIAL_SESSION' as a placeholder if needed, 
      // but 'SIGNED_IN' is a safe default for logic.
      authStateHandlers.onChange('SIGNED_IN' as AuthChangeEvent, session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(authStateHandlers.onChange)

    return () => subscription?.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      return { data, error }
    } catch {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            // Supabase adds these to the user's raw_user_meta_data
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { error: { message: 'Network error during registration.' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        profileOperations.clear()
      }
      return { error }
    } catch {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: { message: 'No user logged in' } }
    try {
      const { data, error } = await supabase
        .from('profiles') // Changed from user_profiles
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      if (!error) setUserProfile(data)
      return { data, error }
    } catch {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signInWithGoogle, // Add this line
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
