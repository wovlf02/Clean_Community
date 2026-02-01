'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import './toggle-switch.css';

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  onLabel?: string;
  offLabel?: string;
}

export function ToggleSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  size = 'lg',
  showLabels = true,
  onLabel = 'ON',
  offLabel = 'OFF',
}: ToggleSwitchProps) {
  const handleClick = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'toggle-switch',
        `toggle-switch--${size}`,
        checked && 'toggle-switch--checked',
        disabled && 'toggle-switch--disabled'
      )}
    >
      <span className="toggle-switch__track">
        {showLabels && (
          <>
            <span className="toggle-switch__label toggle-switch__label--on">
              {onLabel}
            </span>
            <span className="toggle-switch__label toggle-switch__label--off">
              {offLabel}
            </span>
          </>
        )}
        <span className="toggle-switch__thumb" />
      </span>
    </button>
  );
}
