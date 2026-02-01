# 최적화 보완 작업 (Optimization Complement)

**관련 문서**: 
- [비기능 요구사항](../../../02_requirements/non-functional.md)
- [최적화 가이드](../../13-optimization.md)
- [시스템 설계](../../../03_architecture/system-design.md)
- [기술 스택](../../../03_architecture/tech-stack.md)
- [AWS 배포 가이드](../../../07_deployment/aws-deployment.md)

---

## 📋 현재 구현 상태

| 최적화 항목 | 상태 | 비고 |
|------------|------|------|
| next/image 적용 | ⚠️ 부분 | 일부 img 태그 존재 |
| 코드 스플리팅 | ⚠️ 부분 | 기본 라우트 스플리팅만 |
| 번들 분석 | ❌ 미구현 | Bundle Analyzer 미설정 |
| SEO 메타 태그 | ✅ 완료 | 루트 layout에 설정됨 |
| Error Boundary | ✅ 완료 | error.tsx UX 개선 완료 |
| Not Found 페이지 | ✅ 완료 | not-found.tsx UX 개선 완료 |
| Loading UI | ✅ 완료 | loading.tsx UX 개선 완료 |
| Lighthouse 성능 | ❓ 미측정 | 점검 필요 |
| **빌드/배포 최적화** | ⚠️ 부분 | 동적 데이터 처리 보완 필요 |

---

## 🚨 빌드/배포 핵심 점검 사항

> **중요**: AWS 배포 시 Next.js는 빌드 시점에 정적 페이지를 생성합니다.
> 동적 데이터(시간, 실시간 콘텐츠 등)는 별도 처리가 필요합니다.

### 현재 발견된 이슈

| 이슈 | 위치 | 심각도 | 상태 |
|------|------|--------|------|
| Mock 데이터 사용 중 | 모든 페이지 | 🔴 높음 | 미해결 |
| 동적 라우트 설정 없음 | API Routes | 🟡 중간 | 미해결 |
| 환경변수 검증 없음 | 전역 | 🟡 중간 | 미해결 |
| revalidate 미설정 | 서버 컴포넌트 | 🟡 중간 | 미해결 |
| 상대 시간 표시 정적화 위험 | formatRelativeTime | 🟡 중간 | 미해결 |

---

## ✅ 체크리스트

### 🔴 1. Mock 데이터 → 실제 API 연동 (최우선)

**현재 상태**:
- 모든 페이지에서 `@/mocks/*` 데이터 사용 중
- 빌드 시 Mock 데이터가 정적으로 포함됨

**문제점**:
- 배포 후 데이터 변경 불가
- 실시간 데이터 반영 불가

**TODO**:
- [ ] 게시판 페이지 API 연동
  ```typescript
  // cc/src/app/(main)/board/page.tsx
  // 변경 전: import { posts } from '@/mocks/posts';
  // 변경 후: 
  'use client';
  import { useQuery } from '@tanstack/react-query';
  
  export default function BoardPage() {
    const { data: posts, isLoading } = useQuery({
      queryKey: ['posts', category, sort, page],
      queryFn: () => fetch(`/api/posts?category=${category}&sort=${sort}&page=${page}`).then(res => res.json()),
    });
    // ...
  }
  ```
- [ ] 대시보드 페이지 API 연동
- [ ] 채팅 페이지 API 연동
- [ ] 친구 페이지 API 연동
- [ ] Mock 파일 제거 또는 개발 전용으로 분리

**참고 파일**:
```
cc/src/mocks/*.ts (제거 대상)
cc/src/app/(main)/board/page.tsx
cc/src/app/(main)/page.tsx
cc/src/app/(main)/chat/page.tsx
cc/src/app/(main)/friends/page.tsx
```

---

### 🔴 2. 동적 라우트 및 캐싱 설정

**현재 상태**:
- `export const dynamic`, `export const revalidate` 미설정
- 빌드 시 정적 생성 여부 불명확

**TODO**:
- [ ] API Routes에 런타임 설정 추가
  ```typescript
  // cc/src/app/api/posts/route.ts
  export const dynamic = 'force-dynamic'; // 항상 동적 응답
  // 또는
  export const revalidate = 60; // 60초마다 재검증
  ```
- [ ] 실시간 데이터가 필요한 페이지에 설정
  ```typescript
  // cc/src/app/(main)/chat/page.tsx
  export const dynamic = 'force-dynamic';
  ```
