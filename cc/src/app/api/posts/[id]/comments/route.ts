import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeText, transformAnalysisResult } from '@/lib/ai-client';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id]/comments - 댓글 목록
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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

    const comments = await prisma.comment.findMany({
      where: { postId: id, parentId: null, deletedAt: null },
      select: {
        id: true,
        content: true,
        isEdited: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
        replies: {
          where: { deletedAt: null },
          select: {
            id: true,
            content: true,
            isEdited: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                nickname: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: '댓글 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

const createCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요'),
  parentId: z.string().optional(),
});

// POST /api/posts/[id]/comments - 댓글 작성
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
    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    const post = await prisma.post.findUnique({
      where: { id, deletedAt: null },
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 대댓글인 경우 부모 댓글 확인
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validatedData.parentId, deletedAt: null },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: '부모 댓글을 찾을 수 없습니다' },
          { status: 404 }
        );
      }
    }

    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          postId: id,
          authorId: session.user.id,
          content: validatedData.content,
          parentId: validatedData.parentId,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
      }),
      prisma.post.update({
        where: { id },
        data: { commentCount: { increment: 1 } },
      }),
    ]);

    // AI 감정분석 (백그라운드에서 실행)
    let analysis = null;
    try {
      const analysisResponse = await analyzeText(validatedData.content);
      analysis = transformAnalysisResult(analysisResponse);
    } catch (analysisError) {
      console.warn('AI analysis failed:', analysisError);
    }

    return NextResponse.json({ comment, analysis }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: '댓글 작성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
