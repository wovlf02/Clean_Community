# 기술 스택

**관련 문서**: [시스템 설계](./system-design.md) | [프로젝트 개요](../01_overview/project-overview.md)

---

## 1. Frontend (Next.js)

### 1.1 프레임워크

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 16 | React 기반 풀스택 프레임워크 |
| **React** | 19+ | UI 라이브러리 |
| **TypeScript** | 5.x | 정적 타입 언어 |

### 1.2 상태 관리

| 기술 | 용도 |
|------|------|
| **Zustand** | 전역 상태 관리 (경량) |
| **React Query (TanStack Query)** | 서버 상태 관리, 캐싱 |
| **React Hook Form** | 폼 상태 관리 |

### 1.3 스타일링

| 기술 | 용도 |
|------|------|
| **Tailwind CSS** | 유틸리티 우선 CSS |
| **shadcn/ui** | UI 컴포넌트 라이브러리 |
| **Lucide Icons** | 아이콘 |
| **Framer Motion** | 애니메이션 |

### 1.4 실시간 통신

| 기술 | 용도 |
|------|------|
| **socket.io-client** | WebSocket 클라이언트 |

### 1.5 HTTP 클라이언트

| 기술 | 용도 |
|------|------|
| **fetch (내장)** | Next.js 내장 fetch |
| **axios** | REST API 통신 (선택) |

### 1.6 기타

| 기술 | 용도 |
|------|------|
| **Zod** | 스키마 검증 |
| **date-fns** | 날짜 처리 |
| **recharts** | 차트/그래프 (대시보드) |

---

## 2. Backend - Main (Next.js API Routes)

### 2.1 프레임워크

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js API Routes** | 16 | REST API 엔드포인트 |
| **NextAuth.js** | 5.x (Auth.js) | 인증/인가 |

### 2.2 데이터베이스

| 기술 | 용도 |
|------|------|
| **PostgreSQL** | 메인 관계형 데이터베이스 |
| **Prisma** | TypeScript ORM |

### 2.3 파일 저장

| 기술 | 용도 |
|------|------|
| **AWS S3** | 파일/이미지 저장 |
| **@aws-sdk/client-s3** | S3 클라이언트 |

### 2.4 기타

| 기술 | 용도 |
|------|------|
| **bcrypt** | 비밀번호 해시 |
| **nodemailer** | 이메일 발송 |

---

## 3. Backend - AI Model (FastAPI)

### 3.1 런타임

| 기술 | 버전 | 용도 |
|------|------|------|
| **Python** | 3.11.9 | 프로그래밍 언어 |
| **FastAPI** | 0.100+ | 고성능 API 프레임워크 |
| **Uvicorn** | - | ASGI 서버 |

### 3.2 AI/ML

| 기술 | 용도 |
|------|------|
| **PyTorch** | 딥러닝 프레임워크 (2.0+) |
| **Transformers** | 사전학습 모델 로드 (4.30+) |
| **NumPy** | 수치 연산 |
| **Scikit-learn** | 성능 평가 |

### 3.3 앙상블 모델

3-모델 하이브리드 앙상블 구조로 9개 혐오 카테고리를 동시에 탐지합니다.

| 모델 | 파일명 | 역할 | HuggingFace |
|------|--------|------|-------------|
| **KcELECTRA** | kcelectra.pt | 슬랭/욕설 전문가 | beomi/KcELECTRA-base |
| **SoongsilBERT** | soongsil.pt | 안정적 베이스라인 | soongsil-ai/soongsil-bert-base |
| **KLUE-RoBERTa** | roberta_base.pt | 고맥락 의미론 전문가 | klue/roberta-base |

### 3.4 모델 성능

| 지표 | 성능 |
|------|------|
| **Hamming Accuracy** | 96.72% ✅ |
| **F1-Macro** | 82.91% ✅ |
| **F1-Micro** | 81.08% |
| **Exact Match** | 74.63% |

### 3.5 혐오 카테고리 (9개)

```
여성/가족 | 남성 | 성소수자 | 인종/국적 | 연령 | 지역 | 종교 | 기타 혐오 | 악플/욕설
```

### 3.6 학습 데이터셋

| 항목 | 내용 |
|------|------|
| **데이터셋** | UnSmile (Smilegate AI) |
| **샘플 수** | 약 18,000개 |
| **레이블링** | 전문가 어노테이션 |

### 3.7 기타

| 기술 | 용도 |
|------|------|
| **Pydantic** | 데이터 검증 |
| **python-multipart** | 파일 업로드 |

---

## 4. Backend - Socket Server (Express.js)

### 4.1 런타임

| 기술 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 24.11.0 LTS | JavaScript 런타임 |
| **TypeScript** | 5.x | 정적 타입 언어 |

### 4.2 프레임워크

| 기술 | 용도 |
|------|------|
| **Express** | HTTP 서버 (헬스체크) |
| **Socket.IO** | WebSocket 서버 |

### 4.3 스케일링

