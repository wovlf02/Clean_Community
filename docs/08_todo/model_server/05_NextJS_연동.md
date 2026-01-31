# 05. Next.js 연동

**관련 문서**: [시스템 설계](../../03_architecture/system-design.md) | [기능 요구사항](../../02_requirements/functional.md) | [개발 환경 설정](../../06_development/setup.md)

---

## 📋 개요

이 문서는 FastAPI 감정분석 서버와 Next.js 웹 애플리케이션의 연동 방법을 설명합니다.

---

## ✅ 체크리스트

- [ ] Next.js AIService 클래스 구현
- [ ] 환경 변수 설정 (AI_SERVER_URL)
- [ ] 게시글 작성 시 감정분석 연동
- [ ] 댓글/대댓글 작성 시 감정분석 연동
- [ ] 채팅 메시지 전송 시 감정분석 연동
- [ ] 경고 모달 컴포넌트 구현
- [ ] 에러 핸들링 구현

---

## 1. 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          감정분석 연동 흐름                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. 사용자가 게시글/댓글/메시지 작성 후 전송 버튼 클릭                        │
│                              │                                               │
│                              ▼                                               │
│  2. Next.js 클라이언트 → Next.js API Route                                  │
│                              │                                               │
│                              ▼                                               │
│  3. API Route → FastAPI 감정분석 서버 (POST /analyze)                        │
│                              │                                               │
│                              ▼                                               │
│  4. 분석 결과 수신                                                          │
│                              │                                               │
│              ┌───────────────┴───────────────┐                              │
│              │                               │                              │
│        is_toxic: false                 is_toxic: true                       │
│              │                               │                              │
│              ▼                               ▼                              │
│        정상 등록/전송                   경고 모달 표시                        │
│                                              │                              │
│                              ┌───────────────┴───────────────┐              │
│                              │                               │              │
│                        [수정하기]                     [그대로 처리]          │
│                              │                               │              │
│                              ▼                               ▼              │
│                      에디터로 돌아감                 등록 + 모니터링 등록     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 환경 변수 설정

### 2.1 Next.js 환경 변수

```env
# apps/web/.env.local

# AI 감정분석 서버 URL
AI_SERVER_URL=http://localhost:8000

# 또는 프로덕션
# AI_SERVER_URL=https://ai.your-domain.com
```

---

## 3. AIService 구현

### 3.1 lib/services/ai-service.ts

