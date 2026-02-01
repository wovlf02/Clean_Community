import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeText, transformAnalysisResult } from '@/lib/ai-client';
import { z } from 'zod';

// 동적 렌더링 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic';

// GET /api/posts - 게시글 목록 (페이지네이션, 필터, 검색)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(category && { category: category as 'GENERAL' | 'QNA' | 'SHARE' | 'DAILY' }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          viewCount: true,
          likeCount: true,
          commentCount: true,
          thumbnailUrl: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              nickname: true,
              image: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: '게시글 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

const createPostSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100, '제목은 100자 이하여야 합니다'),
  content: z.string().min(1, '내용을 입력해주세요'),
  category: z.enum(['GENERAL', 'QNA', 'SHARE', 'DAILY']),
  thumbnailUrl: z.string().url().optional().nullable(),
});

// POST /api/posts - 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
      },
    });

    // AI 감정분석 (백그라운드에서 실행, 실패해도 게시글 작성은 성공)
    let analysis = null;
    try {
      const textToAnalyze = `${validatedData.title} ${validatedData.content}`;
      const analysisResponse = await analyzeText(textToAnalyze);
      analysis = transformAnalysisResult(analysisResponse);
    } catch (analysisError) {
      console.warn('AI analysis failed:', analysisError);
      // AI 분석 실패해도 게시글은 정상 등록
    }

    return NextResponse.json(
      {
        post,
        analysis,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create post error:', error);
    return NextResponse.json(
      { error: '게시글 작성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
