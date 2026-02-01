'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import './progress.css';

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  indeterminate?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, size = 'md', variant = 'default', indeterminate, ...props },
    ref
  ) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'progress',
        size !== 'md' && `progress--${size}`,
        variant !== 'default' && `progress--${variant}`,
        indeterminate && 'progress--indeterminate',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="progress__indicator"
        style={
          !indeterminate
            ? { transform: `translateX(-${100 - (value || 0)}%)` }
            : undefined
        }
      />
    </ProgressPrimitive.Root>
  )
);

Progress.displayName = 'Progress';

export { Progress, type ProgressProps };
