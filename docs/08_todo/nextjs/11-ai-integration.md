# Phase 11: AI 서버 연동

**관련 문서**: [AI 서버 문서](../../../ai_server/README.md) | [앙상블 모델](../../03_architecture/tech-stack.md)

---

## 📋 개요

FastAPI 기반 AI 모델 서버(8000 포트)와 연동하여 게시글, 댓글, 채팅 메시지의 감정분석 기능을 구현합니다.

**예상 소요 시간**: 2일

**AI 서버 정보**:
- URL: `http://localhost:8000`
- 분석 엔드포인트: `POST /analyze`
- 9개 혐오 카테고리 탐지

---

## ✅ 체크리스트

### 1. AI 서버 클라이언트 설정

#### 1.1 환경 변수 확인

```env
# .env.local
NEXT_PUBLIC_AI_SERVER_URL=http://localhost:8000
AI_SERVER_URL=http://localhost:8000
```

- [ ] 환경 변수 설정

#### 1.2 AI 서버 클라이언트

```typescript
// lib/ai-client.ts

interface AnalyzeRequest {
  text: string;
}

interface AnalyzeResponse {
  text: string;
  analysis: {
    predictions: Record<string, number>;
    detected_categories: string[];
    is_harmful: boolean;
    confidence: number;
  };
}

const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${AI_SERVER_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`AI Server error: ${response.status}`);
  }

  return response.json();
}

// 배치 분석 (여러 텍스트 한 번에)
export async function analyzeTexts(texts: string[]): Promise<AnalyzeResponse[]> {
  const results = await Promise.all(texts.map(analyzeText));
  return results;
}
```

- [ ] AI 서버 클라이언트 생성
- [ ] 에러 처리
- [ ] 타임아웃 설정

#### 1.3 감정분석 결과 타입

```typescript
// types/sentiment.ts

export interface SentimentResult {
  text: string;
  isHarmful: boolean;
  detectedCategories: string[];
  confidence: number;
  predictions: {
    femaleFamily: number;  // 여성/가족
    male: number;          // 남성
    lgbtq: number;         // 성소수자
    raceNationality: number; // 인종/국적
    age: number;           // 연령
    region: number;        // 지역
    religion: number;      // 종교
    otherHate: number;     // 기타 혐오
    insult: number;        // 악플/욕설
  };
}

export type SentimentLabel = 'safe' | 'warning' | 'danger';

export function getSentimentLabel(result: SentimentResult): SentimentLabel {
  if (!result.isHarmful) return 'safe';
  if (result.confidence > 0.8) return 'danger';
  return 'warning';
}

export const categoryLabels: Record<string, string> = {
  femaleFamily: '여성/가족',
  male: '남성',
  lgbtq: '성소수자',
  raceNationality: '인종/국적',
  age: '연령',
  region: '지역',
  religion: '종교',
  otherHate: '기타 혐오',
  insult: '악플/욕설',
};
```

- [ ] SentimentResult 타입 정의
- [ ] 라벨 변환 함수

---

### 2. 게시글 작성 시 감정분석 연동

#### 2.1 API Route에서 분석

```typescript
// app/api/posts/route.ts
import { analyzeText } from '@/lib/ai-client';

export async function POST(request: Request) {
  const { title, content, category } = await request.json();
  
  // 감정분석 실행
  const analysisResult = await analyzeText(`${title} ${content}`);
  
  // 유해 콘텐츠 여부 저장
  const post = await prisma.post.create({
    data: {
      title,
      content,
      category,
      authorId: session.user.id,
      // 분석 결과 저장 (선택사항)
      // analysisResult: JSON.stringify(analysisResult),
    },
  });

  return Response.json({
    post,
    analysis: {
      isHarmful: analysisResult.analysis.is_harmful,
      categories: analysisResult.analysis.detected_categories,
    },
  });
}
```

#### 2.2 클라이언트에서 사전 분석 (선택사항)

```typescript
// hooks/use-sentiment-analysis.ts
'use client';

import { useState } from 'react';

interface UseSentimentAnalysisOptions {
  onWarning?: (categories: string[]) => void;
}

export function useSentimentAnalysis(options?: UseSentimentAnalysisOptions) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const analyze = async (text: string) => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.isHarmful && options?.onWarning) {
        options.onWarning(data.detectedCategories);
      }
      
      return data;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyze, isAnalyzing, result };
}
```

- [ ] 게시글 작성 API에 분석 연동
- [ ] 클라이언트 분석 훅 생성

---

### 3. 댓글 작성 시 감정분석 연동

