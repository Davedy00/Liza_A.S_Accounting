'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface AuthenticationFormProps {
  className?: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  phoneNumber?: string;
  businessName?: string;
  acceptTerms?: boolean;
  rememberMe?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  phoneNumber?: string;
  businessName?: string;
  acceptTerms?: string;
  general?: string;
}

const AuthenticationForm = ({ className = '' }: AuthenticationFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
  const { signIn, signUp, signInWithGoogle } = useAuth(); // 2. Destructure auth functions
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'individual' | 'business'>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    businessName: '',
    acceptTerms: false,
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    // Clear general errors when switching between login/register
    setErrors({});
  }, [activeTab]);

  useEffect(() => {
    let strength = 0;
    const val = formData.password;
    if (val.length > 6) strength += 25;
    if (/[A-Z]/.test(val)) strength += 25;
    if (/[0-9]/.test(val)) strength += 25;
    if (/[^A-Za-z0-9]/.test(val)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  
    // Clear specific field error when user starts typing again
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // --- ADDED: Basic Validation Logic ---
  const validateLoginForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms';
    if (accountType === 'business' && !formData.businessName) newErrors.businessName = 'Business name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [loadingAction, setLoadingAction] = useState<'login' | 'register' | 'google' | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Run validation first
    if (!validateLoginForm()) return;
  
    setLoadingAction('login');
    setErrors({}); // Clear previous errors
    
    try {
      const { email, password } = formData;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
      if (error) {
        setErrors({ general: getErrorMessage(error) });
        return;
      }
  
      // 2. Handle Routing
      const userRole = data.user?.user_metadata?.role;
      router.push(userRole === 'admin' ? '/admin-dashboard' : '/client-dashboard');
      
    } catch (err) {
      setErrors({ general: "An unexpected error occurred." });
    } finally {
      setLoadingAction(null); 
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
  
    if (!validateRegisterForm()) {
      setErrors(prev => ({ ...prev, general: "Please fix the errors below." }));
      return; 
    }
  
    setLoadingAction('register');
  
    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          phone: formData.phoneNumber,
          business_name: formData.businessName,
          account_type: accountType,
          role: 'client',
        }
      );
      
  
      if (error) {
        setErrors({ general: getErrorMessage(error) });
      } else if (data.user && !data.session) {
        // SUCCESS: User created, but email confirmation is required
        setErrors({ 
          general: "Account created successfully! Please check your email inbox (and spam folder) for a confirmation link to activate your account." 
        });
        
        // Clear password field for security
        setFormData(prev => ({ ...prev, password: '' }));
      } else if (data.session) {
        // This would only happen if you turned confirmation OFF later
        router.push('/client-dashboard');
      }
    } catch (err: any) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGoogleAuth = async () => {
    setLoadingAction('google');
    const { error } = await signInWithGoogle();
    if (error) {
      setErrors({ general: error.message });
      setLoadingAction(null);
    }
  };

  const getErrorMessage = (err: any) => {
    const message = err.message?.toLowerCase() || "";
    if (message.includes('invalid login credentials')) return "Incorrect email or password.";
    if (message.includes('user already registered')) return "An account with this email already exists.";
    if (message.includes('rate limit')) return "Too many attempts. Please try again later.";
    return err.message || "An unexpected error occurred.";
  };

  const getPasswordStrengthColor = (): string => {
    if (passwordStrength < 25) return 'bg-error';
    if (passwordStrength < 50) return 'bg-warning';
    if (passwordStrength < 75) return 'bg-secondary';
    return 'bg-success';
  };

  const getPasswordStrengthText = (): string => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  if (!isHydrated) {
    return (
      <div className={`w-full max-w-6xl mx-auto ${className}`}>
        <div className="bg-card rounded-lg shadow-lg p-8 animate-pulse">
          <div className="h-12 bg-muted rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Panel - Login */}
          <div className={`p-8 lg:p-12 ${activeTab === 'login' ? 'bg-card' : 'bg-muted/30'}`}>
            <div className="mb-8">
              <h2 className="font-heading text-3xl font-bold text-primary mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to access your account and manage your tax services</p>
            </div>

            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                {errors.general && (
                  <div className="p-4 bg-error/10 border border-error rounded-md">
                    <div className="flex items-start space-x-3">
                      <Icon name="ExclamationTriangleIcon" size={20} variant="solid" className="text-error flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-error whitespace-pre-line">{errors.general}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input type="email" id="login-email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 pl-11 border ${  errors.email ? 'border-error' : 'border-input'  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`} placeholder="your.email@example.com"  autoComplete="email" />
                    <Icon name="EnvelopeIcon" size={20} variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} id="login-password"  name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-3 pl-11 pr-11 border ${
                        errors.password ? 'border-error' : 'border-input'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`} placeholder="Enter your password" autoComplete="current-password"/>
                    <Icon name="LockClosedIcon" size={20}  variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"  />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth">
                      <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} variant="outline" />
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange}  className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-primary"/>
                    <span className="text-sm text-foreground">Remember me</span>
                  </label>
                  <Link href="#" className="text-sm text-primary hover:text-primary/80 transition-smooth">  Forgot password?  </Link>
                </div>

                <button  
  type="submit"  
  disabled={loadingAction !== null}  // Changed from isLoading
  className="..."
>
  {loadingAction === 'login' ? ( // Changed from isLoading
    <>
      <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
      <span>Signing in...</span>
    </>
  ) : (
    <>
      <Icon name="ArrowRightOnRectangleIcon" size={20} variant="outline" />
      <span>Sign In</span>
    </>
  )}
</button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full py-3 border border-input rounded-md font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-primary hover:text-primary/80 font-medium transition-smooth"
                    >
                      Create account
                    </button>
                  </p>
                </div>
              </form>
            )}

            {activeTab === 'register' && (
              <div className="text-center py-12">
                <Icon name="UserPlusIcon" size={48} variant="outline" className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-6">Switch to registration to create your account</p>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-smooth"
                >  Go to Registration
                </button>
              </div>
            )}
          </div>

          {/* Right Panel - Registration */}
          <div className={`p-8 lg:p-12 ${activeTab === 'register' ? 'bg-card' : 'bg-muted/30'}`}>
            <div className="mb-8">
              <h2 className="font-heading text-3xl font-bold text-primary mb-2">Create Account</h2>
              <p className="text-muted-foreground">Join A.S Accounting and simplify your tax compliance journey</p>
            </div>

            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-6">
                {errors.general && (
      <div className="p-4 bg-error/10 border border-error rounded-md">
        <div className="flex items-start space-x-3">
          <Icon name="ExclamationTriangleIcon" size={20} variant="solid" className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error whitespace-pre-line">{errors.general}</p>
        </div>
      </div>
    )}
                <div className="flex space-x-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-smooth ${
                      accountType === 'individual' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name="UserIcon" size={20} variant="outline" className="inline-block mr-2" />
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('business')}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-smooth ${
                      accountType === 'business' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name="BuildingOfficeIcon" size={20} variant="outline" className="inline-block mr-2" />
                    Business
                  </button>
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                    Full Name {accountType === 'business' && '(Contact Person)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border ${
                        errors.fullName ? 'border-error' : 'border-input'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`}
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                    <Icon
                      name="UserIcon"
                      size={20}
                      variant="outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                  {errors.fullName && <p className="mt-1 text-sm text-error">{errors.fullName}</p>}
                </div>

                {accountType === 'business' && (
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-foreground mb-2">
                      Business Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-11 border ${
                          errors.businessName ? 'border-error' : 'border-input'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`}
                        placeholder="Your Business Name"
                        autoComplete="organization"
                      />
                      <Icon
                        name="BuildingOfficeIcon"
                        size={20}
                        variant="outline"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                    {errors.businessName && <p className="mt-1 text-sm text-error">{errors.businessName}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border ${
                        errors.email ? 'border-error' : 'border-input'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                    />
                    <Icon
                      name="EnvelopeIcon"
                      size={20}
                      variant="outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 border ${
                        errors.phoneNumber ? 'border-error' : 'border-input'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`}
                      placeholder="+237 6XX XXX XXX"
                      autoComplete="tel"
                    />
                    <Icon
                      name="PhoneIcon"
                      size={20}
                      variant="outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-sm text-error">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 pr-11 border ${
                        errors.password ? 'border-error' : 'border-input'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                    />
                    <Icon
                      name="LockClosedIcon"
                      size={20}
                      variant="outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} variant="outline" />
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Password strength:</span>
                        <span className={`text-xs font-medium ${passwordStrength >= 75 ? 'text-success' : passwordStrength >= 50 ? 'text-secondary' : passwordStrength >= 25 ? 'text-warning' : 'text-error'}`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="mt-1 text-sm text-error">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-11 pr-11 border ${
                        errors.confirmPassword ? 'border-error' : 'border-input'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth`}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                    <Icon
                      name="LockClosedIcon"
                      size={20}
                      variant="outline"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      <Icon name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} variant="outline" />
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className={`w-5 h-5 mt-0.5 text-primary border-input rounded focus:ring-2 focus:ring-primary ${
                        errors.acceptTerms ? 'border-error' : ''
                      }`}
                    />
                    <span className="text-sm text-foreground">
                      I agree to the{' '}
                      <Link href="#" className="text-primary hover:text-primary/80 transition-smooth">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" className="text-primary hover:text-primary/80 transition-smooth">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="mt-1 text-sm text-error">{errors.acceptTerms}</p>}
                </div>

                <button
  type="submit"
  disabled={loadingAction !== null}
  className="w-full py-3 bg-primary text-primary-foreground rounded-md font-heading font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center space-x-2"
>
  {loadingAction === 'register' ? (
    <>
      <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
      <span>Creating account...</span>
    </>
  ) : (
    <>
      <Icon name="UserPlusIcon" size={20} variant="outline" />
      <span>Create Account</span>
    </>
  )}
</button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                <button type="button" onClick={handleGoogleAuth} disabled={isLoading} className="w-full py-3 border border-input rounded-md font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center space-x-3" >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-primary hover:text-primary/80 font-medium transition-smooth"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            )}

            {activeTab === 'login' && (
              <div className="text-center py-12">
                <Icon name="ArrowRightOnRectangleIcon" size={48} variant="outline" className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-6">Switch to login to access your account</p>
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-smooth"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationForm;