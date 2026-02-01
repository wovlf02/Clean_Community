'use client';

import { cn } from '@/lib/utils';
import './category-filter.css';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  { value: 'all', label: '전체' },
  { value: 'general', label: '일반' },
  { value: 'qna', label: 'Q&A' },
  { value: 'info', label: '정보공유' },
  { value: 'daily', label: '일상' },
];

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category.value}
          type="button"
          className={cn(
            'category-filter__item',
            value === category.value && 'category-filter__item--active'
          )}
          onClick={() => onChange(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
