# Next.js 프론트엔드 개발 TODO

**관련 문서**: [기능 요구사항](../../02_requirements/functional.md) | [화면 설계](../../05_screens/overview.md) | [기술 스택](../../03_architecture/tech-stack.md)

---

## 📋 개요

Next.js 16 기반 프론트엔드 및 백엔드 구축을 위한 상세 작업 가이드입니다.

### 개발 전략

1. **Mock Data 기반 프론트엔드 우선 개발**
2. **디자인 시스템 및 UI 컴포넌트 완성**
3. **백엔드 API 구축 후 Mock Data 교체**
4. **AI 서버(8000) 및 Socket 서버(4000) 연동**

### 기술 스택 (확정)

| 분류 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js | 16.1.6 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS + shadcn/ui | - |
| State | Zustand + React Query | - |
| Form | React Hook Form + Zod | - |
| Auth | NextAuth.js (Auth.js) | 5.x |
| ORM | Prisma | 5.x |
| Icons | Lucide Icons | - |

### 외부 서버

| 서버 | 포트 | 역할 |
|------|------|------|
| AI Model Server | 8000 | 감정분석 추론 (FastAPI) |
| Socket Server | 4000 | 실시간 채팅 (Express + Socket.IO) |

---

## 🗂️ 문서 구조

```
docs/08_todo/nextjs/
├── README.md                    # 이 파일 (전체 개요)
├── 00-project-setup.md          # Phase 0: 프로젝트 초기 설정
├── 01-design-system.md          # Phase 1: 디자인 시스템 구축
├── 02-common-components/        # Phase 2: 공통 컴포넌트 개발
│   ├── README.md                # 개요 및 핵심 원칙
│   ├── 01-setup.md              # shadcn/ui 설치 및 설정
│   ├── 02-button-input.md       # 버튼, 입력 필드 컴포넌트
│   ├── 03-card-modal.md         # 카드, 모달 컴포넌트
│   ├── 04-feedback.md           # 토스트, 스켈레톤 컴포넌트
│   └── 05-data-display.md       # 아바타, 배지, 페이지네이션
├── 03-layouts.md                # Phase 3: 레이아웃 구현
├── 04-auth-pages.md             # Phase 4: 인증 화면 개발
├── 05-board-pages.md            # Phase 5: 게시판 화면 개발
├── 06-chat-pages.md             # Phase 6: 채팅 화면 개발
├── 07-friends-pages.md          # Phase 7: 친구 관리 화면 개발
├── 08-dashboard-pages.md        # Phase 8: 대시보드 화면 개발
├── 09-settings-pages.md         # Phase 9: 설정 화면 개발
├── 10-backend-api.md            # Phase 10: 백엔드 API 구축
├── 11-ai-integration.md         # Phase 11: AI 서버 연동
├── 12-socket-integration.md     # Phase 12: Socket 서버 연동
└── 13-optimization.md           # Phase 13: 최적화 및 마무리
```

---

## 🚀 개발 순서 (권장)

### Phase 0: 프로젝트 초기 설정 ⏱️ 1일
> 📄 [00-project-setup.md](./00-project-setup.md)

- [ ] 필수 패키지 설치 (Tailwind, shadcn/ui, Zustand, React Query 등)
- [ ] 프로젝트 폴더 구조 설정
- [ ] 환경 변수 설정
- [ ] TypeScript 경로 별칭 설정
- [ ] ESLint/Prettier 설정 보완
- [ ] Mock 데이터 구조 설계

### Phase 1: 디자인 시스템 구축 ⏱️ 1일
> 📄 [01-design-system.md](./01-design-system.md)

- [ ] Tailwind CSS 테마 커스터마이징
- [ ] CSS 변수 정의 (컬러, 간격, 폰트)
- [ ] 다크 모드 설정
- [ ] 글로벌 스타일 정의
- [ ] Pretendard 폰트 적용

### Phase 2: 공통 컴포넌트 개발 ⏱️ 3일
> 📄 [02-common-components/](./02-common-components/)

