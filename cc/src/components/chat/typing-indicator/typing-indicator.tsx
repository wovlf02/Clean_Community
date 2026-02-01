'use client';

import { cn } from '@/lib/utils';
import './typing-indicator.css';

interface TypingIndicatorProps {
  users: { userId: string; nickname: string }[];
  className?: string;
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const displayText =
    users.length === 1
      ? `${users[0].nickname}님이 입력 중`
      : users.length === 2
        ? `${users[0].nickname}님, ${users[1].nickname}님이 입력 중`
        : `${users[0].nickname}님 외 ${users.length - 1}명이 입력 중`;

  return (
    <div className={cn('typing-indicator', className)}>
      <div className="typing-indicator__dots">
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
      </div>
      <span>{displayText}</span>
    </div>
  );
}
