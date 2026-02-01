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

- [x] 필수 패키지 설치 (Tailwind, shadcn/ui, Zustand, React Query 등)
- [x] 프로젝트 폴더 구조 설정
- [x] 환경 변수 설정
- [x] TypeScript 경로 별칭 설정
- [x] ESLint/Prettier 설정 보완
- [x] Mock 데이터 구조 설계

### Phase 1: 디자인 시스템 구축 ⏱️ 1일
> 📄 [01-design-system.md](./01-design-system.md)

- [x] Tailwind CSS 테마 커스터마이징
- [x] CSS 변수 정의 (컬러, 간격, 폰트)
- [x] 다크 모드 설정
- [x] 글로벌 스타일 정의
- [x] Pretendard 폰트 적용

### Phase 2: 공통 컴포넌트 개발 ⏱️ 3일
> 📄 [02-common-components/](./02-common-components/)

- [x] shadcn/ui 컴포넌트 설치 및 커스터마이징
- [x] Button 컴포넌트 (CSS 분리)
- [x] Input 컴포넌트 (CSS 분리)
- [x] Card 컴포넌트 (CSS 분리)
- [x] Modal/Dialog 컴포넌트
- [x] Toast 컴포넌트
- [x] Badge 컴포넌트
- [x] Avatar 컴포넌트
- [x] Dropdown 컴포넌트
- [x] Skeleton 로딩 컴포넌트
- [x] Pagination 컴포넌트
- [x] EmptyState 컴포넌트

### Phase 3: 레이아웃 구현 ⏱️ 2일
> 📄 [03-layouts.md](./03-layouts.md)

- [x] 전역 레이아웃 (RootLayout)
- [x] Header 컴포넌트 (Desktop/Mobile)
- [x] Sidebar 컴포넌트
- [x] Bottom Tab Bar (Mobile)
- [x] Right Panel 컴포넌트
- [x] 반응형 레이아웃 로직

### Phase 4: 인증 화면 개발 ⏱️ 3일
> 📄 [04-auth-pages.md](./04-auth-pages.md)

- [x] 로그인 페이지 (`/login`)
- [x] 회원가입 페이지 (`/register`) - 4단계 스텝
- [x] 아이디 찾기 페이지 (`/find-id`)
- [x] 비밀번호 재설정 페이지 (`/forgot-password`)
- [x] Mock 인증 로직

### Phase 5: 게시판 화면 개발 ⏱️ 4일
> 📄 [05-board-pages.md](./05-board-pages.md)

- [x] 게시글 목록 페이지 (`/board`)
- [x] 게시글 상세 페이지 (`/board/[id]`)
- [x] 게시글 작성 페이지 (`/board/write`)
- [x] 게시글 수정 페이지 (`/board/[id]/edit`)
- [x] 댓글/대댓글 컴포넌트
- [x] 좋아요 기능 UI
- [x] 카테고리 필터 UI
- [x] 페이지네이션 컴포넌트
- [x] AI 감정분석 결과 표시 UI

### Phase 6: 채팅 화면 개발 ⏱️ 3일
> 📄 [06-chat-pages.md](./06-chat-pages.md)

- [x] 채팅방 목록 페이지 (`/chat`)
- [x] 채팅방 페이지 (`/chat/[id]`)
- [x] 메시지 버블 컴포넌트
- [x] 채팅 입력 컴포넌트
- [x] 채팅방 생성 모달
- [x] 타이핑 인디케이터 UI
- [x] 읽음 표시 UI
- [x] AI 감정분석 결과 표시

### Phase 7: 친구 관리 화면 개발 ⏱️ 2일
> 📄 [07-friends-pages.md](./07-friends-pages.md)

- [x] 친구 목록 페이지 (`/friends`)
- [x] 친구 검색 페이지 (`/friends/search`)
- [x] 친구 요청 관리 UI
- [x] 온라인 상태 표시 UI
- [x] 친구 프로필 카드 컴포넌트

### Phase 8: 대시보드 화면 개발 ⏱️ 2일
> 📄 [08-dashboard-pages.md](./08-dashboard-pages.md)

