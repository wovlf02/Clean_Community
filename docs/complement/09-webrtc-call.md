# 09. WebRTC 통화 기능

## 현재 문제
1. 채팅방 상세 페이지의 통화, 화상통화 버튼이 동작하지 않음

## 개선 방안
1. WebRTC + P2P 기술로 실시간 통화 구현
2. 음성 통화: 오버레이 형태로 이동 가능
3. 프로필, 닉네임, 통화시간 실시간 표시
4. 음소거, 통화 종료 버튼

## 구현 내용

### 신규 파일
- `cc/src/components/chat/voice-call/` - 음성 통화 오버레이
- `cc/src/components/chat/video-call/` - 화상 통화 UI
- `cc/src/hooks/useWebRTC.ts` - WebRTC 훅
- `cc/src/lib/webrtc.ts` - WebRTC 유틸리티

### 음성 통화 오버레이
```
┌────────────────────────────┐
│  👤  닉네임                │
│     00:12:34              │
│  [🔇] [📴]                │ ← 음소거, 종료
└────────────────────────────┘
```

### Socket 서버 연동
- 시그널링 서버 활용
- ICE candidate 교환
- SDP offer/answer

## 상태
- [x] 분석 완료
- [x] 구현 완료
