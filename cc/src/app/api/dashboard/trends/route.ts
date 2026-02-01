import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/dashboard/trends - 커뮤니티 트렌드
export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 병렬로 데이터 조회
    const [
      activeUsersCount,
      todayPostsCount,
      todayCommentsCount,
      recentPosts,
    ] = await Promise.all([
      // 24시간 내 활동 사용자 (온라인 또는 최근 활동)
      prisma.user.count({
        where: {
          OR: [
            { isOnline: true },
            { lastSeenAt: { gte: yesterday } },
          ],
        },
      }),
      // 오늘 작성된 게시글
      prisma.post.count({
        where: {
          createdAt: { gte: todayStart },
          deletedAt: null,
        },
      }),
      // 오늘 작성된 댓글
      prisma.comment.count({
        where: {
          createdAt: { gte: todayStart },
          deletedAt: null,
        },
      }),
      // 최근 게시글 (키워드 추출용)
      prisma.post.findMany({
        where: {
          createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
          deletedAt: null,
        },
        select: {
          title: true,
        },
        take: 100,
      }),
    ]);

    // 키워드 추출 (간단한 빈도 분석)
    const keywordMap = new Map<string, number>();
    const stopWords = ['의', '가', '이', '은', '는', '를', '에', '에서', '로', '으로', '와', '과', '도', '만', '만큼'];

    recentPosts.forEach((post) => {
      // 한글 단어 추출 (2글자 이상)
      const words = post.title.match(/[가-힣]{2,}/g) || [];
      words.forEach((word) => {
        if (!stopWords.includes(word)) {
          keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
        }
      });
    });

    // 상위 10개 키워드
    const popularKeywords = Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    return NextResponse.json({
      activeUsers: activeUsersCount,
      todayPosts: todayPostsCount,
      todayComments: todayCommentsCount,
      popularKeywords,
      updatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Get trends error:', error);
    return NextResponse.json(
      { error: '트렌드 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