- [ ] 정적 생성 가능한 페이지는 ISR 설정
  ```typescript
  // cc/src/app/(main)/board/[id]/page.tsx
  export const revalidate = 300; // 5분마다 재검증
  ```

**권장 설정**:
| 페이지 | 동적 설정 | 이유 |
|--------|----------|------|
| `/api/*` | `force-dynamic` | 항상 최신 데이터 |
| `/chat/*` | `force-dynamic` | 실시간 채팅 |
| `/friends` | `force-dynamic` | 온라인 상태 |
| `/board` | `revalidate = 60` | 게시글 목록 캐싱 |
| `/board/[id]` | `revalidate = 300` | 게시글 상세 캐싱 |
| `/settings` | `force-dynamic` | 사용자별 설정 |

---

### 🔴 3. 상대 시간 표시 클라이언트 처리

**현재 상태**:
- `formatRelativeTime()` 함수가 서버에서 실행될 경우
- 빌드 시점의 시간 기준으로 정적화됨

**문제점**:
```typescript
// 빌드 시: "3일 전"
// 배포 후 1주일 경과: 여전히 "3일 전"으로 표시 (잘못됨)
```

**TODO**:
- [ ] 상대 시간 표시를 클라이언트 전용으로 변경
  ```typescript
  // cc/src/components/common/relative-time.tsx
  'use client';
  
  import { useState, useEffect } from 'react';
  import { formatRelativeTime } from '@/lib/utils';
  
  interface RelativeTimeProps {
    date: string | Date;
    className?: string;
  }
  
  export function RelativeTime({ date, className }: RelativeTimeProps) {
    const [, setTick] = useState(0);
  
    // 1분마다 자동 갱신
    useEffect(() => {
      const timer = setInterval(() => setTick(t => t + 1), 60000);
      return () => clearInterval(timer);
    }, []);
  
    return (
      <time dateTime={new Date(date).toISOString()} className={className}>
        {formatRelativeTime(date)}
      </time>
    );
  }
  ```
- [ ] 모든 상대 시간 표시 컴포넌트로 교체
  - PostCard의 작성일
  - CommentList의 댓글 시간
  - ChatRoomItem의 마지막 메시지 시간
  - NotificationItem의 알림 시간
- [ ] 서버 컴포넌트에서는 절대 시간 표시

**참고 파일**:
```
cc/src/lib/utils.ts
cc/src/components/board/post-card/
cc/src/components/chat/chat-room-item/
```

---

### 🔴 4. 환경변수 검증 및 빌드 타임 체크

**현재 상태**:
- 환경변수 누락 시 런타임 에러 발생
- 빌드 성공 후 배포에서 실패 가능

**TODO**:
- [ ] 환경변수 검증 유틸리티 생성
  ```typescript
  // cc/src/lib/env.ts
  import { z } from 'zod';
  
  const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    AI_SERVER_URL: z.string().url().optional(),
    SOCKET_SERVER_URL: z.string().url().optional(),
    // S3
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
  });
  
  export const env = envSchema.parse(process.env);
  ```
- [ ] 빌드 스크립트에 환경변수 검증 추가
  ```json
  // package.json
  {
    "scripts": {
      "build": "node scripts/validate-env.js && next build"
    }
  }
  ```
- [ ] .env.example 파일 생성/업데이트

---

### 🟡 5. next/image 적용

**문서 설계 내용** (13-optimization.md 참조):
- 모든 `<img>` 태그를 `<Image>`로 교체
- priority 속성 설정 (LCP 이미지)
- sizes 속성 설정 (반응형)

**TODO**:
- [ ] 이미지 사용 현황 파악
  ```bash
  grep -r "<img" cc/src/components --include="*.tsx"
  grep -r "<img" cc/src/app --include="*.tsx"
  ```
- [ ] 모든 `<img>` 태그를 `<Image>`로 교체
- [ ] priority 속성 설정 (LCP 이미지)
- [ ] sizes 속성 설정 (반응형)
- [ ] placeholder 설정

**참고 파일**:
```
cc/src/components/common/user-avatar/
cc/src/components/board/post-card/
cc/next.config.ts
```

---

### 🟡 6. 동적 임포트 (코드 스플리팅)

**TODO**:
- [ ] 차트 컴포넌트 동적 임포트
  ```typescript
  import dynamic from 'next/dynamic';
  
  export const ActivityChart = dynamic(
    () => import('./activity-chart').then((mod) => mod.ActivityChart),
    { ssr: false, loading: () => <Skeleton /> }
  );
  ```
