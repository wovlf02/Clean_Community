# 07. 메시지 레이아웃 구조 변경

## 현재 문제
1. 프로필 사진이 메시지 버블 좌측에 바로 붙어 있음
2. 닉네임이 버블 좌측 상단에 표시되지 않음

## 설계 문서 기준
- 닉네임: 메시지 버블 좌측 상단
- 프로필 사진: 닉네임과 같은 가로 라인 좌측

## 구현 내용

### 레이아웃 구조
```
┌──┐  닉네임
│👤│  ┌───────────────────────┐
└──┘  │  메시지 내용          │  10:30
      └───────────────────────┘
```

### 파일 수정
- `cc/src/components/chat/message-bubble/message-bubble.tsx`
- `cc/src/components/chat/message-bubble/message-bubble.css`

### CSS 구조
```css
.message-bubble {
  display: flex;
  gap: 8px;
}

.message-bubble__profile-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message-bubble__content-area {
  display: flex;
  flex-direction: column;
}

.message-bubble__header {
  display: flex;
  align-items: center;
}
```

## 상태
- [x] 분석 완료
- [x] 구현 완료
