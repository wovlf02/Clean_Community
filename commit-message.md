feat: 감정 분석 기능 및 UI/UX 개선 완료

프론트엔드 전반에 걸쳐 감정 분석 기능을 통합하고 UI/UX를 개선했습니다.

## 주요 변경사항

### 1. Tailwind CSS v4 마이그레이션
- @tailwind base → @import "tailwindcss/preflight" 변경
- @tailwind components 제거 (v4에서 더 이상 사용하지 않음)
- @import 순서 재정렬하여 CSS 표준 준수

### 2. 감정 분석 기능 통합
- 게시글, 댓글, 채팅 메시지에 감정 분석 배지 추가
- SentimentBadge 컴포넌트 개선 및 스타일링
- 6가지 감정 타입 지원 (긍정, 부정, 중립, 공격적, 유해, 스팸)
- 감정별 색상 테마 및 아이콘 적용

### 3. UI 컴포넌트 개선
- PostCard: 감정 배지 통합, 레이아웃 개선
- MessageBubble: 채팅 메시지에 감정 분석 표시
- CommentItem: 댓글에 감정 분석 배지 추가
- FriendCard, FriendRequestCard: 디자인 개선

### 4. 친구 페이지 개선
- 친구 추가 버튼을 아이콘 전용 버튼으로 변경
- 버튼 레이아웃 및 호버 효과 개선
- 반응형 디자인 적용

### 5. Dialog 모달 중앙 정렬 수정
- Radix UI Dialog의 중앙 정렬 이슈 해결
- !important 플래그로 강제 중앙 정렬 적용
- 모든 상태(open/closed)에서 일관된 위치 보장

### 6. 타입 정의 개선
- Sentiment 타입 추가 및 확장
- Post, Comment, Message, User 타입에 sentiment 필드 추가
- 타입 안정성 강화

### 7. 목 데이터 업데이트
- 모든 목 데이터에 감정 분석 값 추가
- 다양한 감정 시나리오 반영
- 실제 사용 사례를 반영한 테스트 데이터

## 기술 스택
- Next.js 15
- TypeScript
- Tailwind CSS v4
- Radix UI
- Lucide React Icons

## 테스트
- UI 컴포넌트 렌더링 검증
- 감정 배지 색상 및 아이콘 표시 확인
- 반응형 레이아웃 테스트
- 다이얼로그 중앙 정렬 검증

Closes #frontend-sentiment-analysis
