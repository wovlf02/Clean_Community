import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const readMessageSchema = z.object({
  messageIds: z.array(z.string()).optional(),
});

// PATCH /api/chat/rooms/[id]/read - 메시지 읽음 처리
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id: roomId } = await params;
    const body = await request.json().catch(() => ({}));
    // Validate the request body (currently optional, for future extensions)
    readMessageSchema.parse(body);

    // 채팅방 참여자 확인
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId: roomId,
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

    const now = new Date();

    // 참여자의 lastReadAt 업데이트 및 unreadCount 초기화
    await prisma.chatParticipant.update({
      where: { id: participant.id },
      data: {
        lastReadAt: now,
        unreadCount: 0,
      },
    });

    // 해당 채팅방의 전체 참여자 수와 읽은 참여자 수 계산을 위한 정보 반환
    const allParticipants = await prisma.chatParticipant.findMany({
      where: {
        chatRoomId: roomId,
        leftAt: null,
      },
      select: {
        userId: true,
        lastReadAt: true,
      },
    });

    // 최신 메시지 조회
    const latestMessage = await prisma.message.findFirst({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true },
    });

    // 각 참여자가 읽었는지 여부 계산
    const readStatus = allParticipants.map((p) => ({
      userId: p.userId,
      hasRead: latestMessage
        ? p.lastReadAt && p.lastReadAt >= latestMessage.createdAt
        : true,
    }));

    const unreadCount = readStatus.filter((r) => !r.hasRead).length;

    return NextResponse.json({
      success: true,
      lastReadAt: now.toISOString(),
      unreadCount,
      readStatus,
    });
  } catch (error) {
    console.error('Read message error:', error);
    return NextResponse.json(
      { error: '읽음 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// GET /api/chat/rooms/[id]/read - 메시지별 읽지 않은 사용자 수 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id: roomId } = await params;
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    // 채팅방 참여자 확인
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId: roomId,
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

    // 모든 참여자 조회
    const allParticipants = await prisma.chatParticipant.findMany({
      where: {
        chatRoomId: roomId,
        leftAt: null,
      },
      select: {
        userId: true,
        lastReadAt: true,
      },
    });

    // 특정 메시지에 대한 읽지 않은 사용자 수
    if (messageId) {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        select: { createdAt: true, senderId: true },
      });

      if (!message) {
        return NextResponse.json(
          { error: '메시지를 찾을 수 없습니다' },
          { status: 404 }
        );
      }

      // 메시지 발신자를 제외한 참여자 중 읽지 않은 사용자 수
      const unreadCount = allParticipants.filter(
        (p) =>
          p.userId !== message.senderId &&
          (!p.lastReadAt || p.lastReadAt < message.createdAt)
      ).length;

      return NextResponse.json({
        messageId,
        unreadCount,
        totalParticipants: allParticipants.length,
      });
    }

    // 전체 읽음 상태 반환
    return NextResponse.json({
      participants: allParticipants.map((p) => ({
        userId: p.userId,
        lastReadAt: p.lastReadAt?.toISOString() || null,
      })),
    });
  } catch (error) {
    console.error('Get read status error:', error);
    return NextResponse.json(
      { error: '읽음 상태 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
