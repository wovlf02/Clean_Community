'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import './stat-card.css';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__title">{title}</span>
        <div className="stat-card__icon">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="stat-card__value">{value.toLocaleString()}</div>
      {change !== undefined && (
        <div
          className={cn(
            'stat-card__change',
            isPositive && 'stat-card__change--up',
            isNegative && 'stat-card__change--down'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : isNegative ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
          <span>
            {isPositive && '+'}
            {change}% {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}
