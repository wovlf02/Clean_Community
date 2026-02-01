import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const readSchema = z.object({
  notificationIds: z.array(z.string()).optional(),
  all: z.boolean().optional(),
});

// PATCH /api/notifications/read - 읽음 처리
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
    const validatedData = readSchema.parse(body);

    if (validatedData.all) {
      // 모든 알림 읽음 처리
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      });
    } else if (validatedData.notificationIds && validatedData.notificationIds.length > 0) {
      // 특정 알림 읽음 처리
      await prisma.notification.updateMany({
        where: {
          id: { in: validatedData.notificationIds },
          userId: session.user.id,
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ message: '읽음 처리되었습니다' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Mark notifications read error:', error);
    return NextResponse.json(
      { error: '읽음 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
