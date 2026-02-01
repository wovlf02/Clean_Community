import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/users/search - 사용자 검색
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
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: '검색어는 2자 이상 입력해주세요' },
        { status: 400 }
      );
    }

    // 사용자 검색 (본인 제외)
    const users = await prisma.user.findMany({
      where: {
        id: { not: session.user.id },
        deletedAt: null,
        OR: [
          { nickname: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        nickname: true,
        image: true,
        bio: true,
        isOnline: true,
      },
      take: limit,
    });

    // 각 사용자의 친구 상태 확인
    const usersWithFriendStatus = await Promise.all(
      users.map(async (user) => {
        // 친구 여부
        const isFriend = await prisma.friend.findFirst({
          where: {
            userId: session.user.id,
            friendId: user.id,
          },
        });

        // 친구 요청 여부 (내가 보낸)
        const sentRequest = await prisma.friendRequest.findFirst({
          where: {
            senderId: session.user.id,
            receiverId: user.id,
            status: 'PENDING',
          },
        });

        // 친구 요청 여부 (받은)
        const receivedRequest = await prisma.friendRequest.findFirst({
          where: {
            senderId: user.id,
            receiverId: session.user.id,
            status: 'PENDING',
          },
        });

        return {
          ...user,
          friendStatus: isFriend
            ? 'friend'
            : sentRequest
            ? 'pending_sent'
            : receivedRequest
            ? 'pending_received'
            : 'none',
        };
      })
    );

    return NextResponse.json(usersWithFriendStatus);
  } catch (error) {
    console.error('Search users error:', error);
    return NextResponse.json(
      { error: '사용자 검색 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
