import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/dashboard/stats - 사용자 통계
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

    // 통계 조회
    const [
      totalPosts,
      totalComments,
      totalLikes,
      totalMessages,
    ] = await Promise.all([
      prisma.post.count({
        where: { authorId: userId, deletedAt: null },
      }),
      prisma.comment.count({
        where: { authorId: userId, deletedAt: null },
      }),
      prisma.like.count({
        where: {
          post: { authorId: userId },
        },
      }),
      prisma.message.count({
        where: {
          OR: [
            { senderId: userId },
            {
              chatRoom: {
                participants: {
                  some: { userId, leftAt: null },
                },
              },
            },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      totalPosts,
      totalComments,
      totalLikes,
      totalMessages,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: '통계 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
