# 개발 환경 설정

**관련 문서**: [테스트 가이드](./testing.md) | [코딩 컨벤션](./coding-conventions.md)

---

## 사전 요구사항

| 항목 | 버전 | 설치 방법 |
|------|------|-----------|
| Node.js | 24.11.0 LTS | [nodejs.org](https://nodejs.org/) |
| npm | 10.x | Node.js와 함께 설치 |
| Redis | 7.x | `brew install redis` (macOS) |

---

## 설치

### 1. 저장소 클론

```bash
git clone https://github.com/your-org/clean-community.git
cd clean-community/socket_server
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 필요한 값을 설정하세요:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-development-secret
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### 4. Redis 실행

```bash
# macOS (Homebrew)
brew services start redis

# 또는 직접 실행
redis-server
```

### 5. 서버 실행

```bash
# 개발 모드 (Hot Reload)
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (tsx watch) |
| `npm run build` | TypeScript 컴파일 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run typecheck` | 타입 체크 |
| `npm run lint` | ESLint 실행 |

---

## 디버깅

### VS Code 설정

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Socket Server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/socket_server",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 로그 레벨

개발 시 `LOG_LEVEL=debug`로 설정하여 상세 로그를 확인하세요.

```
[2026-01-31T12:00:00.000Z] [DEBUG] User authenticated { socketId: "...", userId: "..." }
[2026-01-31T12:00:01.000Z] [INFO] User joined room { userId: "...", roomId: "..." }
[2026-01-31T12:00:02.000Z] [DEBUG] Message sent { messageId: "...", roomId: "..." }
```

---

## 테스트 클라이언트

### 브라우저 콘솔

```javascript
const socket = io('http://localhost:4000', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('message', (msg) => {
  console.log('Message:', msg);
});

socket.emit('join_room', { roomId: 'test-room' });
socket.emit('send_message', { roomId: 'test-room', content: 'Hello!' });
```

### Postman / Socket.IO Client

1. Postman에서 WebSocket 요청 생성
2. URL: `ws://localhost:4000`
3. Headers에 `Authorization: Bearer <token>` 추가

---

## 트러블슈팅

### Redis 연결 실패

```
[ERROR] Failed to connect to Redis
```

**해결:**
1. Redis 서비스 실행 확인: `redis-cli ping`
2. `REDIS_URL` 환경 변수 확인
3. 방화벽 설정 확인

### JWT 인증 실패

```
Authentication required
```

**해결:**
1. 토큰 형식 확인: `{ auth: { token: 'xxx' } }`
2. `JWT_SECRET`이 토큰 발급 서버와 동일한지 확인
3. 토큰 만료 여부 확인

### 포트 충돌

```
Error: listen EADDRINUSE: address already in use :::4000
```

**해결:**
```bash
# 포트 사용 프로세스 확인
lsof -i :4000

# 프로세스 종료
kill -9 <PID>
```

---

**최종 업데이트**: 2026년 1월 31일