| 기술 | 용도 |
|------|------|
| **@socket.io/redis-adapter** | 다중 인스턴스 동기화 |
| **ioredis** | Redis 클라이언트 |

### 4.4 보안

| 기술 | 용도 |
|------|------|
| **jsonwebtoken** | JWT 검증 |
| **helmet** | HTTP 보안 헤더 |
| **cors** | CORS 처리 |

---

## 5. 데이터베이스

### 5.1 메인 데이터베이스

| 기술 | 버전 | 용도 |
|------|------|------|
| **PostgreSQL** | 15+ | 관계형 데이터베이스 |
| **Amazon RDS** | - | 관리형 DB 서비스 |

### 5.2 캐시

| 기술 | 용도 |
|------|------|
| **Redis** | 세션 캐시, Pub/Sub |
| **ElastiCache** | 관리형 Redis |

---

## 6. AWS 서비스

### 6.1 컴퓨팅

| 서비스 | 용도 |
|--------|------|
| **EC2** | FastAPI, Socket Server 호스팅 |
| **ECS Fargate** | 컨테이너 기반 배포 (선택) |
| **Lambda** | 서버리스 함수 (선택) |

### 6.2 스토리지

| 서비스 | 용도 |
|--------|------|
| **S3** | 파일/이미지 저장 |
| **CloudFront** | CDN |

### 6.3 데이터베이스

| 서비스 | 용도 |
|--------|------|
| **RDS (PostgreSQL)** | 메인 데이터베이스 |
| **ElastiCache (Redis)** | 캐시, Socket Pub/Sub |

### 6.4 네트워킹

| 서비스 | 용도 |
|--------|------|
| **VPC** | 네트워크 격리 |
| **ALB** | 로드 밸런싱 |
| **Route 53** | DNS 관리 |

### 6.5 모니터링

| 서비스 | 용도 |
|--------|------|
| **CloudWatch** | 로그, 메트릭, 알람 |
| **X-Ray** | 분산 추적 (선택) |

### 6.6 보안

| 서비스 | 용도 |
|--------|------|
| **IAM** | 권한 관리 |
| **Secrets Manager** | 비밀 관리 |
| **WAF** | 웹 방화벽 (선택) |

---

## 7. 개발/배포 도구

### 7.1 버전 관리

| 기술 | 용도 |
|------|------|
| **Git** | 버전 관리 |
| **GitHub** | 코드 저장소 |

### 7.2 CI/CD

| 기술 | 용도 |
|------|------|
| **GitHub Actions** | CI/CD 파이프라인 |
| **Docker** | 컨테이너화 |

### 7.3 호스팅

| 서비스 | 용도 |
|--------|------|
| **Vercel** | Next.js 호스팅 |
| **AWS** | 백엔드 서비스 호스팅 |

### 7.4 개발 도구

| 기술 | 용도 |
|------|------|
| **ESLint** | 코드 린팅 |
| **Prettier** | 코드 포맷팅 |
| **Husky** | Git Hooks |

---

## 8. 인증 (NextAuth.js)

### 8.1 인증 방식

| 방식 | 설명 |
|------|------|
| **Credentials** | 이메일/비밀번호 로그인 |
| **OAuth** | Google, Kakao, Naver 소셜 로그인 |

### 8.2 인증 흐름

```
[회원가입]
Client → POST /api/auth/signup → 비밀번호 BCrypt 해시 → DB 저장

[로그인]
Client → POST /api/auth/signin → NextAuth.js → JWT 발급

[API 호출]
Client → API Routes → getServerSession() → 세션 검증

[토큰 갱신]
NextAuth.js 자동 처리 (JWT Strategy)
```

### 8.3 세션 설정

| 항목 | 값 |
|------|-----|
| **Strategy** | JWT |
| **Max Age** | 30일 |
| **Update Age** | 24시간 |

---

## 9. 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client (Browser)                           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │ HTTPS         │ WSS           │ HTTPS
                    ▼               ▼               ▼
            ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
            │   Next.js     │ │  Socket.IO    │ │   FastAPI     │
            │   (Vercel)    │ │  (EC2/ECS)    │ │   (EC2/ECS)   │
            │               │ │               │ │               │
            │ • SSR/SSG     │ │ • 실시간 채팅 │ │ • AI 감정분석 │
            │ • API Routes  │ │ • 알림        │ │ • .pt 모델    │
            │ • NextAuth    │ │ • 상태 동기화 │ │               │
            └───────┬───────┘ └───────┬───────┘ └───────────────┘
                    │                 │
                    │    ┌────────────┤
                    ▼    ▼            ▼
            ┌───────────────┐ ┌───────────────┐
            │  PostgreSQL   │ │    Redis      │
            │    (RDS)      │ │ (ElastiCache) │
            └───────────────┘ └───────────────┘
                    │
                    ▼
            ┌───────────────┐
            │      S3       │
            │  (Storage)    │
            └───────────────┘
```

---

**최종 업데이트**: 2026년 1월 30일
