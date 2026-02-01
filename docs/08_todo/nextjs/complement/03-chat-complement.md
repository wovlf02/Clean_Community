# 채팅 보완 작업 (Chat Complement)

**관련 문서**: 
- [기능 요구사항 - 채팅](../../../02_requirements/functional.md#3-채팅-fr-21--fr-28)
- [채팅방 화면 설계](../../../05_screens/03_chat/chat-room-page.md)
- [채팅 목록 화면 설계](../../../05_screens/03_chat/chat-list-page.md)
- [채팅방 생성 모달 설계](../../../05_screens/03_chat/chat-create-modal.md)
- [채팅 페이지 구현 가이드](../../06-chat-pages.md)
- [Socket 서버 연동 가이드](../../12-socket-integration.md)
- [Socket 서버 문서](../../../../socket_server/docs/README.md)

---

## 📋 현재 구현 상태

| 기능 요구사항 | 상태 | 구현 위치 |
|--------------|------|----------|
| FR-21: 1:1 채팅방 생성 | ✅ 완료 | `cc/src/app/api/chat/rooms/` |
| FR-22: 그룹 채팅방 생성 | ✅ 완료 | `cc/src/app/api/chat/rooms/` |
| FR-23: 텍스트 메시지 전송 | ✅ 완료 | Socket 연동 |
| FR-24: 이모티콘 전송 | ✅ 완료 | 유니코드 이모지 |
| FR-25: 사진 전송 | ⚠️ 부분 | UI만 존재 |
| FR-26: 실시간 메시지 동기화 | ⚠️ 부분 | 기본 구현됨 |
| FR-27: 채팅 목록 조회 | ✅ 완료 | `cc/src/app/(main)/chat/` |
| FR-28: 채팅방 나가기 | ✅ 완료 | API 존재 |

---

## ✅ 체크리스트

### 1. 사진 메시지 전송 기능

**문서 설계 내용** (functional.md FR-25 참조):
- 지원 형식: jpg, png, gif, webp
- 파일당 10MB
- 썸네일 생성, 원본 다운로드

**현재 상태**:
- MessageType.IMAGE enum 정의됨
- 실제 업로드 및 전송 로직 미구현

**TODO**:
- [ ] 채팅 이미지 업로드 API
  - `POST /api/chat/upload`
  - 이미지 압축 및 썸네일 생성
  - S3 업로드 및 URL 반환
- [ ] 채팅 입력창에 이미지 첨부 버튼 추가
  - `cc/src/components/chat/chat-input/`
- [ ] 이미지 미리보기 UI
  - 전송 전 미리보기
  - 취소 기능
- [ ] MessageBubble에 이미지 렌더링
  - 썸네일 표시
  - 클릭 시 원본 보기 (라이트박스)
- [ ] Socket을 통한 이미지 메시지 전송
  ```typescript
  // socket event: 'message:send'
  {
    type: 'IMAGE',
    imageUrl: 'https://...',
    content: '' // 빈 문자열 또는 캡션
  }
  ```

**참고 파일**:
```
cc/src/components/chat/chat-input/chat-input.tsx
cc/src/components/chat/message-bubble/message-bubble.tsx
cc/prisma/schema.prisma (Message 모델, MessageType enum)
socket_server/src/handlers/message.handler.ts
```

---

### 2. 읽음 표시 기능 보완

**문서 설계 내용** (chat-room-page.md 참조):
- 메시지 버블 옆에 읽지 않은 수 표시
- 1:1 채팅: 상대방이 읽으면 "읽음" 표시
- 그룹 채팅: 읽지 않은 인원 수 표시

**현재 상태**:
- ChatParticipant에 lastReadAt, unreadCount 필드 존재
- 실시간 읽음 동기화 미완성

**TODO**:
- [ ] 읽음 처리 API 구현
  - `POST /api/chat/rooms/[id]/read`
  - lastReadAt 업데이트
  - unreadCount 리셋
- [ ] 채팅방 입장 시 자동 읽음 처리
- [ ] Socket 이벤트: 읽음 상태 브로드캐스트
  ```typescript
  // socket event: 'message:read'
  {
    roomId: 'xxx',
    userId: 'xxx',
    lastReadAt: Date
  }
  ```
- [ ] 메시지 버블 UI 업데이트
  - 읽지 않은 수 표시
  - 읽음 완료 시 숫자 제거
- [ ] 채팅 목록에 unreadCount 뱃지 표시

**참고 파일**:
```
cc/src/components/chat/message-bubble/message-bubble.tsx
cc/src/components/chat/chat-room-item/chat-room-item.tsx
cc/src/hooks/use-chat-socket.ts
socket_server/src/handlers/
```

---

### 3. 타이핑 표시 기능 보완

**문서 설계 내용** (functional.md FR-26 참조):
- 상대방이 입력 중일 때 "입력 중..." 표시

**현재 상태**:
- TypingIndicator 컴포넌트 존재
- Socket 이벤트 연동 부분적

**TODO**:
- [ ] 타이핑 시작/종료 감지 로직
  - Debounce 적용 (입력 후 2초간 추가 입력 없으면 종료)
- [ ] Socket 이벤트 발신
  ```typescript
  // 입력 시작
  socket.emit('typing:start', { roomId });
  // 입력 종료
  socket.emit('typing:stop', { roomId });
  ```
- [ ] Socket 이벤트 수신 및 UI 업데이트
  ```typescript
  socket.on('typing:update', ({ roomId, users }) => {
    // 타이핑 중인 사용자 목록 업데이트
  });
  ```
- [ ] TypingIndicator 컴포넌트 연동
  - 여러 사용자 동시 타이핑 표시
  - "OOO님이 입력 중..." 또는 "3명이 입력 중..."

**참고 파일**:
```
cc/src/components/chat/typing-indicator/
cc/src/components/chat/chat-input/chat-input.tsx
cc/src/hooks/use-chat-socket.ts
```

---

### 4. 온라인 상태 표시 개선

**문서 설계 내용** (chat-list-page.md 참조):
- 채팅 목록에서 상대방 온라인 상태 표시
- 그룹 채팅: 온라인 멤버 수 표시

**현재 상태**:
- User 모델에 isOnline 필드 존재
- OnlineIndicator 컴포넌트 존재
- 실시간 상태 동기화 부분적

**TODO**:
- [ ] 로그인/로그아웃 시 온라인 상태 업데이트
  - Socket 연결 시 `isOnline = true`
  - Socket 연결 해제 시 `isOnline = false`, `lastSeenAt = now()`
- [ ] 온라인 상태 변경 브로드캐스트
  ```typescript
  socket.on('user:online', ({ userId }) => { ... });
  socket.on('user:offline', ({ userId, lastSeenAt }) => { ... });
  ```
- [ ] 채팅 목록 UI 업데이트
  - 실시간 온라인 상태 반영
- [ ] 친구 목록 온라인 상태 연동

**참고 파일**:
```
cc/src/components/common/online-indicator/
cc/src/hooks/use-online-status.ts
socket_server/src/handlers/connection.handler.ts
```

---

### 5. 메시지 삭제 기능

**문서 설계 내용** (chat-room-page.md 참조):
- 본인 메시지 삭제 가능
- "삭제된 메시지입니다" 표시

**현재 상태**:
- Message 모델에 deletedAt 필드 존재
- 삭제 UI/API 미구현

**TODO**:
- [ ] 메시지 삭제 API
  - `DELETE /api/chat/messages/[id]`
  - 본인 메시지만 삭제 가능
  - Soft delete (deletedAt 설정)
- [ ] 메시지 컨텍스트 메뉴 (롱프레스/우클릭)
  - 삭제 옵션
  - 복사 옵션
- [ ] MessageBubble에 삭제된 메시지 UI
  ```typescript
  {message.deletedAt && (
    <span className="message--deleted">삭제된 메시지입니다</span>
  )}
  ```
- [ ] Socket으로 삭제 이벤트 브로드캐스트

**참고 파일**:
```
cc/src/components/chat/message-bubble/message-bubble.tsx
cc/src/app/api/chat/messages/
```

---

### 6. 채팅방 설정 기능

**문서 설계 내용** (chat-screens.md 참조):
- 그룹 채팅방 이름 변경
- 멤버 초대/내보내기
- 채팅방 나가기 확인

**현재 상태**:
- 기본 나가기 기능만 구현

**TODO**:
- [ ] 채팅방 설정 모달/페이지
- [ ] 채팅방 이름 변경 API
  - `PATCH /api/chat/rooms/[id]`
- [ ] 멤버 초대 기능
  - 친구 목록에서 선택
  - Socket으로 초대 알림
- [ ] 멤버 내보내기 (방장만)
- [ ] 나가기 확인 모달

**참고 파일**:
```
cc/src/app/(main)/chat/[id]/page.tsx
cc/src/app/api/chat/rooms/[id]/route.ts
```

---

## 📝 문서 보완 필요 사항

### chat-room-page.md 보완 필요
- [ ] 이미지 메시지 렌더링 UI 상세
- [ ] 메시지 삭제 상호작용 플로우
- [ ] 컨텍스트 메뉴 디자인

### Socket 서버 문서 보완 필요
- [ ] `message:read` 이벤트 명세 추가
- [ ] `typing:start`, `typing:stop` 이벤트 명세 추가
- [ ] `user:online`, `user:offline` 이벤트 명세 추가

### API 문서 보완 필요
- [ ] `POST /api/chat/upload` 엔드포인트 추가
- [ ] `POST /api/chat/rooms/[id]/read` 엔드포인트 추가
- [ ] `DELETE /api/chat/messages/[id]` 엔드포인트 추가

---

## 📌 구현 순서 권장

1. 읽음 표시 기능 (핵심 UX)
2. 타이핑 표시 완성
3. 온라인 상태 실시간 동기화
4. 사진 메시지 전송
5. 메시지 삭제 기능
6. 채팅방 설정 기능

---

**이전 문서**: [게시판 보완 작업](./02-board-complement.md)  
**다음 문서**: [친구 관리 보완 작업](./04-friends-complement.md)
