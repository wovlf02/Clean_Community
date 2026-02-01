import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요'),
});

// PATCH /api/comments/[id] - 댓글 수정
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCommentSchema.parse(body);

    const comment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '수정 권한이 없습니다' },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: validatedData.content,
        isEdited: true,
      },
      select: {
        id: true,
        content: true,
        isEdited: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update comment error:', error);
    return NextResponse.json(
      { error: '댓글 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - 댓글 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
      include: { post: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: '삭제 권한이 없습니다' },
        { status: 403 }
      );
    }

    await prisma.$transaction([
      prisma.comment.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
      prisma.post.update({
        where: { id: comment.postId },
        data: { commentCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ message: '댓글이 삭제되었습니다' });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { error: '댓글 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
