import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/chat/rooms - 채팅방 목록
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            leftAt: null,
          },
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
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            content: true,
            createdAt: true,
            sender: {
              select: { nickname: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 상대방 정보 추가 및 포맷팅
    const formattedRooms = rooms.map((room: typeof rooms[number]) => {
      const otherParticipants = room.participants.filter(
        (p: typeof room.participants[number]) => p.user.id !== session.user.id
      );
      const lastMessage = room.messages[0];

      return {
        id: room.id,
        type: room.type,
        name: room.type === 'DM' ? otherParticipants[0]?.user.nickname : room.name,
        participants: otherParticipants.map((p: typeof room.participants[number]) => p.user),
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              senderName: lastMessage.sender.nickname,
            }
          : null,
        createdAt: room.createdAt,
      };
    });

    return NextResponse.json(formattedRooms);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    return NextResponse.json(
      { error: '채팅방 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

const createRoomSchema = z.object({
  participantIds: z.array(z.string()).min(1, '참여자를 선택해주세요'),
  type: z.enum(['DM', 'GROUP']).default('DM'),
  name: z.string().optional(),
});

// POST /api/chat/rooms - 채팅방 생성
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
    const validatedData = createRoomSchema.parse(body);

    // 1:1 채팅인 경우 기존 채팅방 확인
    if (validatedData.type === 'DM' && validatedData.participantIds.length === 1) {
      const existingRoom = await prisma.chatRoom.findFirst({
        where: {
          type: 'DM',
          AND: [
            {
              participants: {
                some: { userId: session.user.id, leftAt: null },
              },
            },
            {
              participants: {
                some: { userId: validatedData.participantIds[0], leftAt: null },
              },
            },
          ],
        },
      });

      if (existingRoom) {
        return NextResponse.json({ id: existingRoom.id, existing: true });
      }
    }

    const room = await prisma.chatRoom.create({
      data: {
        type: validatedData.type,
        name: validatedData.name,
        participants: {
          create: [
            { userId: session.user.id },
            ...validatedData.participantIds.map((id) => ({ userId: id })),
          ],
        },
      },
      select: {
        id: true,
        type: true,
        name: true,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create chat room error:', error);
    return NextResponse.json(
      { error: '채팅방 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
