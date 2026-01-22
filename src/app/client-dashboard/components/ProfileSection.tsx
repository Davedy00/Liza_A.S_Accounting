'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  tinNumber: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  avatar: string;
  avatarAlt: string;
  memberSince: string;
}

interface ProfileSectionProps {
  profile: UserProfile;
}

const ProfileSection = ({ profile }: ProfileSectionProps) => {
  const statusConfig = {
    verified: { label: 'Verified', color: 'bg-success/10 text-success border-success/20', icon: 'CheckBadgeIcon' as const },
    pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20', icon: 'ClockIcon' as const },
    unverified: { label: 'Unverified', color: 'bg-error/10 text-error border-error/20', icon: 'ExclamationCircleIcon' as const },
  };

  // 1. SAFETY GUARD: If profile data hasn't arrived, show a loading skeleton
  if (!profile || !profile.verificationStatus) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-muted mb-4"></div>
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  // 2. Lookup config with a fallback to 'unverified' to prevent crash
  const config = statusConfig[profile.verificationStatus] || statusConfig.unverified;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg text-foreground">Profile</h2>
        <Link
          href="/client-dashboard?section=profile"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
        >
          Edit Profile
        </Link>
      </div>

      <div className="flex items-start space-x-4 mb-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border">
            <AppImage
              src={profile.avatar}
              alt={profile.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {profile.verificationStatus === 'verified' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
              <Icon name="CheckIcon" size={14} variant="solid" className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-base text-foreground mb-1">{profile.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{profile.businessName}</p>
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <Icon name={config.icon} size={12} variant="solid" />
            <span>{config.label}</span>
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Icon name="EnvelopeIcon" size={16} variant="outline" className="text-muted-foreground" />
          <span className="text-sm text-foreground truncate">{profile.email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="PhoneIcon" size={16} variant="outline" className="text-muted-foreground" />
          <span className="text-sm text-foreground">{profile.phone}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="IdentificationIcon" size={16} variant="outline" className="text-muted-foreground" />
          <span className="text-sm text-foreground">TIN: {profile.tinNumber}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Icon name="CalendarIcon" size={16} variant="outline" className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Member since {profile.memberSince}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;