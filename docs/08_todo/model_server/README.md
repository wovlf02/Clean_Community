# AI 모델 서버 (FastAPI) 개발 TODO

**관련 문서**: [시스템 설계](../../03_architecture/system-design.md) | [기술 스택](../../03_architecture/tech-stack.md) | [AI 모델 문서](../../../ai-model/docs/README.md)

---

## 📋 개요

이 문서는 감정분석 AI 모델을 FastAPI 서버에 배포하여 Next.js 기반 웹 애플리케이션과 연동하기 위한 개발 TODO를 정리한 문서입니다.

### 핵심 목표

| 항목 | 내용 |
|------|------|
| **서버 프레임워크** | FastAPI 0.100+ |
| **Python 버전** | 3.11.9 |
| **AI 모델** | 3-모델 하이브리드 앙상블 (KcELECTRA, SoongsilBERT, RoBERTa-Base) |
| **탐지 카테고리** | 9개 혐오 카테고리 동시 탐지 |
| **연동 대상** | Next.js 16 (게시글, 댓글, 채팅 메시지 감정분석) |
| **Node.js 버전** | 24.11.0 LTS |
| **배포 환경** | AWS ECS Fargate |

---

## 📁 문서 구성

| 문서 | 설명 |
|------|------|
| [01_프로젝트_구조.md](./01_프로젝트_구조.md) | FastAPI 프로젝트 디렉토리 구조 설계 |
| [02_환경_설정.md](./02_환경_설정.md) | 개발 환경 및 의존성 설정 |
| [03_모델_로딩.md](./03_모델_로딩.md) | PT 모델 로드 및 앙상블 구성 |
| [04_API_엔드포인트.md](./04_API_엔드포인트.md) | REST API 설계 및 구현 |
| [05_NextJS_연동.md](./05_NextJS_연동.md) | Next.js 웹 애플리케이션 연동 |
| [06_테스트_및_검증.md](./06_테스트_및_검증.md) | 테스트 전략 및 품질 보증 |
| [07_배포.md](./07_배포.md) | Docker 및 AWS 배포 |

---

## ✅ 전체 체크리스트

### Phase 1: 기반 구축

- [x] FastAPI 프로젝트 구조 생성
- [x] 개발 환경 설정 (Python 가상환경, 의존성)
- [x] 모델 파일 (.pt) 로드 로직 구현
- [x] 토크나이저 초기화
- [x] 앙상블 추론 로직 구현

### Phase 2: API 개발

- [x] 단일 텍스트 분석 API (`POST /analyze`)
- [x] 배치 텍스트 분석 API (`POST /analyze/batch`)
- [x] 헬스체크 API (`GET /health`)
- [x] 에러 핸들링 및 응답 스키마
- [ ] Rate Limiting 적용

### Phase 3: 연동 및 테스트

- [ ] Next.js AIService 구현
- [ ] 게시글/댓글/채팅 메시지 분석 연동
- [ ] 경고 모달 UI 연동
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성

### Phase 4: 배포

- [x] Dockerfile 작성
- [ ] Docker 이미지 빌드 및 테스트
- [ ] AWS ECS Fargate 배포
- [ ] 모니터링 설정 (CloudWatch)
- [ ] CI/CD 파이프라인 구성

---

## 🔗 참고 문서

### 프로젝트 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| 시스템 설계 | `docs/03_architecture/system-design.md` | 전체 시스템 아키텍처 |
| 기술 스택 | `docs/03_architecture/tech-stack.md` | 기술 스택 상세 |
| 기능 요구사항 | `docs/02_requirements/functional.md` | AI 감정분석 요구사항 (FR-40~44) |
| 비기능 요구사항 | `docs/02_requirements/non-functional.md` | 성능/보안 요구사항 |
| API 명세서 | `docs/12_api/README.md` | API 응답 형식 참고 |
| AWS 배포 가이드 | `docs/07_deployment/aws-deployment.md` | ECS Fargate 배포 |
| 개발 환경 설정 | `docs/06_development/setup.md` | 프로젝트 구조 및 환경 변수 |

### AI 모델 문서

| 문서 | 경로 | 설명 |
|------|------|------|
| 프로젝트 개요 | `ai-model/docs/01_프로젝트_개요.md` | 모델 개요 및 목표 |
| 데이터 분석 | `ai-model/docs/02_데이터_분석.md` | 데이터셋 및 클래스 분포 |
| 모델 아키텍처 | `ai-model/docs/03_모델_아키텍처.md` | 앙상블 구조 및 추론 로직 |
| 학습 전략 | `ai-model/docs/04_학습_전략.md` | 학습 파이프라인 |
| 실험 결과 | `ai-model/docs/05_실험_결과.md` | 모델 성능 지표 |

### 모델 파일

| 파일 | 경로 | 설명 |
|------|------|------|
| KcELECTRA | `ai-model/models/kcelectra.pt` | 슬랭/욕설 전문가 모델 |
| SoongsilBERT | `ai-model/models/soongsil.pt` | 안정적 베이스라인 모델 |
| RoBERTa-Base | `ai-model/models/roberta_base.pt` | 고맥락 의미론 전문가 모델 |

---

## 🎯 마일스톤

| 버전 | 목표 | 상태 |
|------|------|------|
| v0.1.0 | FastAPI 기본 구조 + 모델 로딩 | ✅ 완료 |
| v0.2.0 | API 엔드포인트 완성 | ✅ 완료 |
| v0.3.0 | Next.js 연동 완료 | 📋 진행 예정 |
| v1.0.0 | AWS 배포 + 프로덕션 준비 | 📋 진행 예정 |

---

**최종 업데이트**: 2026년 1월 31일
