# AI 감정분석 보완 작업 (AI Complement)

**관련 문서**: 
- [기능 요구사항 - AI 감정분석](../../../02_requirements/functional.md#6-ai-감정분석-fr-40--fr-44)
- [AI 서버 통합 가이드](../../11-ai-integration.md)
- [AI 서버 문서](../../../../ai_server/docs/README.md)
- [시스템 설계 - AI 감정분석 흐름](../../../03_architecture/system-design.md)
- [디자인 시스템 - 감정분석 배지](../../../05_screens/00_common/design-system.md)

---

## 📋 현재 구현 상태

| 기능 요구사항 | 상태 | 구현 위치 |
|--------------|------|----------|
| FR-40: 게시글 감정분석 | ✅ 완료 | `cc/src/app/api/posts/route.ts` |
| FR-41: 댓글/대댓글 감정분석 | ✅ 완료 | `cc/src/app/api/comments/` |
| FR-42: 채팅 메시지 감정분석 | ⚠️ 부분 | 기본 구현됨 |
| FR-43: 악성 콘텐츠 모니터링 | ❌ 미구현 | - |
| FR-44: 감정분석 경고 모달 | ✅ 완료 | `cc/src/components/common/sentiment-warning-modal/` |

---

## ✅ 체크리스트

### 1. 관리자 악성 콘텐츠 모니터링 대시보드

**문서 설계 내용** (functional.md FR-43 참조):
- 관리자용 악성 콘텐츠 모니터링 대시보드
- 자동 등록 조건: 사용자가 악성 경고에도 "그대로 등록" 선택한 콘텐츠
- 표시 정보: 작성자, 콘텐츠 유형, 원문, 악성 라벨, 신뢰도, 작성 시각
- 관리 기능: 삭제/숨김, 사용자 경고/제재, 조치 이력

**현재 상태**:
- AnalysisLog 모델에 isFlagged 필드 존재
- 관리자 페이지 미구현

**TODO**:
- [ ] 관리자 전용 라우트 생성
  - `cc/src/app/(admin)/admin/monitoring/`
  - 접근 권한: role === 'ADMIN'
- [ ] 플래그된 콘텐츠 목록 API
  - `GET /api/admin/flagged-content`
  - 페이지네이션, 필터 (콘텐츠 유형, 날짜 범위)
  ```typescript
  {
    items: [
      {
        id: 'xxx',
        userId: 'xxx',
        user: { nickname, image },
        contentType: 'POST' | 'COMMENT' | 'MESSAGE',
        contentId: 'xxx',
        text: '원문 내용...',
        labels: ['hate', 'profanity'],
        scores: { hate: 0.85, profanity: 0.72 },
        createdAt: '2026-01-30T10:00:00Z',
        actionTaken: null
      }
    ],
    pagination: { ... }
  }
  ```
- [ ] 모니터링 대시보드 UI
  - 테이블 형식 콘텐츠 목록
  - 필터: 유형, 기간, 조치 상태
  - 상세 보기 모달/슬라이드
- [ ] 관리자 조치 기능
  - 콘텐츠 삭제/숨김 처리 API
    - `POST /api/admin/flagged-content/[id]/action`
  - 사용자 경고 발송
  - 조치 이력 기록
- [ ] 통계 대시보드
  - 일별/주별 유해 콘텐츠 감지 건수
  - 라벨별 분포 차트
  - 트렌드 차트

**참고 파일**:
```
cc/prisma/schema.prisma (AnalysisLog 모델)
cc/src/lib/ai-client.ts
```

---

### 2. 채팅 메시지 감정분석 완성

**문서 설계 내용** (functional.md FR-42 참조):
- 채팅 메시지 전송 시 감정분석
- 악성 표현 감지 시 경고 모달
- "그대로 전송" 시 모니터링 대상 등록

**현재 상태**:
- 기본 흐름 구현됨
- 실시간 처리 최적화 필요

**TODO**:
- [ ] 채팅 메시지 전송 전 감정분석 호출 확인
  ```typescript
  // chat-input에서
  const result = await analyzeSentiment(message);
  if (result.isFlagged) {
    // 경고 모달 표시
    showSentimentWarning(result);
  } else {
    // 바로 전송
    sendMessage(message);
  }
  ```
- [ ] 감정분석 결과 캐싱 (선택)
  - 동일 메시지 재분석 방지
- [ ] 비동기 처리 최적화
  - 분석 중 로딩 상태 표시
  - 타임아웃 처리 (5초)
- [ ] 전송 후 AnalysisLog 저장 확인
  - isFlagged = true인 경우

**참고 파일**:
```
cc/src/components/chat/chat-input/chat-input.tsx
cc/src/hooks/use-sentiment-analysis.ts
cc/src/lib/ai-client.ts
```

---

### 3. 감정분석 경고 모달 개선

**문서 설계 내용** (functional.md FR-44 참조):
- 경고 아이콘
- 감지된 악성 표현 종류 및 신뢰도 안내
- 수정 권장 메시지
- [수정하기] [그대로 등록/전송] 버튼

**현재 상태**:
- SentimentWarningModal 컴포넌트 존재
- 기본 UI 구현됨

**TODO**:
- [ ] 감지된 라벨 상세 표시
  - 라벨별 한국어 이름 매핑
  - 신뢰도 표시 (예: 85%)
  ```typescript
  const labelNames: Record<string, string> = {
    hate: '혐오 표현',
    profanity: '욕설/비속어',
    discrimination: '차별 표현',
    violence: '폭력적 표현',
    threat: '협박',
    // ...
  };
  ```
- [ ] 경고 수준별 UI 차별화
  - 주의 (50-70%): 노란색 경고
  - 경고 (70-90%): 주황색 경고
  - 위험 (90%+): 빨간색 경고
- [ ] 수정 제안 기능 (향후)
  - 문제가 되는 부분 하이라이트
  - 대체 표현 제안
- [ ] 접근성 개선
  - 키보드 네비게이션
  - 스크린 리더 지원

**참고 파일**:
```
cc/src/components/common/sentiment-warning-modal/
cc/src/types/sentiment.ts
```

---

### 4. 감정분석 결과 표시 개선

**문서 설계 내용** (post-list-page.md, post-detail-page.md 참조):
- 게시글 카드에 감정분석 결과 라벨
- 😊 긍정, 😐 중립, 😟 주의, ⚠️ 경고

**현재 상태**:
- SentimentBadge 컴포넌트 존재

**TODO**:
- [ ] 게시글 목록에 SentimentBadge 적용 확인
- [ ] 게시글 상세에 SentimentBadge 적용 확인
- [ ] 댓글에 감정분석 결과 표시 (선택)
  - 경고 수준만 표시
- [ ] 채팅 메시지에 결과 표시 (선택)
  - 플래그된 메시지 시각적 표시

**참고 파일**:
```
cc/src/components/common/sentiment-badge/
cc/src/components/board/post-card/
```

---

### 5. AI 서버 연결 안정성

**현재 상태**:
- ai-client.ts에 기본 연결 구현

**TODO**:
- [ ] AI 서버 헬스체크
  - 주기적으로 `/health` 엔드포인트 확인
  - 서버 다운 시 폴백 처리
- [ ] 타임아웃 처리
  - 5초 타임아웃 설정
  - 타임아웃 시 기본값 반환 (분석 스킵)
- [ ] 재시도 로직
  - 네트워크 오류 시 1회 재시도
- [ ] 에러 로깅
  - AI 서버 오류 시 로그 기록
  - 모니터링 연동

**참고 파일**:
```
cc/src/lib/ai-client.ts
ai_server/app/main.py
```

---

### 6. 분석 결과 통계 API

**문서 설계 내용** (FR-43 통계 기능 참조):
- 유해 콘텐츠 감지 건수
- 라벨별 분포
- 트렌드 차트

**TODO**:
- [ ] 분석 통계 API
  - `GET /api/admin/analysis-stats`
  ```typescript
  {
    totalAnalyzed: 10000,
    totalFlagged: 245,
    flaggedRate: 2.45,
    byLabel: {
      hate: 45,
      profanity: 120,
      discrimination: 30,
      // ...
    },
    byDay: [
      { date: '2026-01-30', flagged: 12 },
      { date: '2026-01-29', flagged: 18 },
      // ...
    ],
    byContentType: {
      POST: 80,
      COMMENT: 150,
      MESSAGE: 15
    }
  }
  ```
- [ ] 통계 대시보드 UI
  - 원형 차트 (라벨별 분포)
  - 라인 차트 (일별 트렌드)
  - 카드 (전체 수치)

**참고 파일**:
```
cc/prisma/schema.prisma (AnalysisLog)
```

---

## 📝 문서 보완 필요 사항

### 관리자 페이지 문서 추가 필요
- [ ] 관리자 모니터링 대시보드 화면 설계 문서
- [ ] 관리자 권한 체계 문서

### API 문서 보완 필요
- [ ] `GET /api/admin/flagged-content` 엔드포인트 추가
- [ ] `POST /api/admin/flagged-content/[id]/action` 엔드포인트 추가
- [ ] `GET /api/admin/analysis-stats` 엔드포인트 추가

### sentiment.ts 타입 보완 필요
- [ ] 라벨 한국어 매핑 추가
- [ ] 경고 수준 정의 추가

---

## 📌 구현 순서 권장

1. AI 서버 연결 안정성 (기반 작업)
2. 관리자 모니터링 대시보드 (핵심 기능)
3. 채팅 메시지 감정분석 완성
4. 감정분석 경고 모달 개선
5. 분석 결과 통계 API
6. 감정분석 결과 표시 개선

---

**이전 문서**: [대시보드 보완 작업](./05-dashboard-complement.md)  
**다음 문서**: [최적화 보완 작업](./07-optimization-complement.md)
