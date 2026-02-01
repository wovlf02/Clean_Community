import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeText, transformAnalysisResult } from '@/lib/ai-client';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/chat/rooms/[id]/messages - 메시지 목록
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 채팅방 참여 확인
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId: id,
          userId: session.user.id,
        },
      },
    });

    if (!participant || participant.leftAt) {
      return NextResponse.json(
        { error: '채팅방에 참여하고 있지 않습니다' },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { chatRoomId: id },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        type: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });

    const nextCursor = messages.length === limit ? messages[messages.length - 1]?.id : null;

    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: '메시지 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

const createMessageSchema = z.object({
  content: z.string().min(1, '메시지 내용을 입력해주세요'),
  type: z.enum(['TEXT', 'IMAGE', 'EMOJI']).default('TEXT'),
});

// POST /api/chat/rooms/[id]/messages - 메시지 저장
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
    const validatedData = createMessageSchema.parse(body);

    // 채팅방 참여 확인
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId: id,
          userId: session.user.id,
        },
      },
    });

    if (!participant || participant.leftAt) {
      return NextResponse.json(
        { error: '채팅방에 참여하고 있지 않습니다' },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        chatRoomId: id,
        senderId: session.user.id,
        content: validatedData.content,
        type: validatedData.type,
      },
      select: {
        id: true,
        content: true,
        type: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });

    // AI 감정분석 (텍스트 메시지만 분석)
    let analysis = null;
    if (validatedData.type === 'TEXT') {
      try {
        const analysisResponse = await analyzeText(validatedData.content);
        analysis = transformAnalysisResult(analysisResponse);
      } catch (analysisError) {
        console.warn('AI analysis failed:', analysisError);
      }
    }

    return NextResponse.json({ message, analysis }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create message error:', error);
    return NextResponse.json(
      { error: '메시지 저장 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
