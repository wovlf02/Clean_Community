'use client';

import { cn } from '@/lib/utils';
import './online-indicator.css';

interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function OnlineIndicator({
  isOnline,
  size = 'md',
  className,
  children,
}: OnlineIndicatorProps) {
  return (
    <div className={cn('online-indicator', className)}>
      {children}
      <span
        className={cn(
          'online-indicator__dot',
          isOnline
            ? 'online-indicator__dot--online'
            : 'online-indicator__dot--offline',
          size === 'sm' && 'online-indicator__dot--sm',
          size === 'lg' && 'online-indicator__dot--lg'
        )}
      />
    </div>
  );
}