- [ ] shadcn/ui 컴포넌트 설치 및 커스터마이징
- [ ] Button 컴포넌트 (CSS 분리)
- [ ] Input 컴포넌트 (CSS 분리)
- [ ] Card 컴포넌트 (CSS 분리)
- [ ] Modal/Dialog 컴포넌트
- [ ] Toast 컴포넌트
- [ ] Badge 컴포넌트
- [ ] Avatar 컴포넌트
- [ ] Dropdown 컴포넌트
- [ ] Skeleton 로딩 컴포넌트
- [ ] Pagination 컴포넌트
- [ ] EmptyState 컴포넌트

### Phase 3: 레이아웃 구현 ⏱️ 2일
> 📄 [03-layouts.md](./03-layouts.md)

- [ ] 전역 레이아웃 (RootLayout)
- [ ] Header 컴포넌트 (Desktop/Mobile)
- [ ] Sidebar 컴포넌트
- [ ] Bottom Tab Bar (Mobile)
- [ ] Right Panel 컴포넌트
- [ ] 반응형 레이아웃 로직

### Phase 4: 인증 화면 개발 ⏱️ 3일
> 📄 [04-auth-pages.md](./04-auth-pages.md)

- [ ] 로그인 페이지 (`/login`)
- [ ] 회원가입 페이지 (`/register`) - 4단계 스텝
- [ ] 아이디 찾기 페이지 (`/find-id`)
- [ ] 비밀번호 재설정 페이지 (`/forgot-password`)
- [ ] Mock 인증 로직

### Phase 5: 게시판 화면 개발 ⏱️ 4일
> 📄 [05-board-pages.md](./05-board-pages.md)

- [ ] 게시글 목록 페이지 (`/board`)
- [ ] 게시글 상세 페이지 (`/board/[id]`)
- [ ] 게시글 작성 페이지 (`/board/write`)
- [ ] 게시글 수정 페이지 (`/board/[id]/edit`)
- [ ] 댓글/대댓글 컴포넌트
- [ ] 좋아요 기능 UI
- [ ] 카테고리 필터 UI
- [ ] 페이지네이션 컴포넌트
- [ ] AI 감정분석 결과 표시 UI

### Phase 6: 채팅 화면 개발 ⏱️ 3일
> 📄 [06-chat-pages.md](./06-chat-pages.md)

- [ ] 채팅방 목록 페이지 (`/chat`)
- [ ] 채팅방 페이지 (`/chat/[id]`)
- [ ] 메시지 버블 컴포넌트
- [ ] 채팅 입력 컴포넌트
- [ ] 채팅방 생성 모달
- [ ] 타이핑 인디케이터 UI
- [ ] 읽음 표시 UI
- [ ] AI 감정분석 결과 표시

### Phase 7: 친구 관리 화면 개발 ⏱️ 2일
> 📄 [07-friends-pages.md](./07-friends-pages.md)

- [ ] 친구 목록 페이지 (`/friends`)
- [ ] 친구 검색 페이지 (`/friends/search`)
- [ ] 친구 요청 관리 UI
- [ ] 온라인 상태 표시 UI
- [ ] 친구 프로필 카드 컴포넌트

### Phase 8: 대시보드 화면 개발 ⏱️ 2일
> 📄 [08-dashboard-pages.md](./08-dashboard-pages.md)

- [ ] 대시보드 메인 페이지 (`/`)
- [ ] 활동 통계 카드
- [ ] 인기 게시글 섹션
- [ ] 최근 활동 타임라인
- [ ] 차트 컴포넌트 (Recharts)

### Phase 9: 설정 화면 개발 ⏱️ 2일
> 📄 [09-settings-pages.md](./09-settings-pages.md)

- [ ] 프로필 페이지 (`/profile`)
- [ ] 설정 메인 페이지 (`/settings`)
- [ ] 비밀번호 변경 페이지 (`/settings/password`)
- [ ] 계정 탈퇴 페이지 (`/settings/delete-account`)
- [ ] 알림 설정 UI
- [ ] 다크 모드 토글
- [ ] 이용약관/개인정보 처리방침 페이지

