import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/friends/[id] - 친구 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 친구 관계 확인
    const friendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: session.user.id, friendId: id },
          { userId: id, friendId: session.user.id },
        ],
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: '친구 관계를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 양방향 친구 관계 삭제
    await prisma.friend.deleteMany({
      where: {
        OR: [
          { userId: session.user.id, friendId: id },
          { userId: id, friendId: session.user.id },
        ],
      },
    });

    return NextResponse.json({ message: '친구가 삭제되었습니다' });
  } catch (error) {
    console.error('Delete friend error:', error);
    return NextResponse.json(
      { error: '친구 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
