'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import './user-avatar.css';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  onClick?: () => void;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({
  src,
  name,
  size = 'md',
  isOnline,
  onClick,
  className,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        'user-avatar',
        `user-avatar--${size}`,
        onClick && 'user-avatar--clickable',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <Avatar className="user-avatar__image">
        <AvatarImage src={src || undefined} alt={name} />
        <AvatarFallback className="user-avatar__fallback">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {isOnline !== undefined && (
        <span
          className={cn(
            'user-avatar__status',
            isOnline ? 'user-avatar__status--online' : 'user-avatar__status--offline'
          )}
          aria-label={isOnline ? '온라인' : '오프라인'}
        />
      )}
    </div>
  );
}
