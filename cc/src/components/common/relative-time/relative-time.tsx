'use client';

import { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/lib/utils';

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
  /**
   * 자동 갱신 간격 (밀리초)
   * 기본값: 60000 (1분)
   * 0으로 설정 시 자동 갱신 비활성화
   */
  refreshInterval?: number;
}

/**
 * 클라이언트에서 상대 시간을 계산하는 컴포넌트
 * 서버 사이드 렌더링 시 빌드 타임에 고정되는 문제를 방지합니다.
 *
 * @example
 * <RelativeTime date="2026-01-30T10:00:00Z" />
 * // 출력: "3분 전", "2시간 전" 등
 */
export function RelativeTime({
  date,
  className,
  refreshInterval = 60000,
}: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 자동 갱신
  useEffect(() => {
    if (refreshInterval === 0) return;

    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  // SSR 시에는 절대 시간 표시 (hydration mismatch 방지)
  if (!mounted) {
    return (
      <time dateTime={new Date(date).toISOString()} className={className}>
        {new Date(date).toLocaleDateString('ko-KR')}
      </time>
    );
  }

  return (
    <time dateTime={new Date(date).toISOString()} className={className}>
      {formatRelativeTime(date)}
    </time>
  );
}
