# 📚 감성 커뮤니티 문서

> Next.js + FastAPI + Express.js 기반 AI 감정분석 커뮤니티 플랫폼

## 📋 문서 구조

```
docs/
├── 01_overview/           # 프로젝트 개요
│   ├── project-overview.md
│   └── glossary.md
├── 02_requirements/       # 요구사항 정의
│   ├── functional.md
│   └── non-functional.md
├── 03_architecture/       # 아키텍처 설계
│   ├── tech-stack.md
│   ├── system-design.md
│   └── file-structure.md
├── 04_database/           # 데이터베이스 설계
│   ├── database-schema.md
│   └── entity-schema.md
├── 05_screens/            # 화면 설계
│   ├── overview.md
│   ├── 00_common/         # 공통 컴포넌트
│   ├── 01_auth/           # 인증
│   ├── 02_board/          # 게시판
│   ├── 03_chat/           # 채팅
│   ├── 04_friends/        # 친구 관리
│   ├── 05_dashboard/      # 대시보드
│   └── 06_settings/       # 설정
├── 06_development/        # 개발 가이드
│   ├── setup.md
│   └── coding-conventions.md
├── 07_deployment/         # 배포 가이드
│   └── aws-deployment.md
├── 08_todo/               # 개발 TODO
│   └── README.md
├── 09_git/                # Git 컨벤션
│   └── git-convention.md
├── 10_aws/                # AWS 설정
│   └── README.md
├── 11_security/           # 보안 설계
│   └── security-overview.md
└── 12_api/                # API 명세
    └── README.md
```

## 🎯 프로젝트 요약

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 감성 커뮤니티 (Emotion Community) |
| **대상 사용자** | 일반 사용자 |
| **서비스 형태** | Web (SaaS) |
| **프론트엔드** | Next.js + TypeScript |
| **백엔드 API** | FastAPI (AI 모델) + Next.js API Routes |
| **실시간 서버** | Express.js + Socket.IO |
| **데이터베이스** | PostgreSQL + Prisma ORM |
| **인증** | NextAuth.js |
| **배포** | AWS |

## 🚀 핵심 기능

| 기능 | 설명 |
|------|------|
| **게시판** | 게시글 CRUD, 댓글/대댓글, 좋아요, 공유, 첨부파일, 조회수 |
| **채팅** | 1:1/그룹 채팅, 텍스트/이모티콘/사진 전송, 실시간 WebSocket |
| **친구 관리** | 친구 추가/삭제, 목록 조회, 검색, 1:1 채팅 바로가기 |
| **대시보드** | 사용자 활동 통계, 인기 게시글, 최근 활동 시각화 |
| **AI 감정분석** | 한국어 텍스트 9개 카테고리 다중 라벨 분류 |

---

## 🧠 AI 혐오 표현 탐지 모델

### 모델 아키텍처

3-모델 하이브리드 앙상블 구조로 **9개 혐오 카테고리**를 동시에 탐지합니다.

| 모델 | 역할 | 특징 |
|------|------|------|
| **KcELECTRA** | 슬랭/욕설 전문가 | 한국어 인터넷 언어에 특화 |
| **SoongsilBERT** | 안정적 베이스라인 | 균형 잡힌 범용 성능 |
| **KLUE-RoBERTa** | 고맥락 의미론 전문가 | 문맥 이해력 우수 |

### 성능 지표

| 지표 | 목표 | 달성 |
|------|------|------|
| **Hamming Accuracy** | 95% | **96.22%** ✅ |
| **Exact Match** | 70% | **73.37%** ✅ |
| **평균 F1-Score** | 80% | **79.6%** ✅ |

> **테스트 환경**: UnSmile 테스트 데이터셋 3,737개 샘플

### 혐오 카테고리 (9개)

| 카테고리 | 설명 |
|----------|------|
| 여성/가족 | 여성 및 가족 관련 혐오 |
| 남성 | 남성 관련 혐오 |
| 성소수자 | LGBTQ+ 관련 혐오 |
| 인종/국적 | 인종 및 국적 관련 혐오 |
| 연령 | 연령 관련 혐오 |
| 지역 | 특정 지역 관련 혐오 |
| 종교 | 종교 관련 혐오 |
| 기타 혐오 | 기타 유형의 혐오 |
| 악플/욕설 | 일반적인 악성 댓글 |

### AI 모델 상세 문서

| 문서 | 설명 |
|------|------|
| [01_프로젝트_개요](../ai-model/docs/01_프로젝트_개요.md) | 프로젝트 배경, 목표, 범위 |
| [02_데이터_분석](../ai-model/docs/02_데이터_분석.md) | UnSmile 데이터셋 EDA 및 전처리 |
| [03_모델_아키텍처](../ai-model/docs/03_모델_아키텍처.md) | 3개 모델 설계 및 앙상블 구조 |
| [04_학습_전략](../ai-model/docs/04_학습_전략.md) | 손실 함수, 최적화, 하이퍼파라미터 |
| [05_실험_결과](../ai-model/docs/05_실험_결과.md) | 성능 평가 및 분석 |

### AI API 서버 문서

| 문서 | 설명 |
|------|------|
| [서버 개요](../ai_server/docs/README.md) | API 서버 전체 개요 |
| [아키텍처](../ai_server/docs/01_architecture/README.md) | 시스템 구조 및 모듈 설명 |
| [API 명세](../ai_server/docs/02_api/README.md) | 엔드포인트 상세 문서 |
| [배포 가이드](../ai_server/docs/03_deployment/README.md) | Docker 및 서버 배포 방법 |

---

## 📖 문서 읽는 순서

1. [프로젝트 개요](./01_overview/project-overview.md)
2. [기능 요구사항](./02_requirements/functional.md)
3. [기술 스택](./03_architecture/tech-stack.md)
4. [시스템 설계](./03_architecture/system-design.md)
5. [데이터베이스 스키마](./04_database/database-schema.md)
6. [화면 설계 개요](./05_screens/overview.md)
7. [개발 환경 설정](./06_development/setup.md)
8. [API 명세](./12_api/README.md)
9. [AI 모델 문서](../ai-model/docs/README.md) ← **NEW**

---

**최종 업데이트**: 2026년 1월 31일
