'use client';

import { SentimentLabel } from '@/types/sentiment';
import { cn } from '@/lib/utils';
import './sentiment-badge.css';

interface SentimentBadgeProps {
  label: SentimentLabel;
  showText?: boolean;
  className?: string;
}

const labelConfig = {
  safe: { emoji: '😊', text: '안전' },
  warning: { emoji: '😟', text: '주의' },
  danger: { emoji: '⚠️', text: '경고' },
};

export function SentimentBadge({
  label,
  showText = true,
  className,
}: SentimentBadgeProps) {
  const config = labelConfig[label];

  return (
    <span
      className={cn('sentiment-badge', `sentiment-badge--${label}`, className)}
    >
      <span className="sentiment-badge__icon">{config.emoji}</span>
      {showText && <span>{config.text}</span>}
    </span>
  );
}
