import { NextRequest, NextResponse } from 'next/server';
import { analyzeText, transformAnalysisResult } from '@/lib/ai-client';
import { z } from 'zod';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

const analyzeSchema = z.object({
  text: z.string().min(1, '분석할 텍스트를 입력해주세요'),
});

/**
 * POST /api/analyze - 텍스트 감정분석 프록시
 * AI 서버로 요청을 전달하고 결과를 반환
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = analyzeSchema.parse(body);

    const response = await analyzeText(text);
    const result = transformAnalysisResult(response);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Analyze text error:', error);

    // AI 서버 연결 실패 시
    if (error instanceof Error && error.message.includes('AI')) {
      return NextResponse.json(
        { error: 'AI 서버 연결에 실패했습니다' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: '텍스트 분석 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