```typescript
// types
interface AnalyzeResult {
  text: string;
  labels: string[];
  scores: Record<string, number>;
  is_toxic: boolean;
}

interface AnalyzeResponse {
  data: AnalyzeResult;
  message: string;
}

interface BatchAnalyzeResponse {
  data: AnalyzeResult[];
  count: number;
  message: string;
}

// 혐오 라벨 한글 매핑
export const HATE_LABELS = {
  "여성/가족": "여성/가족 관련 혐오 표현",
  "남성": "남성 관련 혐오 표현",
  "성소수자": "성소수자 관련 혐오 표현",
  "인종/국적": "인종/국적 관련 혐오 표현",
  "연령": "연령 관련 혐오 표현",
  "지역": "지역 관련 혐오 표현",
  "종교": "종교 관련 혐오 표현",
  "기타 혐오": "기타 혐오 표현",
  "악플/욕설": "악플 및 욕설"
} as const;

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.AI_SERVER_URL || 'http://localhost:8000';
  }

  /**
   * 단일 텍스트 감정분석
   */
  async analyze(text: string): Promise<AnalyzeResult> {
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`AI 분석 실패: ${response.statusText}`);
    }

    const result: AnalyzeResponse = await response.json();
    return result.data;
  }

  /**
   * 배치 텍스트 감정분석
   */
  async analyzeBatch(texts: string[]): Promise<AnalyzeResult[]> {
    const response = await fetch(`${this.baseUrl}/analyze/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texts }),
    });

    if (!response.ok) {
      throw new Error(`AI 배치 분석 실패: ${response.statusText}`);
    }

    const result: BatchAnalyzeResponse = await response.json();
    return result.data;
  }

  /**
   * 헬스체크
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const aiService = new AIService();
export type { AnalyzeResult };
```

---

## 4. API Route 구현

### 4.1 app/api/analyze/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: '텍스트가 필요합니다.' } },
        { status: 400 }
      );
    }

    const result = await aiService.analyze(text);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('감정분석 오류:', error);
    return NextResponse.json(
      { error: { code: 'ANALYSIS_ERROR', message: '분석 중 오류가 발생했습니다.' } },
      { status: 500 }
    );
  }
}
```

---

## 5. 경고 모달 컴포넌트

### 5.1 components/modals/ToxicWarningModal.tsx

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { AnalyzeResult, HATE_LABELS } from '@/lib/services/ai-service';

interface ToxicWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onProceed: () => void;
  analyzeResult: AnalyzeResult | null;
}

export function ToxicWarningModal({
  isOpen,
  onClose,
  onEdit,
  onProceed,
  analyzeResult
}: ToxicWarningModalProps) {
  if (!analyzeResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            혐오 표현 감지
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            작성하신 내용에서 다음과 같은 표현이 감지되었습니다:
          </p>
          
          <ul className="space-y-2">
            {analyzeResult.labels.map((label) => (
              <li 
                key={label} 
                className="flex items-center justify-between bg-amber-50 p-2 rounded"
              >
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-gray-500">
                  {Math.round(analyzeResult.scores[label] * 100)}% 확률
                </span>
              </li>
            ))}
          </ul>
          
          <p className="text-sm text-gray-500">
            수정하시거나, 그대로 등록하실 수 있습니다.
            그대로 등록 시 모니터링 대상으로 등록됩니다.
          </p>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            수정하기
          </Button>
          <Button 
            variant="destructive" 
            onClick={onProceed}
          >
            그대로 등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 6. 게시글 작성 연동

### 6.1 hooks/useContentAnalysis.ts

```typescript
import { useState } from 'react';
import { aiService, AnalyzeResult } from '@/lib/services/ai-service';

export function useContentAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const analyzeContent = async (text: string): Promise<boolean> => {
    setIsAnalyzing(true);
    
    try {
      const result = await aiService.analyze(text);
      setAnalyzeResult(result);
      
      if (result.is_toxic) {
        setShowWarning(true);
        return false; // 악성 콘텐츠 감지됨
      }
      
      return true; // 정상 콘텐츠
    } catch (error) {
      console.error('분석 오류:', error);
      // 분석 실패 시 기본적으로 통과 처리 (서비스 가용성 우선)
      return true;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeWarning = () => {
    setShowWarning(false);
    setAnalyzeResult(null);
  };

  return {
    isAnalyzing,
    analyzeResult,
    showWarning,
    analyzeContent,
    closeWarning,
    setShowWarning
  };
}
```

### 6.2 게시글 작성 폼 사용 예시

```tsx
'use client';

import { useState } from 'react';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';
import { ToxicWarningModal } from '@/components/modals/ToxicWarningModal';

export function PostWriteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isForcedSubmit, setIsForcedSubmit] = useState(false);
  
  const {
    isAnalyzing,
    analyzeResult,
    showWarning,
    analyzeContent,
    closeWarning
  } = useContentAnalysis();

  const handleSubmit = async () => {
    // 강제 제출이 아닌 경우 분석 수행
    if (!isForcedSubmit) {
      const isClean = await analyzeContent(content);
      
      if (!isClean) {
        // 경고 모달 표시됨, 여기서 중단
        return;
      }
    }

    // 게시글 등록 API 호출
    await submitPost({
      title,
      content,
      isFlagged: isForcedSubmit // 모니터링 대상 여부
    });
    
    // 초기화
    setIsForcedSubmit(false);
  };

  const handleEdit = () => {
    closeWarning();
    // 에디터로 포커스 이동
  };

  const handleProceed = () => {
    setIsForcedSubmit(true);
    closeWarning();
    handleSubmit(); // 강제 제출
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
      />
      
      <button type="submit" disabled={isAnalyzing}>
        {isAnalyzing ? '분석 중...' : '등록하기'}
      </button>

      <ToxicWarningModal
        isOpen={showWarning}
        onClose={closeWarning}
        onEdit={handleEdit}
        onProceed={handleProceed}
        analyzeResult={analyzeResult}
      />
    </form>
  );
}
```

---

## 7. 채팅 메시지 연동

### 7.1 채팅 메시지 전송 시 분석

```typescript
// hooks/useChatWithAnalysis.ts

import { useContentAnalysis } from './useContentAnalysis';
import { useSocket } from './useSocket';

export function useChatWithAnalysis(roomId: string) {
  const { socket, sendMessage } = useSocket();
  const { analyzeContent, showWarning, analyzeResult, closeWarning } = useContentAnalysis();
  
  const [pendingMessage, setPendingMessage] = useState('');

  const handleSendMessage = async (message: string) => {
    const isClean = await analyzeContent(message);
    
    if (!isClean) {
      setPendingMessage(message);
      return; // 경고 모달 표시됨
    }
    
    // 정상 메시지 전송
    sendMessage({
      roomId,
      content: message,
      isFlagged: false
    });
  };

  const handleProceedWithMessage = () => {
    // 강제 전송 (모니터링 대상으로 표시)
    sendMessage({
      roomId,
      content: pendingMessage,
      isFlagged: true
    });
    
    setPendingMessage('');
    closeWarning();
  };

  return {
    handleSendMessage,
    handleProceedWithMessage,
    showWarning,
    analyzeResult,
    closeWarning
  };
}
```

---

## 8. 모니터링 대상 플래그

악성 표현 감지 후 "그대로 등록"을 선택한 콘텐츠는 백엔드에서 모니터링 대상으로 표시됩니다.

### 8.1 데이터 구조

```typescript
// 게시글/댓글/메시지 생성 요청
interface CreateContentRequest {
  content: string;
  isFlagged?: boolean;          // 모니터링 대상 여부
  flaggedLabels?: string[];     // 감지된 혐오 라벨
  flaggedScores?: Record<string, number>; // 라벨별 신뢰도
}
```

### 8.2 관리자 대시보드 연동

모니터링 대상 콘텐츠는 관리자 대시보드에서 조회 및 관리됩니다.

- **참고**: FR-43 (악성 콘텐츠 모니터링)

---

## 🔗 참고 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| 시스템 설계 | `docs/03_architecture/system-design.md` | AI 감정분석 흐름 다이어그램 |
| 기능 요구사항 | `docs/02_requirements/functional.md` | FR-40~44 (AI 감정분석) |
| 개발 환경 설정 | `docs/06_development/setup.md` | 환경 변수 설정 |
| 화면 설계 - 게시글 | `docs/05_screens/02_board/post-write-page.md` | 게시글 작성 화면 |
| 화면 설계 - 채팅 | `docs/05_screens/03_chat/chat-room-page.md` | 채팅 화면 |

---

**이전 문서**: [04_API_엔드포인트.md](./04_API_엔드포인트.md)  
**다음 문서**: [06_테스트_및_검증.md](./06_테스트_및_검증.md)
