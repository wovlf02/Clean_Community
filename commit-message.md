docs: Next.js 프론트엔드 개발 TODO 문서 작성

Next.js 16 기반 프론트엔드/백엔드 구축을 위한 상세 TODO 문서 작성

- Phase 0-13 단계별 개발 가이드 생성 (총 35일 예상)
- UI/CSS 파일 분리 방식 적용
- UX 극대화 설계 원칙 문서화
- npm 패키지 매니저 사용 (안정성 우선)
- Mock 데이터 기반 프론트엔드 우선 개발 전략

주요 Phase:
- Phase 0: 프로젝트 초기 설정 (패키지 설치, 폴더 구조)
- Phase 1: 디자인 시스템 구축 (Tailwind, 테마, 폰트)
- Phase 2: 공통 컴포넌트 개발 (Button, Input, Card, Modal 등)
  - 폴더 분리 구조로 문서 크기 최적화 (5개 하위 문서)
- Phase 3: 레이아웃 구현 (Header, Sidebar, BottomTab)
- Phase 4-9: 화면 개발 (인증, 게시판, 채팅, 친구, 대시보드, 설정)
- Phase 10: 백엔드 API 구축 (Prisma, NextAuth)
- Phase 11: AI 서버 연동 (감정분석)
- Phase 12: Socket 서버 연동 (실시간 채팅)
- Phase 13: 최적화 및 마무리 (성능, SEO, 에러 처리)

기술 스택:
- Next.js 16.1.6, React 19.2.3, TypeScript 5.x
- Tailwind CSS, shadcn/ui
- Zustand, React Query, React Hook Form, Zod
- NextAuth.js 5.x, Prisma 5.x
- AI 서버 (8000 포트), Socket 서버 (4000 포트)

문서 위치: docs/08_todo/nextjs/
