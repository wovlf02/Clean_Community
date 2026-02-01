'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import './skeletons.css';

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* 썸네일 */}
      <Skeleton className="h-48 w-full rounded-none" />

      <CardHeader className="pb-2">
        {/* 카테고리 배지 */}
        <Skeleton className="h-5 w-16 rounded-full" />
        {/* 제목 */}
        <Skeleton className="h-6 w-4/5 mt-2" />
      </CardHeader>

      <CardContent className="pb-3">
        {/* 본문 미리보기 */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* 통계 */}
        <div className="flex gap-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </CardFooter>
    </Card>
  );
}