- [x] 대시보드 메인 페이지 (`/`)
- [x] 활동 통계 카드
- [x] 인기 게시글 섹션
- [x] 최근 활동 타임라인
- [x] 차트 컴포넌트 (Recharts)

### Phase 9: 설정 화면 개발 ⏱️ 2일
> 📄 [09-settings-pages.md](./09-settings-pages.md)

- [x] 프로필 페이지 (`/profile`)
- [x] 설정 메인 페이지 (`/settings`)
- [x] 비밀번호 변경 페이지 (`/settings/password`)
- [x] 계정 탈퇴 페이지 (`/settings/delete-account`)
- [x] 알림 설정 UI
- [x] 다크 모드 토글
- [x] 이용약관/개인정보 처리방침 페이지

### Phase 10: 백엔드 API 구축 ⏱️ 5일
> 📄 [10-backend-api.md](./10-backend-api.md)

- [x] Prisma 스키마 작성 및 마이그레이션
- [x] NextAuth.js 설정
- [x] 인증 API (회원가입, 로그인, OAuth)
- [x] 사용자 API
- [x] 게시판 API (CRUD, 좋아요, 조회수)
- [x] 댓글 API (CRUD, 대댓글)
- [x] 채팅 API (채팅방 CRUD, 메시지 저장)
- [x] 친구 API (요청, 수락/거절, 목록)
- [x] 대시보드 API (통계, 인기글)
- [x] 알림 API
- [ ] Mock Data → 실제 API 연동

### Phase 11: AI 서버 연동 ⏱️ 2일
> 📄 [11-ai-integration.md](./11-ai-integration.md)

- [x] AI 서버 연동 서비스 구현
- [x] 게시글 작성 시 감정분석 연동
- [x] 댓글 작성 시 감정분석 연동
- [x] 채팅 메시지 감정분석 연동
- [x] 유해 콘텐츠 경고 모달 구현

### Phase 12: Socket 서버 연동 ⏱️ 3일
> 📄 [12-socket-integration.md](./12-socket-integration.md)

- [x] Socket.IO 클라이언트 설정
- [x] 채팅 실시간 메시지 연동
- [x] 타이핑 인디케이터 연동
- [x] 읽음 확인 연동
- [x] 온라인 상태 연동
- [x] 실시간 알림 연동

### Phase 13: 최적화 및 마무리 ⏱️ 2일
> 📄 [13-optimization.md](./13-optimization.md)

- [x] 이미지 최적화 (next/image)
- [x] 코드 스플리팅 검토
- [x] 번들 크기 최적화
- [x] SEO 메타 태그 설정
- [x] Error Boundary 구현
- [x] Loading UI 최적화
- [ ] Lighthouse 성능 점검

---

## 📊 진행률

| Phase | 작업 | 예상 일수 | 상태 |
|-------|------|----------|------|
| 0 | 프로젝트 초기 설정 | 1일 | ✅ 완료 |
| 1 | 디자인 시스템 구축 | 1일 | ✅ 완료 |
| 2 | 공통 컴포넌트 개발 | 3일 | ✅ 완료 |
| 3 | 레이아웃 구현 | 2일 | ✅ 완료 |
| 4 | 인증 화면 개발 | 3일 | ✅ 완료 |
| 5 | 게시판 화면 개발 | 4일 | ✅ 완료 |
| 6 | 채팅 화면 개발 | 3일 | ✅ 완료 |
| 7 | 친구 관리 화면 개발 | 2일 | ✅ 완료 |
| 8 | 대시보드 화면 개발 | 2일 | ✅ 완료 |
| 9 | 설정 화면 개발 | 2일 | ✅ 완료 |
| 10 | 백엔드 API 구축 | 5일 | ✅ 완료 |
| 11 | AI 서버 연동 | 2일 | ✅ 완료 |
| 12 | Socket 서버 연동 | 3일 | ✅ 완료 |
| 13 | 최적화 및 마무리 | 2일 | ✅ 완료 |
| **총계** | | **35일** | **100%** |

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

**최종 업데이트**: 2026년 2월 1일
