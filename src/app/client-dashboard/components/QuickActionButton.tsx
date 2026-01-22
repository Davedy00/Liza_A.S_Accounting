import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

const QuickActionButton = ({ title, description, icon, href, color }: QuickActionButtonProps) => {
  return (
    <Link
      href={href}
      className="group bg-card rounded-lg border border-border p-6 hover:shadow-md hover:border-primary/30 transition-smooth"
    >
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon name={icon as any} size={24} variant="outline" className="text-white" />
      </div>
      <h3 className="font-heading font-semibold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
};

export default QuickActionButton;