### Phase 10: 백엔드 API 구축 ⏱️ 5일
> 📄 [10-backend-api.md](./10-backend-api.md)

- [ ] Prisma 스키마 작성 및 마이그레이션
- [ ] NextAuth.js 설정
- [ ] 인증 API (회원가입, 로그인, OAuth)
- [ ] 사용자 API
- [ ] 게시판 API (CRUD, 좋아요, 조회수)
- [ ] 댓글 API (CRUD, 대댓글)
- [ ] 채팅 API (채팅방 CRUD, 메시지 저장)
- [ ] 친구 API (요청, 수락/거절, 목록)
- [ ] 대시보드 API (통계, 인기글)
- [ ] 알림 API
- [ ] Mock Data → 실제 API 연동

### Phase 11: AI 서버 연동 ⏱️ 2일
> 📄 [11-ai-integration.md](./11-ai-integration.md)

- [ ] AI 서버 연동 서비스 구현
- [ ] 게시글 작성 시 감정분석 연동
- [ ] 댓글 작성 시 감정분석 연동
- [ ] 채팅 메시지 감정분석 연동
- [ ] 유해 콘텐츠 경고 모달 구현

### Phase 12: Socket 서버 연동 ⏱️ 3일
> 📄 [12-socket-integration.md](./12-socket-integration.md)

- [ ] Socket.IO 클라이언트 설정
- [ ] 채팅 실시간 메시지 연동
- [ ] 타이핑 인디케이터 연동
- [ ] 읽음 확인 연동
- [ ] 온라인 상태 연동
- [ ] 실시간 알림 연동

### Phase 13: 최적화 및 마무리 ⏱️ 2일
> 📄 [13-optimization.md](./13-optimization.md)

- [ ] 이미지 최적화 (next/image)
- [ ] 코드 스플리팅 검토
- [ ] 번들 크기 최적화
- [ ] SEO 메타 태그 설정
- [ ] Error Boundary 구현
- [ ] Loading UI 최적화
- [ ] Lighthouse 성능 점검

---

## 📊 진행률

| Phase | 작업 | 예상 일수 | 상태 |
|-------|------|----------|------|
| 0 | 프로젝트 초기 설정 | 1일 | ⬜ 대기 |
| 1 | 디자인 시스템 구축 | 1일 | ⬜ 대기 |
| 2 | 공통 컴포넌트 개발 | 3일 | ⬜ 대기 |
| 3 | 레이아웃 구현 | 2일 | ⬜ 대기 |
| 4 | 인증 화면 개발 | 3일 | ⬜ 대기 |
| 5 | 게시판 화면 개발 | 4일 | ⬜ 대기 |
| 6 | 채팅 화면 개발 | 3일 | ⬜ 대기 |
| 7 | 친구 관리 화면 개발 | 2일 | ⬜ 대기 |
| 8 | 대시보드 화면 개발 | 2일 | ⬜ 대기 |
| 9 | 설정 화면 개발 | 2일 | ⬜ 대기 |
| 10 | 백엔드 API 구축 | 5일 | ⬜ 대기 |
| 11 | AI 서버 연동 | 2일 | ⬜ 대기 |
| 12 | Socket 서버 연동 | 3일 | ⬜ 대기 |
| 13 | 최적화 및 마무리 | 2일 | ⬜ 대기 |
| **총계** | | **35일** | **0%** |

---

## 🎯 마일스톤

### Milestone 1: 프론트엔드 기반 (Phase 0~3) - 7일
- 디자인 시스템 및 공통 컴포넌트 완성
- 레이아웃 구조 완성

### Milestone 2: UI 화면 완성 (Phase 4~9) - 16일
- 모든 페이지 Mock Data 기반 UI 완성
- 사용자 흐름 테스트 가능

### Milestone 3: 백엔드 연동 (Phase 10~12) - 10일
- 실제 데이터베이스 연동
- AI/Socket 서버 통합
- Mock Data 완전 제거

### Milestone 4: 출시 준비 (Phase 13) - 2일
- 성능 최적화
- 최종 테스트

---

**최종 업데이트**: 2026년 1월 31일
