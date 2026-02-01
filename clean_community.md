# Clean Community - AI 기반 감정분석 커뮤니티 플랫폼

URL: https://github.com/wovlf02/Clean_Community
기술: Next.js, React, TypeScript, NextAuth.js, Prisma, PostgreSQL, Socket.IO, FastAPI, Python, PyTorch, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Recharts, bcryptjs
날짜: 2026년 1월 15일 → 2026년 2월 2일
팀구성: 개인 프로젝트

<aside>

*🎨 AI 기반 감정분석 기술을 활용하여 혐오 표현과 악성 댓글을 실시간으로 탐지하고, 건강한 온라인 소통 문화를 조성하는 커뮤니티 플랫폼*

</aside>

<aside>

> ***Information***
> 

**개발 기간:** 2026/01/15 ~ 2026/02/02

**팀 구성: 1**인

**담당 업무:** 기획, 문서화, AI 모델 개발, 풀스택 개발

</aside>

<aside>

> ***Review***
> 
**프로젝트 진행률: 85%**

- ✅ Phase 1 (MVP): 인증, 게시판, 댓글 기능 완료
- ✅ Phase 2 (핵심 기능): 채팅, 친구 관리, AI 감정분석 연동 완료
- ✅ Phase 3 (고도화): 대시보드, 관리자 기능, UI/UX 최적화 완료
- ⏳ Phase 4 (배포): AWS 인프라 구성 예정

</aside>

### 01. GitHub

[https://github.com/wovlf02/Clean_Community](https://github.com/wovlf02/Clean_Community)

### 02. 프로젝트 문서

**프로젝트 개요**: [docs/01_overview/project-overview.md](./docs/01_overview/project-overview.md)
**기술 스택**: [docs/03_architecture/tech-stack.md](./docs/03_architecture/tech-stack.md)
**API 명세서**: [docs/12_api/README.md](./docs/12_api/README.md)
**TODO 체크리스트**: [docs/08_todo/README.md](./docs/08_todo/README.md)

### 03. 개발 중 이슈 및 해결

<aside>

 **⏲ 효율성 개선**

1. **마이크로서비스 아키텍처 설계**: Next.js(웹/API), Express.js(소켓 서버), FastAPI(AI 서버)를 독립적으로 구성하여 각 서버의 확장성 및 유지보수성 확보
2. **API Routes 도메인별 분리**: cc/src/app/api 폴더 내에 auth, posts, comments, chat, friends, dashboard, notifications, analyze, users 등 도메인별로 분리하여 관리
3. **컴포넌트 기반 모듈화**: Next.js의 App Router를 활용하여 페이지와 컴포넌트를 명확히 분리하고, 각 도메인별로 폴더 구조 설계 (auth, board, chat, friends, dashboard, settings, admin)
4. **CSS Modules 활용**: tsx 파일과 css 파일을 분리하여 스타일 충돌 방지 및 유지보수성 향상
5. **프로젝트 구조 최적화**: cc(Next.js), socket_server(Express.js), ai_server(FastAPI), docs(문서) 폴더로 명확히 분리하여 관리
6. **역할 분담**: Next.js는 HTTP/REST API 및 SSR 전담, Socket 서버는 실시간 채팅/알림 처리, AI 서버는 감정분석 전담
7. **Prisma ORM 활용**: 타입 안정성 확보 및 데이터베이스 마이그레이션 자동화, generated 폴더로 클라이언트 출력 경로 분리

</aside>

<aside>

 **🤖 AI 모델 개발**

1. **3-모델 하이브리드 앙상블**: KcELECTRA(슬랭 전문가), SoongsilBERT(안정적 베이스라인), KLUE-RoBERTa(고맥락 전문가)를 앙상블하여 **Hamming Accuracy 96.22%** 달성
2. **멀티라벨 분류**: 여성/가족, 남성, 성소수자, 인종/국적, 연령, 지역, 종교, 기타 혐오, 악플/욕설 등 **9개 카테고리 동시 탐지**
3. **FastAPI 기반 추론 서버**: PyTorch 모델(.pt)을 FastAPI로 서빙하여 Next.js에서 HTTP 요청으로 실시간 감정분석 연동
4. **실시간 경고 시스템**: 게시글, 댓글, 채팅 메시지 작성 시 실시간으로 감정분석 수행 후 유해 콘텐츠 경고 모달 표시
5. **관리자 모니터링**: 사용자가 경고를 무시하고 전송한 콘텐츠는 자동으로 관리자 대시보드에 플래깅

</aside>

<aside>

 **🔄 실시간 통신 구현**

1. **Socket.IO 독립 서버**: Express.js 기반 Socket 서버를 별도로 구축하여 동적 할당 및 확장성 확보
2. **실시간 채팅**: 1:1 DM 및 그룹 채팅 지원, 메시지 전송/수신, 타이핑 인디케이터, 읽음 표시 구현
3. **실시간 알림**: 좋아요, 댓글, 친구 요청 등 실시간 알림 전송
4. **온라인 상태 관리**: 사용자 접속/종료 시 실시간 온라인 상태 업데이트 및 브로드캐스트
5. **Custom Hooks 활용**: use-chat-socket, use-online-status, use-realtime-notifications 등 재사용 가능한 훅 구현

</aside>

<aside>

 **📊 대시보드 및 관리자 기능**

1. **사용자 대시보드**: Recharts를 활용한 활동 통계 시각화 (주간 활동, 게시글/댓글/채팅 통계, 인기 게시글)
2. **관리자 대시보드**: 사용자 관리, 게시글 관리, 악성 콘텐츠 모니터링, 신고 관리, 분석 통계
3. **악성 콘텐츠 모니터링**: AI가 감지한 유해 콘텐츠를 자동으로 수집하고 관리자가 조치 가능
4. **역할 기반 접근 제어**: NextAuth.js의 Role(USER/ADMIN)을 활용한 권한 관리

</aside>

<aside>

 **🎨 UI/UX 최적화**

1. **Tailwind CSS v4 + shadcn/ui**: 유틸리티 우선 CSS와 재사용 가능한 컴포넌트 라이브러리로 일관된 디자인 시스템 구축
2. **다크 모드 지원**: next-themes를 활용한 라이트/다크 모드 전환
3. **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 화면 크기 대응 (Bottom Tab Bar, Sidebar, Header)
4. **로딩 및 에러 처리**: Suspense, loading.tsx, not-found.tsx, error.tsx를 활용한 사용자 경험 개선
5. **스켈레톤 UI**: 데이터 로딩 중 스켈레톤 UI 표시로 체감 성능 향상

</aside>

<aside>

 **📈 성능 최적화**

1. **Next.js 16 활용**: App Router, Server Components, Streaming SSR 등 최신 기능 활용
2. **React Query 캐싱**: TanStack Query를 활용한 서버 상태 캐싱 및 데이터 페칭 최적화
3. **코드 스플리팅**: 페이지별, 컴포넌트별 자동 코드 스플리팅으로 초기 로딩 속도 개선
4. **이미지 최적화**: next/image를 활용한 자동 이미지 최적화
5. **Prisma 7.x**: 최신 ORM 버전으로 쿼리 성능 및 타입 안정성 향상

</aside>