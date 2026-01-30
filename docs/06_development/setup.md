# 개발 환경 설정

**관련 문서**: [기술 스택](../03_architecture/tech-stack.md) | [코딩 컨벤션](./coding-conventions.md)

---

## 1. 필수 도구

### 1.1 개발 환경

| 도구 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 20+ LTS | JavaScript 런타임 |
| **pnpm** | 8+ | 패키지 매니저 (권장) |
| **Python** | 3.10+ | FastAPI 서버 |
| **PostgreSQL** | 15+ | 데이터베이스 |
| **Redis** | 7+ | 캐시/Pub-Sub (선택) |
| **Git** | 최신 | 버전 관리 |

### 1.2 추천 IDE

| IDE | 확장 프로그램 |
|-----|--------------|
| **VS Code** | ESLint, Prettier, Tailwind CSS IntelliSense, Prisma |
| **WebStorm** | 내장 지원 |
| **PyCharm** | FastAPI 지원 |

---

## 2. 프로젝트 구조

```
emotion-community/
├── apps/
│   ├── web/                    # Next.js 웹 앱
│   │   ├── app/                # App Router
│   │   ├── components/         # React 컴포넌트
│   │   ├── lib/                # 유틸리티
│   │   ├── hooks/              # 커스텀 훅
│   │   ├── store/              # Zustand 스토어
│   │   └── styles/             # 글로벌 스타일
│   │
│   ├── socket-server/          # Express.js 소켓 서버
│   │   ├── src/
│   │   │   ├── handlers/       # 이벤트 핸들러
│   │   │   ├── middlewares/    # 미들웨어
│   │   │   └── index.ts        # 엔트리포인트
│   │   └── package.json
│   │
│   └── ai-server/              # FastAPI AI 서버
│       ├── app/
│       │   ├── api/            # API 라우트
│       │   ├── models/         # ML 모델
│       │   ├── services/       # 서비스 레이어
│       │   └── main.py         # 엔트리포인트
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── database/               # Prisma 스키마
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   │
│   └── shared/                 # 공유 타입/유틸
│       ├── src/
│       └── package.json
│
├── docker-compose.yml          # 로컬 개발 환경
├── turbo.json                  # Turborepo 설정
├── pnpm-workspace.yaml         # pnpm 워크스페이스
└── package.json
```

---

## 3. 초기 설정

### 3.1 저장소 클론

```bash
git clone https://github.com/your-org/emotion-community.git
cd emotion-community
```

### 3.2 의존성 설치

```bash
# pnpm 설치 (없는 경우)
npm install -g pnpm

# 의존성 설치
pnpm install
```

### 3.3 환경 변수 설정

```bash
# 환경 변수 파일 복사
cp apps/web/.env.example apps/web/.env.local
cp apps/socket-server/.env.example apps/socket-server/.env
cp apps/ai-server/.env.example apps/ai-server/.env
```

### 3.4 환경 변수 (.env.local)

```env
# apps/web/.env.local

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/emotion_community?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth (선택)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""
NAVER_CLIENT_ID=""
NAVER_CLIENT_SECRET=""

# AI Server
AI_SERVER_URL="http://localhost:8000"

# Socket Server
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"

# AWS S3
AWS_REGION="ap-northeast-2"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
S3_BUCKET_NAME=""
```

### 3.5 데이터베이스 설정

```bash
# Docker로 PostgreSQL 실행
docker-compose up -d postgres

# Prisma 마이그레이션
pnpm db:migrate

# Prisma 클라이언트 생성
pnpm db:generate

# (선택) 시드 데이터
pnpm db:seed
```

---

## 4. 개발 서버 실행

### 4.1 전체 실행

```bash
# 모든 앱 동시 실행
pnpm dev
```

### 4.2 개별 실행

```bash
# Next.js 웹 앱
pnpm --filter web dev

# Socket 서버
pnpm --filter socket-server dev

# AI 서버 (Python)
cd apps/ai-server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4.3 Docker Compose

```bash
# 전체 환경 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f web
```

---

## 5. Docker Compose 설정

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: emotion_community
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/emotion_community
    depends_on:
      - postgres
      - redis

  socket-server:
    build:
      context: .
      dockerfile: apps/socket-server/Dockerfile
    ports:
      - "4000:4000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  ai-server:
    build:
      context: apps/ai-server
    ports:
      - "8000:8000"

volumes:
  postgres_data:
```

---

## 6. 유용한 스크립트

```json
// package.json (root)
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "db:migrate": "pnpm --filter database prisma migrate dev",
    "db:generate": "pnpm --filter database prisma generate",
    "db:seed": "pnpm --filter database prisma db seed",
    "db:studio": "pnpm --filter database prisma studio",
    "format": "prettier --write ."
  }
}
```

---

## 7. 문제 해결

### 7.1 포트 충돌

```bash
# 사용 중인 포트 확인
lsof -i :3000
lsof -i :4000
lsof -i :8000

# 프로세스 종료
kill -9 <PID>
```

### 7.2 Prisma 오류

```bash
# 클라이언트 재생성
pnpm db:generate

# 마이그레이션 리셋
pnpm --filter database prisma migrate reset
```

### 7.3 Node 버전 문제

```bash
# nvm 사용 (권장)
nvm install 20
nvm use 20
```

---

**최종 업데이트**: 2026년 1월 29일
