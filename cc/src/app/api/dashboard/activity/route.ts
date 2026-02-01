import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/dashboard/activity - 주간 활동
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 주간 게시글 및 댓글 수 조회
    const [posts, comments] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: userId,
          createdAt: { gte: oneWeekAgo },
          deletedAt: null,
        },
        select: { createdAt: true },
      }),
      prisma.comment.findMany({
        where: {
          authorId: userId,
          createdAt: { gte: oneWeekAgo },
          deletedAt: null,
        },
        select: { createdAt: true },
      }),
    ]);

    // 요일별 집계
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const activityByDay: Record<string, { posts: number; comments: number }> = {};

    days.forEach((day) => {
      activityByDay[day] = { posts: 0, comments: 0 };
    });

    posts.forEach((post: { createdAt: Date }) => {
      const dayName = days[post.createdAt.getDay()];
      activityByDay[dayName].posts++;
    });

    comments.forEach((comment: { createdAt: Date }) => {
      const dayName = days[comment.createdAt.getDay()];
      activityByDay[dayName].comments++;
    });

    // 월요일부터 시작하는 배열로 변환
    const orderedDays = ['월', '화', '수', '목', '금', '토', '일'];
    const weeklyActivity = orderedDays.map((day) => ({
      day,
      posts: activityByDay[day].posts,
      comments: activityByDay[day].comments,
    }));

    return NextResponse.json(weeklyActivity);
  } catch (error) {
    console.error('Get weekly activity error:', error);
    return NextResponse.json(
      { error: '주간 활동 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
