'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ChatRoomPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  // 스플릿 뷰로 리다이렉트
  useEffect(() => {
    router.replace(`/chat?roomId=${id}`);
  }, [id, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p>리다이렉트 중...</p>
    </div>
  );
}
