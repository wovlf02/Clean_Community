'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import './skeletons.css';

interface MessageSkeletonProps {
  isOwn?: boolean;
}

export function MessageSkeleton({ isOwn = false }: MessageSkeletonProps) {
  return (
    <div className={cn('flex gap-2', isOwn && 'flex-row-reverse')}>
      {/* 상대방 아바타 (내 메시지가 아닐 때만) */}
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}

      <div className={cn('space-y-1', isOwn && 'items-end')}>
        {/* 메시지 버블 */}
        <Skeleton
          className={cn(
            'h-10 rounded-2xl',
            isOwn ? 'w-40 rounded-br-sm' : 'w-48 rounded-bl-sm'
          )}
        />
        {/* 시간 */}
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
