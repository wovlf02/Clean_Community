import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 동적 렌더링 강제 (빌드 시 정적 생성 방지)
export const dynamic = 'force-dynamic';

// GET /api/friends - 친구 목록
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const friends = await prisma.friend.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        createdAt: true,
        friend: {
          select: {
            id: true,
            nickname: true,
            image: true,
            bio: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedFriends = friends.map((f) => ({
      id: f.id,
      friendId: f.friend.id,
      nickname: f.friend.nickname,
      image: f.friend.image,
      bio: f.friend.bio,
      isOnline: f.friend.isOnline,
      lastSeenAt: f.friend.lastSeenAt,
      createdAt: f.createdAt,
    }));

    return NextResponse.json(formattedFriends);
  } catch (error) {
    console.error('Get friends error:', error);
    return NextResponse.json(
      { error: '친구 목록 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
