import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/friends/requests - 친구 요청 목록
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received'; // 'sent' | 'received'

    const requests = await prisma.friendRequest.findMany({
      where: {
        ...(type === 'sent'
          ? { senderId: session.user.id }
          : { receiverId: session.user.id }),
        status: 'PENDING',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Get friend requests error:', error);
    return NextResponse.json(
      { error: '친구 요청 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

const createRequestSchema = z.object({
  receiverId: z.string().min(1, '요청 대상을 선택해주세요'),
});

// POST /api/friends/requests - 친구 요청 보내기
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
    const validatedData = createRequestSchema.parse(body);

    if (validatedData.receiverId === session.user.id) {
      return NextResponse.json(
        { error: '자신에게 친구 요청을 보낼 수 없습니다' },
        { status: 400 }
      );
    }

    // 이미 친구인지 확인
    const existingFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: session.user.id, friendId: validatedData.receiverId },
          { userId: validatedData.receiverId, friendId: session.user.id },
        ],
      },
    });

    if (existingFriend) {
      return NextResponse.json(
        { error: '이미 친구입니다' },
        { status: 400 }
      );
    }

    // 이미 요청이 있는지 확인
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: validatedData.receiverId },
          { senderId: validatedData.receiverId, receiverId: session.user.id },
        ],
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: '이미 친구 요청이 있습니다' },
        { status: 400 }
      );
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: session.user.id,
        receiverId: validatedData.receiverId,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        receiver: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    return NextResponse.json(friendRequest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Create friend request error:', error);
    return NextResponse.json(
      { error: '친구 요청 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
