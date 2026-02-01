# 14. 친구 기능 개선

## 현재 문제
1. 채팅 아이콘 버튼 → 채팅방 리스트로 이동 (X)
2. 친구 추가 버튼 모달 안 뜸
3. 친구 삭제 버튼 CSS 미흡

## 개선 방안
1. 채팅 아이콘: 해당 유저와의 채팅방으로 직접 이동
   - 채팅방 없으면 새로 생성 후 이동
   - 채팅방 있으면 해당 채팅방으로 이동
2. 친구 추가: 모달 열기 기능 구현
3. CSS 개선

## 구현 내용

### 채팅방 로직
```typescript
const handleStartChat = async (friendId: string) => {
  // 1. 기존 채팅방 검색
  const existingRoom = chatRooms.find(room => 
    room.type === 'direct' && 
    room.participants.some(p => p.id === friendId)
  );
  
  if (existingRoom) {
    // 2. 있으면 해당 채팅방으로 이동
    router.push(`/chat?roomId=${existingRoom.id}`);
  } else {
    // 3. 없으면 새로 생성
    const newRoom = await createChatRoom(friendId);
    router.push(`/chat?roomId=${newRoom.id}`);
  }
};
```

### 친구 추가 모달
- `cc/src/components/friends/add-friend-modal/` (신규)
- 닉네임/이메일로 검색
- 친구 요청 전송

### 파일 수정
- `cc/src/components/friends/friend-card/friend-card.tsx`
- `cc/src/components/friends/friend-card/friend-card.css`
- `cc/src/app/(main)/friends/page.tsx`

## 상태
- [x] 분석 완료
- [x] 구현 완료
