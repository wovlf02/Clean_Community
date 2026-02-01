# 08. 읽지 않은 참여자 수 계산

## 현재 문제
1. 읽지 않은 참여자 수에서 본인이 포함됨

## 설계 문서 기준
- 그룹 채팅: (전체 참여자 수 - 읽은 사람 수 - 1)
- 1:1 채팅: 상대방이 읽으면 미표시
- 본인은 항상 제외

## 구현 내용

### 파일 수정
- `cc/src/components/chat/message-bubble/message-bubble.tsx`
- `cc/src/types/chat.ts`

### 로직
```typescript
const getUnreadCount = (message: Message, currentUserId: string) => {
  const readers = message.readBy || [];
  const totalParticipants = room.participants.length;
  // 본인 제외
  const unreadCount = totalParticipants - readers.length - 1;
  return unreadCount > 0 ? unreadCount : null;
};
```

## 상태
- [x] 분석 완료
- [x] 구현 완료
