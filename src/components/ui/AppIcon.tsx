'use client';

import React from 'react';
// ⚠️ FIX: Import from 'next/dynamic', NOT 'react'
import dynamic from 'next/dynamic'; 
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

type IconVariant = 'outline' | 'solid';

interface IconProps {
    name: string;
    variant?: IconVariant;
    size?: number;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const AppIcon = ({
    name,
    variant = 'outline',
    size = 24,
    className = '',
    onClick,
    disabled = false,
}: IconProps) => {

    // Next.js dynamic requires the import path to be somewhat explicit
    const IconComponent = React.useMemo(() => {
        return dynamic(
            () => import(`@heroicons/react/24/${variant}`).then((mod) => {
                const icon = mod[name as keyof typeof mod];
                // If icon name is wrong, return the fallback
                return icon || QuestionMarkCircleIcon;
            }),
            { 
                ssr: false, // Icons don't need to be server-rendered for better performance
                loading: () => <div style={{ width: size, height: size }} className="animate-pulse bg-zinc-200 rounded-full dark:bg-zinc-800" />
            }
        ) as React.ComponentType<any>;
    }, [name, variant, size]);

    return (
        <IconComponent
            width={size}
            height={size}
            className={`${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
            onClick={disabled ? undefined : onClick}
        />
    );
};

export default AppIcon;