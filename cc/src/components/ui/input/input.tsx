'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import './input.css';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {leftIcon && (
          <div className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'input',
            error && 'input--error',
            leftIcon && 'input--with-left-icon',
            rightIcon && 'input--with-right-icon',
            className
          )}
          ref={ref}
          aria-invalid={error}
          {...props}
        />
        {rightIcon && (
          <div className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
