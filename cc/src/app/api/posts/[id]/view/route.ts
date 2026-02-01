import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 조회 기록을 메모리에 저장 (프로덕션에서는 Redis 사용 권장)
const viewCache = new Map<string, number>();
const VIEW_COOLDOWN = 24 * 60 * 60 * 1000; // 24시간

// 캐시 정리 (메모리 누수 방지)
function cleanupCache() {
  const now = Date.now();
  for (const [key, timestamp] of viewCache.entries()) {
    if (now - timestamp > VIEW_COOLDOWN) {
      viewCache.delete(key);
    }
  }
}

// POST /api/posts/[id]/view - 조회수 증가 (중복 방지)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();

    // 중복 방지를 위한 키 생성
    // 로그인 사용자: userId, 비로그인: IP + UserAgent
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const viewKey = session?.user?.id
      ? `${id}:user:${session.user.id}`
      : `${id}:ip:${ip}:${userAgent.slice(0, 50)}`;

    // 캐시 정리 (100개 초과 시)
    if (viewCache.size > 100) {
      cleanupCache();
    }

    // 중복 조회 체크
    const lastView = viewCache.get(viewKey);
    if (lastView && Date.now() - lastView < VIEW_COOLDOWN) {
      // 24시간 내 중복 조회 - 조회수 증가 없이 현재 값 반환
      const post = await prisma.post.findUnique({
        where: { id, deletedAt: null },
        select: { viewCount: true },
      });
      return NextResponse.json({
        viewCount: post?.viewCount || 0,
        duplicate: true,
      });
    }

    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 조회수 증가
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    // 조회 기록 저장
    viewCache.set(viewKey, Date.now());

    return NextResponse.json({
      viewCount: updatedPost.viewCount,
      duplicate: false,
    });
  } catch (error) {
    console.error('Increment view count error:', error);
    return NextResponse.json(
      { error: '조회수 증가 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
