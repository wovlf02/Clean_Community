# 친구 관리 보완 작업 (Friends Complement)

**관련 문서**: 
- [기능 요구사항 - 친구 관리](../../../02_requirements/functional.md#4-친구-관리-fr-29--fr-34)
- [친구 목록 화면 설계](../../../05_screens/04_friends/friend-list-page.md)
- [친구 검색 화면 설계](../../../05_screens/04_friends/friend-search-page.md)
- [친구 페이지 구현 가이드](../../07-friends-pages.md)
- [API 명세서 - 친구](../../../12_api/README.md)

---

## 📋 현재 구현 상태

| 기능 요구사항 | 상태 | 구현 위치 |
|--------------|------|----------|
| FR-29: 친구 검색 | ⚠️ 부분 | 기본 필터만 구현 |
| FR-30: 친구 요청 | ✅ 완료 | `cc/src/app/api/friends/requests/` |
| FR-31: 친구 요청 수락/거절 | ✅ 완료 | `cc/src/app/api/friends/requests/` |
| FR-32: 친구 목록 조회 | ✅ 완료 | `cc/src/app/(main)/friends/` |
| FR-33: 친구 삭제 | ✅ 완료 | `cc/src/app/api/friends/[id]/` |
| FR-34: 친구에서 채팅 시작 | ✅ 완료 | FriendCard에서 채팅 버튼 |

---

## ✅ 체크리스트

### 1. 친구 검색 기능 개선

**문서 설계 내용** (functional.md FR-29 참조):
- 아이디, 닉네임으로 검색
- 프로필 이미지, 닉네임, 친구 상태 표시

**현재 상태**:
- 친구 목록 내 필터링만 구현
- 전체 사용자 검색 미구현

**TODO**:
- [ ] 사용자 검색 API 구현
  - `GET /api/users/search?q=xxx`
  - 닉네임, 이메일(일부)으로 검색
  - 본인 제외
- [ ] 친구 검색 페이지/모달
  - `cc/src/app/(main)/friends/search/` 또는 모달
- [ ] 검색 결과에 친구 상태 표시
  - 친구 O: "친구" 뱃지
  - 친구 X, 요청 O: "요청됨" 뱃지
  - 친구 X, 요청 X: "친구 추가" 버튼
- [ ] 검색 자동완성 (선택)
  - Debounce 적용
  - 실시간 검색 결과

**참고 파일**:
```
cc/src/app/(main)/friends/page.tsx
cc/src/app/api/users/
```

---

### 2. 친구 삭제 확인 모달

**문서 설계 내용** (friend-list-page.md 참조):
- 친구 삭제 전 확인 다이얼로그
- 삭제 후 채팅 기록 유지 안내

**현재 상태**:
- 삭제 API 존재
- 확인 모달 미구현

**TODO**:
- [ ] ConfirmDialog 컴포넌트 활용
  ```typescript
  <ConfirmDialog
    title="친구 삭제"
    description="정말 OOO님을 친구 목록에서 삭제하시겠습니까?"
    confirmText="삭제"
    cancelText="취소"
    variant="danger"
    onConfirm={handleDeleteFriend}
  />
  ```
- [ ] FriendCard에 삭제 확인 플로우 추가
- [ ] 삭제 후 목록에서 즉시 제거 (Optimistic UI)

**참고 파일**:
```
cc/src/components/friends/friend-card/friend-card.tsx
cc/src/components/common/confirm-dialog/
```

---

### 3. 친구 요청 실시간 알림

**문서 설계 내용** (functional.md FR-30 참조):
- 상대방에게 실시간 알림

**현재 상태**:
- FriendRequest 생성 시 Notification 생성
- 실시간 푸시 미완성

**TODO**:
- [ ] Socket 이벤트로 친구 요청 알림
  ```typescript
  socket.emit('notification:send', {
    userId: receiverId,
    type: 'FRIEND_REQUEST',
    title: '새 친구 요청',
    content: 'OOO님이 친구 요청을 보냈습니다'
  });
  ```
- [ ] 친구 요청 수신 시 토스트 알림
- [ ] 친구 요청 탭에 실시간 업데이트

**참고 파일**:
```
cc/src/hooks/use-realtime-notifications.ts
socket_server/src/handlers/notification.handler.ts
```

---

### 4. 친구 요청 취소 기능

**문서 설계 내용** (friend-list-page.md 참조):
- 보낸 요청 탭에서 요청 취소 가능

**현재 상태**:
- 보낸 요청 목록 표시
- 취소 기능 미구현

**TODO**:
- [ ] 친구 요청 취소 API
  - `DELETE /api/friends/requests/[id]`
  - 본인이 보낸 요청만 취소 가능
- [ ] 보낸 요청 UI에 취소 버튼 추가
- [ ] 취소 확인 다이얼로그

**참고 파일**:
```
cc/src/components/friends/friend-request-card/friend-request-card.tsx
cc/src/app/api/friends/requests/
```

---

### 5. 친구 프로필 상세 보기

**문서 설계 내용** (friend-list-page.md 참조):
- 친구 카드 클릭 시 프로필 상세 보기

**현재 상태**:
- 친구 카드에 기본 정보만 표시
- 상세 프로필 페이지 미연동

**TODO**:
- [ ] 친구 프로필 모달 또는 페이지 연동
  - 클릭 시 `/profile/[userId]` 이동
  - 또는 모달로 간단 프로필 표시
- [ ] 프로필에서 1:1 채팅 시작 버튼
- [ ] 프로필에서 친구 삭제 옵션

**참고 파일**:
```
cc/src/components/friends/friend-card/friend-card.tsx
cc/src/app/(main)/profile/page.tsx
```

---

### 6. 친구 차단 기능 (향후)

**문서에 명시되지 않았지만 권장되는 기능**

**TODO (향후 추가)**:
- [ ] Block 모델 추가 (schema.prisma)
- [ ] 차단 API
- [ ] 차단 사용자 검색/채팅 제외
- [ ] 차단 목록 관리 페이지

---

## 📝 문서 보완 필요 사항

### friend-list-page.md 보완 필요
- [ ] 친구 삭제 확인 모달 UI 상세
- [ ] 친구 요청 취소 플로우 추가
- [ ] 에러 케이스 (네트워크 오류 등)

### friend-search-page.md 보완 필요
- [ ] 검색 결과 UI 상세
- [ ] 친구 상태별 표시 방법
- [ ] 자동완성 UI 명세

### API 문서 보완 필요
- [ ] `GET /api/users/search` 엔드포인트 추가
- [ ] `DELETE /api/friends/requests/[id]` (요청 취소) 추가

---

## 📌 구현 순서 권장

1. 친구 삭제 확인 모달 (간단하고 UX 개선)
2. 친구 요청 취소 기능
3. 사용자 검색 API 및 페이지
4. 친구 요청 실시간 알림
5. 친구 프로필 상세 보기

---

**이전 문서**: [채팅 보완 작업](./03-chat-complement.md)  
**다음 문서**: [대시보드 보완 작업](./05-dashboard-complement.md)
