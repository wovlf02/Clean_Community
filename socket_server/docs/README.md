# Socket Server 문서

Socket.IO 기반 실시간 통신 서버 문서입니다.

---

## 문서 구조

| 폴더 | 설명 |
|------|------|
| [01_architecture](./01_architecture/) | 시스템 아키텍처 및 디렉토리 구조 |
| [02_api](./02_api/) | Socket.IO 이벤트 및 REST API 명세 |
| [03_deployment](./03_deployment/) | 배포 및 운영 가이드 |
| [04_development](./04_development/) | 개발 환경 설정 및 가이드 |

---

## 빠른 시작

```bash
# 설치
cd socket_server
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

---

## 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 24.11.0 LTS | JavaScript 런타임 |
| TypeScript | 5.x | 정적 타입 언어 |
| Express | 4.x | HTTP 서버 (헬스체크) |
| Socket.IO | 4.x | WebSocket 서버 |
| Redis | - | Pub/Sub, 다중 인스턴스 동기화 |
| ioredis | 5.x | Redis 클라이언트 |

---

## 주요 기능

- ✅ 실시간 채팅 메시지 전송
- ✅ 타이핑 인디케이터
- ✅ 읽음 확인
- ✅ 온라인 상태 관리
- ✅ 실시간 알림
- ✅ JWT 기반 인증
- ✅ Redis Adapter를 통한 수평 확장

---

**최종 업데이트**: 2026년 1월 31일
