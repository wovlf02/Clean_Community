docs: Clean Community 프로젝트 문서 초기 작성

프로젝트의 전체 문서 구조 및 상세 설계 문서 작성 완료

**문서 구조:**

1. 개요 (01_overview)
   - 프로젝트 개요 및 목표
   - 용어 사전 (glossary)

2. 요구사항 (02_requirements)
   - 기능 요구사항 (44개)
     * 사용자 인증 (6개)
     * 게시판 (14개)
     * 채팅 (8개)
     * 친구 관리 (6개)
     * 대시보드 (5개)
     * AI 감정분석 (5개)
   - 비기능 요구사항
     * 성능, 보안, 확장성 등

3. 아키텍처 (03_architecture)
   - 시스템 설계
     * 마이크로서비스 아키텍처
     * Next.js + Express.js + FastAPI 구조
     * AI 감정분석 프로세스 흐름
   - 기술 스택
     * Frontend: Next.js 14+, TypeScript, Tailwind CSS
     * Backend: Next.js API Routes, Express.js (Socket), FastAPI (AI)
     * Database: PostgreSQL + Prisma ORM
     * Infra: AWS (Vercel, EC2/ECS, RDS, S3, CloudFront)

4. 데이터베이스 (04_database)
   - 데이터베이스 스키마 설계
   - 엔티티 관계도 (ERD)
   - 테이블 구조 상세 명세

5. 화면 설계 (05_screens)
   - 공통 컴포넌트 (00_common)
     * 디자인 시스템 (색상, 타이포그래피, 간격)
     * 레이아웃 구조
     * 재사용 컴포넌트 (버튼, 입력, 카드, 모달, 토스트 등)
     * AI 감정분석 경고 모달
   - 인증 화면 (01_auth)
     * 로그인, 회원가입, 비밀번호 재설정
   - 게시판 화면 (02_board)
     * 게시글 목록, 상세, 작성/수정
     * 댓글/대댓글 시스템
     * AI 감정분석 적용
   - 채팅 화면 (03_chat)
     * 카카오톡 스타일 메시지 UI
     * 1:1 / 그룹 채팅
     * 읽음 상태 표시 규칙
     * AI 감정분석 적용
   - 친구 화면 (04_friends)
     * 친구 목록, 검색, 요청 관리
   - 대시보드 화면 (05_dashboard)
     * 통계 및 활동 요약
   - 설정 화면 (06_settings)
     * 프로필 설정, 알림 설정 등

6. 개발 가이드 (06_development)
   - 코딩 컨벤션
     * TypeScript, React, CSS 규칙
   - 개발 환경 설정
     * 로컬 환경 구성 가이드

7. 배포 (07_deployment)
   - AWS 배포 가이드
     * Vercel, EC2/ECS, RDS, S3 설정

8. TODO (08_todo)
   - 개발 작업 목록 및 우선순위

9. Git 컨벤션 (09_git)
   - 브랜치 전략
   - 커밋 메시지 규칙
   - PR 템플릿

10. AWS 인프라 (10_aws)
    - AWS 서비스 구성 가이드

11. 보안 (11_security)
    - 보안 정책 및 가이드라인

12. API (12_api)
    - API 명세 및 문서

**주요 특징:**

- 카카오톡 스타일의 직관적인 채팅 UI
  * 본인/상대방 메시지 구분 명확
  * 읽지 않은 참여자 수 실시간 표시
  * 1:1 / 그룹 채팅 읽음 상태 관리

- AI 기반 감정분석 시스템 (한국어 전용)
  * 게시글, 댓글, 채팅 메시지 실시간 분석
  * 악성 표현 감지 시 경고 모달 표시
  * 수정 권장 및 모니터링 대상 자동 등록
  * 관리자 대시보드 연동

- 체계적인 문서 구조
  * 요구사항부터 배포까지 전 과정 문서화
  * 상세한 화면 설계 및 컴포넌트 명세
  * 개발 가이드 및 컨벤션 정립

**문서 파일 (27개):**
- docs/README.md
- docs/01_overview/glossary.md
- docs/01_overview/project-overview.md
- docs/02_requirements/functional.md
- docs/02_requirements/non-functional.md
- docs/03_architecture/system-design.md
- docs/03_architecture/tech-stack.md
- docs/04_database/database-schema.md
- docs/04_database/entity-schema.md
- docs/05_screens/overview.md
- docs/05_screens/00_common/components.md
- docs/05_screens/00_common/design-system.md
- docs/05_screens/00_common/layouts.md
- docs/05_screens/01_auth/auth-screens.md
- docs/05_screens/02_board/board-screens.md
- docs/05_screens/03_chat/chat-screens.md
- docs/05_screens/04_friends/friends-screens.md
- docs/05_screens/05_dashboard/dashboard-screens.md
- docs/05_screens/06_settings/settings-screens.md
- docs/06_development/coding-conventions.md
- docs/06_development/setup.md
- docs/07_deployment/aws-deployment.md
- docs/08_todo/README.md
- docs/09_git/git-convention.md
- docs/10_aws/README.md
- docs/11_security/security-overview.md
- docs/12_api/README.md

