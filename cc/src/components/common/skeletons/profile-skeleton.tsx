'use client';

import { Skeleton } from '@/components/ui/skeleton';
import './skeletons.css';

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      {/* 프로필 이미지 */}
      <Skeleton className="h-16 w-16 rounded-full" />

      <div className="space-y-2">
        {/* 닉네임 */}
        <Skeleton className="h-5 w-32" />
        {/* 이메일/상태 */}
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
