'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import './button.css';

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      default: 'btn--default',
      destructive: 'btn--destructive',
      outline: 'btn--outline',
      secondary: 'btn--secondary',
      ghost: 'btn--ghost',
      link: 'btn--link',
    },
    size: {
      sm: 'btn--sm',
      default: 'btn--md',
      lg: 'btn--lg',
      icon: 'btn--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // asChild일 때는 children을 그대로 전달
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          isLoading && 'btn--loading',
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="btn__spinner h-4 w-4" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="btn__icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        <span className="btn__text">{children}</span>
        {!isLoading && rightIcon && (
          <span className="btn__icon-right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
