# 06. 메시지 정렬 수정

## 현재 문제
1. 상대방 메시지 프로필 사진이 안 나오는 부분에서 좌측으로 붙어서 나옴
2. 프로필 사진 영역만큼 공간이 유지되지 않음

## 개선 방안
1. 프로필 사진이 없어도 동일한 들여쓰기 유지
2. 고정 너비 예약 공간 사용

## 구현 내용

### 파일 수정
- `cc/src/components/chat/message-bubble/message-bubble.tsx`
- `cc/src/components/chat/message-bubble/message-bubble.css`

### CSS 변경
```css
.message-bubble__avatar {
  width: 32px;  /* 고정 너비 */
  flex-shrink: 0;
}

.message-bubble__avatar--placeholder {
  width: 32px;  /* 빈 공간 유지 */
  visibility: hidden;
}
```

## 상태
- [x] 분석 완료
- [x] 구현 완료
