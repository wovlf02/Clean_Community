feat(socket): Socket.IO 실시간 통신 서버 구축

Express.js + Socket.IO 기반 실시간 채팅 서버를 구축했습니다.

## 주요 기능
- JWT 기반 WebSocket 인증
- 실시간 채팅 메시지 전송/수신
- 채팅방 입장/퇴장 관리
- 타이핑 인디케이터
- 메시지 읽음 확인
- 온라인 상태(Presence) 관리
- 실시간 알림 전송
- Redis Adapter를 통한 수평 확장 지원
- 헬스체크 엔드포인트 (/health, /ready)

## 기술 스택
- Node.js 24.11.0 LTS
- TypeScript 5.x
- Express 4.x
- Socket.IO 4.x
- ioredis 5.x
- Redis Adapter

## 파일 구조
- src/index.ts: 애플리케이션 엔트리포인트
- src/config.ts: 환경 설정 관리
- src/handlers/: Socket.IO 이벤트 핸들러
- src/middlewares/: JWT 인증 미들웨어
- src/services/: Redis, Logger 서비스
- src/types/: TypeScript 타입 정의
- docs/: 상세 기술 문서

## 문서
- 아키텍처 설계 문서
- Socket.IO 이벤트 API 명세
- 배포 및 스케일링 가이드
- 개발 환경 설정 가이드
