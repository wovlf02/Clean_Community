import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// GET /api/users/me - 현재 사용자 조회
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        image: true,
        bio: true,
        role: true,
        isOnline: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            friends: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: '사용자 정보 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

const updateUserSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다').optional(),
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다').optional(),
  bio: z.string().max(200, '자기소개는 200자 이하여야 합니다').optional(),
  image: z.string().url().optional().nullable(),
});

// PATCH /api/users/me - 프로필 수정
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // 닉네임 중복 확인
    if (validatedData.nickname) {
      const existingNickname = await prisma.user.findFirst({
        where: {
          nickname: validatedData.nickname,
          NOT: { id: session.user.id },
        },
      });

      if (existingNickname) {
        return NextResponse.json(
          { error: '이미 사용 중인 닉네임입니다' },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        image: true,
        bio: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Update user error:', error);
    return NextResponse.json(
      { error: '프로필 수정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/me - 계정 탈퇴 (Soft Delete)
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: '계정이 삭제되었습니다' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: '계정 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
