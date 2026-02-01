feat: Next.js 16 기반 프론트엔드 구현 및 문서 업데이트

AI 기반 감정분석 커뮤니티 플랫폼의 프론트엔드 전면 구현

## 주요 기능
- 사용자 인증 (로그인, 회원가입, 아이디 찾기, 비밀번호 재설정)
- 게시판 (목록, 상세, 작성, 수정, 삭제, 좋아요, 댓글/대댓글)
- 채팅 (1:1 DM, 그룹 채팅, 실시간 메시지, 음성/영상 통화 UI)
- 친구 관리 (친구 목록, 친구 요청, 친구 검색, 온라인 상태)
- 대시보드 (통계, 인기 게시글, 최근 활동, 차트)
- 설정 (프로필, 비밀번호 변경, 계정 탈퇴, 알림 설정)
- 관리자 대시보드 (사용자 관리, 게시글 관리, 신고 관리, 분석)

## 기술 스택
- Next.js 16.1.6, React 19.2.3, TypeScript 5.x
- Tailwind CSS v4, shadcn/ui
- Zustand (전역 상태), TanStack Query (서버 상태)
- NextAuth.js v5 (인증)
- Prisma 7.x + PostgreSQL (데이터베이스)
- Socket.IO (실시간 통신)

## 프로젝트 구조
- src/app/(auth): 인증 페이지 그룹
- src/app/(main): 메인 레이아웃 페이지 그룹
- src/app/api: API Routes
- src/components: 재사용 가능한 컴포넌트
- src/hooks: 커스텀 훅
- src/lib: 유틸리티 함수
- src/providers: Context Providers
- src/store: Zustand 스토어
- src/types: TypeScript 타입 정의

## 문서 업데이트
- docs/01_overview: 프로젝트 개요 및 진행 상태 업데이트
- docs/02_requirements: 기능/비기능 요구사항 날짜 업데이트
- docs/03_architecture: 기술 스택 버전 업데이트 (Next.js 16.1.6, Prisma 7.x)
- docs/04_database: 데이터베이스 스키마 업데이트 (Prisma 7.x)
- docs/05_screens: 화면 설계 개요 업데이트 (Next.js 16+)
- docs/06_development: 개발 환경 설정 업데이트 (cc 폴더 구조)
- docs/07_deployment: AWS 배포 가이드 업데이트
- docs/08_todo: TODO 체크리스트 업데이트 (진행률 85%)
- docs/09_git: Git 컨벤션 날짜 업데이트
- docs/11_security: 보안 설계 업데이트 (bcryptjs)
- docs/12_api: API 명세서 날짜 업데이트
- docs/complement: 개선 사항 문서 추가