```typescript
// app/api/posts/[id]/comments/route.ts
import { analyzeText } from '@/lib/ai-client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { content, parentId } = await request.json();
  
  // 감정분석
  const analysisResult = await analyzeText(content);
  
  const comment = await prisma.comment.create({
    data: {
      postId: params.id,
      authorId: session.user.id,
      content,
      parentId,
    },
  });

  // 댓글 수 업데이트
  await prisma.post.update({
    where: { id: params.id },
    data: { commentCount: { increment: 1 } },
  });

  return Response.json({
    comment,
    analysis: {
      isHarmful: analysisResult.analysis.is_harmful,
      categories: analysisResult.analysis.detected_categories,
    },
  });
}
```

- [ ] 댓글 작성 API에 분석 연동

---

### 4. 채팅 메시지 감정분석 연동

채팅 메시지는 실시간으로 분석하고 결과를 함께 전송합니다.

```typescript
// 채팅 메시지 전송 시
const sendMessage = async (content: string) => {
  // 메시지 저장 API 호출
  const response = await fetch(`/api/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  
  const { message, analysis } = await response.json();
  
  // Socket으로 메시지 + 분석 결과 전송
  socket.emit('chat:message', {
    ...message,
    analysis,
  });
};
```

- [ ] 채팅 메시지 API에 분석 연동

---

### 5. 유해 콘텐츠 경고 모달 연동

```typescript
// 게시글 작성 예시
const handleSubmit = async (data: PostForm) => {
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (result.analysis.isHarmful) {
      // 경고 모달 표시
      setDetectedCategories(result.analysis.categories);
      setPendingPost(result.post);
      setShowWarningModal(true);
    } else {
      // 성공 처리
      showToast.success('게시글이 등록되었습니다');
      router.push(`/board/${result.post.id}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};

// 경고 무시하고 등록
const handleProceedAnyway = () => {
  if (pendingPost) {
    showToast.success('게시글이 등록되었습니다');
    router.push(`/board/${pendingPost.id}`);
  }
  setShowWarningModal(false);
};
```

- [ ] 경고 모달 연동 로직 구현

---

### 6. 감정분석 결과 표시 UI

#### 6.1 SentimentBadge 컴포넌트

```css
/* components/common/sentiment-badge/sentiment-badge.css */

.sentiment-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 500;
  border-radius: 9999px;
}

.sentiment-badge--safe {
  background-color: rgb(220 252 231);
  color: rgb(22 101 52);
}

.sentiment-badge--warning {
  background-color: rgb(254 243 199);
  color: rgb(146 64 14);
}

.sentiment-badge--danger {
  background-color: rgb(254 226 226);
  color: rgb(153 27 27);
}

.sentiment-badge__icon {
  font-size: 0.75rem;
}
```

```typescript
// components/common/sentiment-badge/sentiment-badge.tsx
'use client';

import { SentimentLabel } from '@/types/sentiment';
import { cn } from '@/lib/utils';
import './sentiment-badge.css';

interface SentimentBadgeProps {
  label: SentimentLabel;
  showText?: boolean;
}

const labelConfig = {
  safe: { emoji: '😊', text: '안전' },
  warning: { emoji: '😟', text: '주의' },
  danger: { emoji: '⚠️', text: '경고' },
};

export function SentimentBadge({ label, showText = true }: SentimentBadgeProps) {
  const config = labelConfig[label];

  return (
    <span className={cn('sentiment-badge', `sentiment-badge--${label}`)}>
      <span className="sentiment-badge__icon">{config.emoji}</span>
      {showText && <span>{config.text}</span>}
    </span>
  );
}
```

- [ ] sentiment-badge.css 파일 생성
- [ ] SentimentBadge 컴포넌트 생성

#### 6.2 게시글/댓글에 배지 표시

- [ ] PostCard에 SentimentBadge 추가
- [ ] CommentItem에 SentimentBadge 추가
- [ ] MessageBubble에 SentimentBadge 추가

---

## 📁 생성되는 파일 목록

```
cc/src/
├── lib/
│   └── ai-client.ts
├── types/
│   └── sentiment.ts
├── hooks/
│   └── use-sentiment-analysis.ts
├── components/common/
│   └── sentiment-badge/
│       ├── sentiment-badge.tsx
│       ├── sentiment-badge.css
│       └── index.ts
└── app/api/
    └── analyze/
        └── route.ts (프록시 엔드포인트)
```

---

## ✅ 완료 조건

- [ ] AI 서버 클라이언트 구현
- [ ] 게시글 작성 시 감정분석 연동
- [ ] 댓글 작성 시 감정분석 연동
- [ ] 채팅 메시지 감정분석 연동
- [ ] SentimentBadge 컴포넌트 구현
- [ ] SentimentWarningModal 연동
- [ ] AI 서버 연결 테스트 완료
- [ ] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 10: 백엔드 API 구축](./10-backend-api.md)

**다음 단계**: [Phase 12: Socket 서버 연동](./12-socket-integration.md)
