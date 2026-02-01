# 개발 환경 설정

**관련 문서**: [기술 스택](../03_architecture/tech-stack.md) | [코딩 컨벤션](./coding-conventions.md)

---

## 1. 필수 도구

### 1.1 개발 환경

| 도구 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 24.11.0 LTS | JavaScript 런타임 |
| **pnpm** | 8+ | 패키지 매니저 (권장) |
| **Python** | 3.11.9 | FastAPI 서버 |
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
Clean_Community/
├── cc/                           # Next.js 웹 앱 (프론트엔드 + API)
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── (auth)/           # 인증 페이지 그룹
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── find-id/
│   │   │   │   └── forgot-password/
│   │   │   ├── (main)/           # 메인 레이아웃 그룹
│   │   │   │   ├── admin/        # 관리자 대시보드
│   │   │   │   ├── board/        # 게시판
│   │   │   │   ├── chat/         # 채팅
│   │   │   │   ├── dashboard/    # 홈 대시보드
│   │   │   │   ├── friends/      # 친구 관리
│   │   │   │   ├── profile/      # 프로필
│   │   │   │   ├── settings/     # 설정
│   │   │   │   ├── privacy/      # 개인정보 처리방침
│   │   │   │   └── terms/        # 이용약관
│   │   │   └── api/              # API Routes
│   │   │       ├── auth/         # 인증 API
│   │   │       ├── posts/        # 게시글 API
│   │   │       ├── comments/     # 댓글 API
│   │   │       ├── chat/         # 채팅 API
│   │   │       ├── friends/      # 친구 API
│   │   │       ├── dashboard/    # 대시보드 API
│   │   │       ├── notifications/# 알림 API
│   │   │       ├── analyze/      # AI 분석 API
│   │   │       └── users/        # 사용자 API
│   │   ├── components/           # React 컴포넌트
│   │   │   ├── auth/             # 인증 컴포넌트
│   │   │   ├── board/            # 게시판 컴포넌트
│   │   │   ├── chat/             # 채팅 컴포넌트
│   │   │   ├── common/           # 공통 컴포넌트
│   │   │   ├── dashboard/        # 대시보드 컴포넌트
│   │   │   ├── friends/          # 친구 컴포넌트
│   │   │   ├── layout/           # 레이아웃 컴포넌트
│   │   │   ├── settings/         # 설정 컴포넌트
│   │   │   └── ui/               # shadcn/ui 컴포넌트
│   │   ├── hooks/                # 커스텀 훅
│   │   ├── lib/                  # 유틸리티
│   │   ├── mocks/                # 목업 데이터
│   │   ├── providers/            # 프로바이더
│   │   ├── store/                # Zustand 스토어
│   │   ├── styles/               # 글로벌 스타일
│   │   └── types/                # 타입 정의
│   ├── prisma/
│   │   └── schema.prisma         # Prisma 스키마
│   ├── generated/
│   │   └── prisma/               # 생성된 Prisma 클라이언트
│   └── package.json
│
├── socket_server/                # Express.js 소켓 서버
│   ├── src/
│   │   ├── index.ts              # 엔트리포인트
│   │   └── config.ts             # 설정
│   └── package.json
│
├── ai_server/                    # FastAPI AI 서버
│   ├── app/
│   │   ├── api/                  # API 라우트
│   │   ├── models/               # ML 모델
│   │   ├── services/             # 서비스 레이어
│   │   └── main.py               # 엔트리포인트
│   ├── models/                   # 학습된 모델 파일 (.pt)
│   ├── requirements.txt
│   └── Dockerfile
│
└── docs/                         # 프로젝트 문서
```

---

## 3. 초기 설정

### 3.1 저장소 클론

```bash
git clone https://github.com/your-org/Clean_Community.git
cd Clean_Community
```

### 3.2 의존성 설치

```bash
# Next.js 웹 앱 (cc 폴더)
cd cc
npm install

# Socket 서버
cd ../socket_server
npm install

# AI 서버
cd ../ai_server
pip install -r requirements.txt
```

### 3.3 환경 변수 설정

```bash
# 환경 변수 파일 복사
cp cc/.env.example cc/.env.local
cp socket_server/.env.example socket_server/.env
cp ai_server/.env.example ai_server/.env
```

### 3.4 환경 변수 (.env.local)

```env
# cc/.env.local

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

# cc 폴더에서 Prisma 마이그레이션
cd cc
npx prisma migrate dev

# Prisma 클라이언트 생성
npx prisma generate

# (선택) 시드 데이터
npx prisma db seed
```

---

## 4. 개발 서버 실행

### 4.1 Next.js 웹 앱 (cc)

```bash
cd cc
npm run dev
```

### 4.2 개별 실행

```bash
# Next.js 웹 앱
cd cc
npm run dev

# Socket 서버
cd socket_server
npm run dev

# AI 서버 (Python)
cd ai_server
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
docker-compose logs -f
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
      context: ./cc
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/emotion_community
    depends_on:
      - postgres
      - redis

  socket-server:
    build:
      context: ./socket_server
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  ai-server:
    build:
      context: ./ai_server
    ports:
      - "8000:8000"

volumes:
  postgres_data:
```

---

## 6. 유용한 스크립트

```json
// cc/package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css,json}\""
  }
}
```

### Prisma 명령어

```bash
# cc 폴더에서 실행
cd cc

# 마이그레이션 생성 및 적용
npx prisma migrate dev --name migration_name

# 클라이언트 생성
npx prisma generate

# Prisma Studio (DB GUI)
npx prisma studio

# DB 리셋
npx prisma migrate reset
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
# cc 폴더에서 클라이언트 재생성
cd cc
npx prisma generate

# 마이그레이션 리셋
npx prisma migrate reset
```

### 7.3 Node 버전 문제

```bash
# nvm 사용 (권장)
nvm install 20
nvm use 20
```

---

**최종 업데이트**: 2026년 2월 2일
