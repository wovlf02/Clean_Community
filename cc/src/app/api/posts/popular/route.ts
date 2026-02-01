import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/posts/popular - 인기 게시글
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const period = searchParams.get('period') || 'week'; // today, week, month

    // 기간에 따른 필터링
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'week':
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
    }

    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        title: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: { likeCount: 'desc' },
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get popular posts error:', error);
    return NextResponse.json(
      { error: '인기 게시글 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
