# 11. 채팅 미디어 기능

## 현재 문제
1. 이모티콘 기능 미작동
2. 파일/이미지 업로드 미구현

## 개선 방안
1. 이모티콘 피커 구현 및 연동
2. 파일 업로드 (드래그앤드롭, 클릭)
3. 이미지 미리보기 (썸네일, 라이트박스)
4. 파일 형식 표시 (아이콘, 파일명, 크기)

## 구현 내용

### 이모티콘
- emoji-picker-react 라이브러리 활용
- 메시지 타입에 emoji 추가

### 파일/이미지 업로드
```typescript
interface FileMessage {
  type: 'file';
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string; // 이미지인 경우
}
```

### 미리보기
- 이미지: 채팅에서 썸네일, 클릭 시 라이트박스
- 파일: 아이콘 + 파일명 + 크기, 클릭 시 다운로드

### 파일 수정
- `cc/src/components/chat/chat-input/ChatInput.tsx`
- `cc/src/components/chat/message-bubble/message-bubble.tsx`
- `cc/src/components/chat/file-message/` (신규)
- `cc/src/components/chat/image-message/` (신규)
- `cc/src/components/common/lightbox/` (신규)

## 상태
- [x] 분석 완료
- [x] 구현 완료