- [ ] 리치 텍스트 에디터 동적 임포트
- [ ] PDF 뷰어 동적 임포트 (향후)

**참고 파일**:
```
cc/src/components/dashboard/activity-chart/
cc/src/components/board/post-editor/
```

---

### 🟡 7. 번들 분석 설정

**TODO**:
- [ ] Bundle Analyzer 설치
  ```bash
  npm install -D @next/bundle-analyzer
  ```
- [ ] next.config.ts 수정
  ```typescript
  import bundleAnalyzer from '@next/bundle-analyzer';
  
  const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  });
  
  export default withBundleAnalyzer(nextConfig);
  ```
- [ ] 분석 실행: `ANALYZE=true npm run build`

---

### 🟡 8. 동적 메타데이터 설정

**TODO**:
- [ ] 게시글 상세 페이지 generateMetadata
  ```typescript
  export async function generateMetadata({ params }): Promise<Metadata> {
    const post = await getPost(params.id);
    return {
      title: post.title,
      description: post.content.slice(0, 160),
      openGraph: { ... },
    };
  }
  ```
- [ ] OG 이미지 동적 생성 (선택)

---

### 🟡 9. Suspense 및 스트리밍 최적화

**TODO**:
- [ ] 게시글 목록에 Suspense 적용
- [ ] 대시보드 섹션별 Suspense 적용
- [ ] 스켈레톤 UI와 실제 콘텐츠 크기 일치

---

### 🟢 10. Lighthouse 성능 점검

**목표**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**TODO**:
- [ ] 프로덕션 빌드 후 Lighthouse 실행
- [ ] 성능 지표 기록
- [ ] LCP, CLS, FID/INP 최적화

---

### 🟢 11. 접근성 점검

**TODO**:
- [ ] aria 속성 점검
- [ ] 색상 대비 점검 (WCAG 2.1 AA)
- [ ] 키보드 네비게이션 점검
- [ ] 스크린 리더 테스트

---

### 🟢 12. 반응형 테스트

**TODO**:
- [ ] Desktop, Tablet, Mobile 주요 페이지 점검
- [ ] 반응형 버그 수정
- [ ] 모바일 터치 인터랙션 점검

---

## 🚀 AWS 배포 체크리스트

### 빌드 전 확인사항

- [ ] 모든 환경변수 설정 (.env.production)
- [ ] DATABASE_URL이 프로덕션 DB를 가리키는지 확인
- [ ] AI_SERVER_URL이 배포된 AI 서버 주소인지 확인
- [ ] SOCKET_SERVER_URL이 배포된 Socket 서버 주소인지 확인
- [ ] Mock 데이터 사용 제거 완료
- [ ] `npm run build` 에러 없이 완료

### 배포 후 확인사항

- [ ] 게시글 목록이 실시간 로드되는지 확인
- [ ] 상대 시간이 올바르게 갱신되는지 확인
- [ ] 채팅 실시간 동기화 작동 확인
- [ ] 온라인 상태 업데이트 확인
- [ ] 이미지 로딩 정상 확인 (S3 연동)
- [ ] OAuth 로그인 콜백 URL 설정 확인

---

## 📝 문서 보완 필요 사항

### 13-optimization.md 업데이트 필요
- [ ] 현재 완료 상태 체크박스 업데이트
- [ ] 동적/정적 라우팅 가이드 추가
- [ ] AWS 배포 시 주의사항 추가

### 배포 문서 보완 필요
- [ ] 환경변수 전체 목록 문서화
- [ ] 빌드 파이프라인 문서화
- [ ] 롤백 절차 문서화

---

## 📌 구현 순서 권장

### Phase 1: 배포 차단 이슈 해결 (필수)
1. Mock 데이터 → API 연동
2. 환경변수 검증 추가
3. 동적 라우트 설정

### Phase 2: 실시간 데이터 처리
4. 상대 시간 클라이언트 컴포넌트화
5. 캐싱 전략 설정 (revalidate)

### Phase 3: 성능 최적화
6. 번들 분석 및 최적화
7. next/image 적용
8. 동적 임포트 적용

### Phase 4: 품질 검증
9. Lighthouse 성능 점검
10. 접근성 점검
11. 반응형 테스트

---

**이전 문서**: [AI 감정분석 보완 작업](./06-ai-complement.md)  
**다음 문서**: [문서 보완 작업](./08-documentation-complement.md)
