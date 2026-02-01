import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/posts/[id]/like - 좋아요 토글
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: id,
        },
      },
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ liked: false, likeCount: post.likeCount - 1 });
    } else {
      // 좋아요 추가
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: session.user.id,
            postId: id,
          },
        }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({ liked: true, likeCount: post.likeCount + 1 });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { error: '좋아요 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
