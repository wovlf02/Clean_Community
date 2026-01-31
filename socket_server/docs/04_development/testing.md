# 테스트 가이드

**관련 문서**: [개발 환경 설정](./setup.md) | [코딩 컨벤션](./coding-conventions.md)

---

## 개요

Socket Server의 테스트 전략 및 방법을 설명합니다.

---

## 테스트 유형

| 유형 | 도구 | 설명 |
|------|------|------|
| 단위 테스트 | Jest | 개별 함수/모듈 테스트 |
| 통합 테스트 | Jest + socket.io-client | Socket.IO 이벤트 테스트 |
| E2E 테스트 | Playwright | 전체 시스템 테스트 |
| 부하 테스트 | Artillery | 성능/스트레스 테스트 |

---

## 수동 테스트

### 헬스체크 테스트

```bash
# 서버 상태 확인
curl http://localhost:4000/health

# 예상 응답
{
  "status": "healthy",
  "timestamp": "2026-01-31T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Socket.IO 테스트 (Node.js)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
  
  // 채팅방 입장 테스트
  socket.emit('join_room', { roomId: 'test-room' });
});

socket.on('user_joined', (data) => {
  console.log('✅ User joined:', data);
});

socket.on('message', (msg) => {
  console.log('✅ Message received:', msg);
});

socket.on('error', (err) => {
  console.error('❌ Error:', err);
});

// 메시지 전송 테스트
setTimeout(() => {
  socket.emit('send_message', {
    roomId: 'test-room',
    content: 'Hello, World!'
  });
}, 1000);
```

### 테스트 스크립트 실행

```bash
# 테스트 파일 생성
cat > test-socket.mjs << 'EOF'
import { io } from 'socket.io-client';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // JWT 토큰

const socket = io('http://localhost:4000', {
  auth: { token }
});

socket.on('connect', () => console.log('Connected'));
socket.on('connect_error', (err) => console.error('Error:', err.message));
EOF

# 실행
node test-socket.mjs
```

---

## 부하 테스트

### Artillery 설정

`artillery.yml`:

```yaml
config:
  target: "http://localhost:4000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  engines:
    socketio-v3: {}

scenarios:
  - name: "Chat scenario"
    engine: socketio-v3
    flow:
      - emit:
          channel: "join_room"
          data:
            roomId: "load-test-room"
      - think: 1
      - loop:
          - emit:
              channel: "send_message"
              data:
                roomId: "load-test-room"
                content: "Load test message {{ $randomString(20) }}"
          - think: 2
        count: 10
```

### 실행

```bash
# Artillery 설치
npm install -g artillery artillery-engine-socketio-v3

# 부하 테스트 실행
artillery run artillery.yml

# 리포트 생성
artillery run --output report.json artillery.yml
artillery report report.json
```

---

## 테스트 체크리스트

### 연결 테스트

- [ ] JWT 토큰으로 연결 성공
- [ ] 토큰 없이 연결 시 거부
- [ ] 만료된 토큰으로 연결 시 거부
- [ ] 잘못된 토큰으로 연결 시 거부

### 채팅 테스트

- [ ] 채팅방 입장 (`join_room`)
- [ ] 채팅방 퇴장 (`leave_room`)
- [ ] 메시지 전송 (`send_message`)
- [ ] 메시지 수신 (`message`)
- [ ] 타이핑 표시 (`typing`)
- [ ] 읽음 확인 (`read_message`)

### 프레즌스 테스트

- [ ] 연결 시 온라인 상태 브로드캐스트
- [ ] 연결 해제 시 오프라인 상태 브로드캐스트
- [ ] 상태 업데이트 (`update_presence`)

### 스케일링 테스트

- [ ] 다중 인스턴스 간 메시지 동기화
- [ ] Redis 장애 시 복구
- [ ] 인스턴스 추가/제거 시 안정성

---

**최종 업데이트**: 2026년 1월 31일
