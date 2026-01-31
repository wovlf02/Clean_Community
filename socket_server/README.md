# Socket Server

Socket.IO 기반 실시간 채팅 서버입니다.

## 기술 스택

- **Node.js** 24.11.0 LTS
- **TypeScript** 5.x
- **Express** 4.x - HTTP 서버 (헬스체크)
- **Socket.IO** 4.x - WebSocket 서버
- **Redis** (선택) - 다중 인스턴스 동기화

## 설치

```bash
cd socket_server
npm install
```

## 환경 설정

`.env.example`을 `.env`로 복사하고 필요한 값을 설정하세요.

```bash
cp .env.example .env
```

### 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `PORT` | 서버 포트 | 4000 |
| `NODE_ENV` | 환경 (development/production) | development |
| `JWT_SECRET` | JWT 검증 시크릿 | - |
| `REDIS_URL` | Redis 연결 URL | redis://localhost:6379 |
| `REDIS_ENABLED` | Redis 사용 여부 | false |
| `CORS_ORIGIN` | 허용 CORS 오리진 | http://localhost:3000 |

## 실행

### 개발 모드

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

## API 엔드포인트

### 헬스체크

```
GET /health
```

**응답 예시:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-31T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### 레디니스 체크

```
GET /ready
```

## Socket.IO 이벤트

### 네임스페이스

| 네임스페이스 | 용도 |
|--------------|------|
| `/` (기본) | 채팅, 알림, 프레즌스 |

### 클라이언트 → 서버

| 이벤트 | 페이로드 | 설명 |
|--------|----------|------|
| `join_room` | `{ roomId: string }` | 채팅방 참여 |
| `leave_room` | `{ roomId: string }` | 채팅방 퇴장 |
| `send_message` | `{ roomId, content, type? }` | 메시지 전송 |
| `typing` | `{ roomId, isTyping }` | 타이핑 상태 |
| `read_message` | `{ roomId, messageId }` | 읽음 처리 |
| `update_presence` | `'online' \| 'away'` | 접속 상태 업데이트 |

### 서버 → 클라이언트

| 이벤트 | 페이로드 | 설명 |
|--------|----------|------|
| `message` | `ChatMessage` | 새 메시지 수신 |
| `message_sent` | `{ success, messageId }` | 메시지 전송 확인 |
| `typing` | `{ userId, nickname, isTyping }` | 타이핑 상태 |
| `user_joined` | `{ userId, nickname }` | 사용자 입장 |
| `user_left` | `{ userId, nickname }` | 사용자 퇴장 |
| `message_read` | `{ userId, messageId }` | 읽음 확인 |
| `notification` | `Notification` | 알림 |
| `presence_update` | `PresenceUpdate` | 접속 상태 변경 |
| `error` | `{ code, message }` | 에러 |

## 인증

Socket.IO 연결 시 JWT 토큰이 필요합니다.

```javascript
const socket = io('http://localhost:4000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## 디렉토리 구조

```
socket_server/
├── src/
│   ├── handlers/          # Socket 이벤트 핸들러
│   │   ├── chat.handler.ts
│   │   ├── notification.handler.ts
│   │   └── presence.handler.ts
│   ├── middlewares/       # 미들웨어
│   │   └── auth.middleware.ts
│   ├── services/          # 서비스 레이어
│   │   ├── logger.ts
│   │   └── redis.ts
│   ├── types/             # TypeScript 타입
│   │   └── socket.types.ts
│   ├── config.ts          # 설정
│   └── index.ts           # 엔트리포인트
├── package.json
├── tsconfig.json
├── .env
└── .env.example
```

## 스케일링

다중 인스턴스 운영 시 Redis Adapter를 활성화하세요.

```env
REDIS_ENABLED=true
REDIS_URL=redis://your-redis-host:6379
```

---

**최종 업데이트**: 2026년 1월 31일
