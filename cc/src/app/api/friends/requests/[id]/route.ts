import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const updateRequestSchema = z.object({
  action: z.enum(['accept', 'reject']),
});

// PATCH /api/friends/requests/[id] - 요청 수락/거절
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
    const validatedData = updateRequestSchema.parse(body);

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: '친구 요청을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    if (friendRequest.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: '이 요청에 대한 권한이 없습니다' },
        { status: 403 }
      );
    }

    if (friendRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: '이미 처리된 요청입니다' },
        { status: 400 }
      );
    }

    if (validatedData.action === 'accept') {
      // 요청 수락: 친구 관계 생성 및 요청 상태 변경
      await prisma.$transaction([
        prisma.friendRequest.update({
          where: { id },
          data: { status: 'ACCEPTED' },
        }),
        // 양방향 친구 관계 생성
        prisma.friend.create({
          data: {
            userId: friendRequest.senderId,
            friendId: friendRequest.receiverId,
          },
        }),
        prisma.friend.create({
          data: {
            userId: friendRequest.receiverId,
            friendId: friendRequest.senderId,
          },
        }),
      ]);

      return NextResponse.json({ message: '친구 요청을 수락했습니다' });
    } else {
      // 요청 거절
      await prisma.friendRequest.update({
        where: { id },
        data: { status: 'REJECTED' },
      });

      return NextResponse.json({ message: '친구 요청을 거절했습니다' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update friend request error:', error);
    return NextResponse.json(
      { error: '친구 요청 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
