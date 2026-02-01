import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/chat/rooms/[id] - 채팅방 상세
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

    const room = await prisma.chatRoom.findFirst({
      where: {
        id,
        participants: {
          some: { userId: session.user.id, leftAt: null },
        },
      },
      select: {
        id: true,
        type: true,
        name: true,
        createdAt: true,
        participants: {
          where: { leftAt: null },
          select: {
            user: {
              select: {
                id: true,
                nickname: true,
                image: true,
                isOnline: true,
                lastSeenAt: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: '채팅방을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    const formattedRoom = {
      id: room.id,
      type: room.type,
      name: room.name,
      participants: room.participants.map((p: { user: typeof room.participants[number]['user'] }) => p.user),
      createdAt: room.createdAt,
    };

    return NextResponse.json(formattedRoom);
  } catch (error) {
    console.error('Get chat room error:', error);
    return NextResponse.json(
      { error: '채팅방 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
