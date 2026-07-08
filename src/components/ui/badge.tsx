import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'error' | 'tertiary' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary text-on-primary',
  error: 'bg-error text-on-error',
  tertiary: 'bg-tertiary text-on-tertiary',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
};

const sizeStyles: Record<string, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
};

export function Badge({ children, variant = 'primary', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block font-semibold rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

interface BadgeIconProps {
  children: ReactNode;
  count?: number;
  className?: string;
}

export function BadgeIcon({ children, count, className = '' }: BadgeIconProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-error text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}
