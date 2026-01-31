# 디렉토리 구조

**관련 문서**: [시스템 개요](./overview.md) | [데이터 흐름](./data-flow.md)

---

## 프로젝트 구조

```
socket_server/
├── src/
│   ├── index.ts              # 애플리케이션 엔트리포인트
│   ├── config.ts             # 환경 설정 관리
│   │
│   ├── handlers/             # Socket.IO 이벤트 핸들러
│   │   ├── index.ts          # 핸들러 export
│   │   ├── chat.handler.ts   # 채팅 이벤트 처리
│   │   ├── presence.handler.ts   # 온라인 상태 처리
│   │   └── notification.handler.ts   # 알림 처리
│   │
│   ├── middlewares/          # 미들웨어
│   │   ├── index.ts          # 미들웨어 export
│   │   └── auth.middleware.ts    # JWT 인증
│   │
│   ├── services/             # 비즈니스 서비스
│   │   ├── index.ts          # 서비스 export
│   │   ├── logger.ts         # 로깅 서비스
│   │   └── redis.ts          # Redis 연결 관리
│   │
│   └── types/                # TypeScript 타입 정의
│       ├── index.ts          # 타입 export
│       └── socket.types.ts   # Socket.IO 타입
│
├── dist/                     # 컴파일된 JavaScript (빌드 후 생성)
├── docs/                     # 문서
├── node_modules/             # 의존성
│
├── .env                      # 환경 변수 (gitignore)
├── .env.example              # 환경 변수 예시
├── .gitignore                # Git 제외 파일
├── package.json              # 프로젝트 설정
├── tsconfig.json             # TypeScript 설정
└── README.md                 # 프로젝트 소개
```

---

## 모듈 상세 설명

### 1. src/index.ts

애플리케이션의 메인 엔트리포인트입니다.

**역할:**
- Express 앱 생성 및 미들웨어 설정
- HTTP 서버 생성
- Socket.IO 서버 초기화
- Redis Adapter 연결
- 이벤트 핸들러 등록
- Graceful Shutdown 처리

### 2. src/config.ts

환경 변수를 로드하고 설정 객체를 제공합니다.

**설정 항목:**

| 항목 | 설명 |
|------|------|
| `port` | 서버 포트 |
| `nodeEnv` | 실행 환경 |
| `jwt.secret` | JWT 시크릿 키 |
| `redis.url` | Redis 연결 URL |
| `redis.enabled` | Redis 활성화 여부 |
| `cors.origin` | 허용 CORS 오리진 |
| `logging.level` | 로그 레벨 |

### 3. src/handlers/

Socket.IO 이벤트를 처리하는 핸들러 모듈입니다.

| 파일 | 역할 |
|------|------|
| `chat.handler.ts` | 채팅방 입장/퇴장, 메시지 전송, 타이핑, 읽음 확인 |
| `presence.handler.ts` | 온라인/오프라인 상태 관리 |
| `notification.handler.ts` | 실시간 알림 전송 |

### 4. src/middlewares/

연결 전 처리를 담당하는 미들웨어입니다.

| 파일 | 역할 |
|------|------|
| `auth.middleware.ts` | JWT 토큰 검증, 사용자 정보 추출 |

### 5. src/services/

비즈니스 로직 및 외부 서비스 연결을 담당합니다.

| 파일 | 역할 |
|------|------|
| `logger.ts` | 로그 레벨 기반 로깅 |
| `redis.ts` | Redis 클라이언트 초기화 및 관리 |

### 6. src/types/

TypeScript 타입 정의를 모아둔 폴더입니다.

| 파일 | 역할 |
|------|------|
| `socket.types.ts` | Socket.IO 이벤트 페이로드 및 타입 정의 |

---

**최종 업데이트**: 2026년 1월 31일
