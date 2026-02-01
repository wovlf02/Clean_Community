# 문서 보완 작업 (Documentation Complement)

**관련 문서**: 
- [docs 폴더 전체](../../../README.md)
- [API 명세서](../../../12_api/README.md)
- [화면 설계 문서](../../../05_screens/overview.md)
- [개발 가이드](../../../06_development/setup.md)

---

## 📋 개요

이 문서는 docs 폴더의 설계 문서와 실제 구현(cc 폴더) 간의 불일치를 식별하고, 
문서를 최신 상태로 유지하기 위한 보완 작업을 정리합니다.

---

## ✅ 체크리스트

### 1. API 명세서 보완

**현재 상태**:
- docs/12_api/README.md에 기본 API 명세 존재
- 실제 구현된 API와 일부 불일치

**TODO**:
- [ ] 누락된 엔드포인트 추가
  - [ ] `POST /api/upload` - 파일 업로드
  - [ ] `GET /api/users/search` - 사용자 검색
  - [ ] `POST /api/auth/send-verification-code` - 이메일 인증 코드 발송
  - [ ] `POST /api/auth/verify-code` - 인증 코드 검증
  - [ ] `POST /api/auth/find-id` - 아이디 찾기
  - [ ] `GET /api/dashboard/trends` - 커뮤니티 트렌드
  - [ ] `GET /api/admin/flagged-content` - 플래그된 콘텐츠 목록
  - [ ] `POST /api/admin/flagged-content/[id]/action` - 관리자 조치
  - [ ] `GET /api/admin/analysis-stats` - 분석 통계
  - [ ] `POST /api/chat/rooms/[id]/read` - 메시지 읽음 처리
  - [ ] `DELETE /api/friends/requests/[id]` - 친구 요청 취소
- [ ] 응답 스키마 검증 및 업데이트
  - 실제 API 응답과 문서 비교
  - 필드 추가/변경 사항 반영
- [ ] 에러 응답 케이스 추가
  - 각 엔드포인트별 가능한 에러 코드

**참고 파일**:
```
docs/12_api/README.md
cc/src/app/api/**/route.ts
```

---

### 2. 화면 설계 문서 보완

**현재 상태**:
- 대부분의 화면 설계 문서 존재
- 일부 세부 사항 누락

**TODO**:

#### 인증 화면 (01_auth)
- [ ] `login-page.md`: OAuth 콜백 처리 플로우 추가
- [ ] `register-page.md`: 이메일 인증 상태 다이어그램 추가
- [ ] 에러 케이스별 UI 명세 추가

#### 게시판 화면 (02_board)
- [ ] `post-write-page.md`: 첨부파일 업로드 UI 상세
- [ ] `post-write-page.md`: 드래그 앤 드롭 상호작용
- [ ] `post-detail-page.md`: 첨부파일 미리보기 UI

#### 채팅 화면 (03_chat)
- [ ] `chat-room-page.md`: 이미지 메시지 렌더링 UI
- [ ] `chat-room-page.md`: 메시지 삭제 상호작용
- [ ] `chat-room-page.md`: 컨텍스트 메뉴 디자인

#### 친구 화면 (04_friends)
- [ ] `friend-list-page.md`: 친구 삭제 확인 모달 UI
- [ ] `friend-list-page.md`: 친구 요청 취소 플로우
- [ ] `friend-search-page.md`: 검색 결과 상세 UI

#### 대시보드 화면 (05_dashboard)
- [ ] `dashboard-page.md`: 차트 라이브러리 명시
- [ ] `dashboard-page.md`: 데이터 로딩/에러 상태 UI

#### 설정 화면 (06_settings)
- [ ] 알림 설정 상세 명세
- [ ] 연결된 계정 관리 UI

**참고 파일**:
```
docs/05_screens/**/*.md
cc/src/app/**/page.tsx
cc/src/components/**/*.tsx
```

---

### 3. 관리자 페이지 문서 추가

**현재 상태**:
- 관리자 기능 문서 없음
- FR-43 (악성 콘텐츠 모니터링)에 관리자 기능 명세됨

**TODO**:
- [ ] `docs/05_screens/07_admin/` 폴더 생성
- [ ] `admin-monitoring-page.md` 작성
  - 플래그된 콘텐츠 목록 UI
  - 필터 및 검색 기능
  - 관리자 조치 모달
  - 통계 대시보드
- [ ] `admin-users-page.md` 작성 (향후)
  - 사용자 관리 기능
  - 경고/제재 이력
- [ ] 관리자 권한 체계 문서 작성

---

### 4. Socket 이벤트 문서 보완

**현재 상태**:
- socket_server/docs/에 기본 문서 존재
- 일부 이벤트 명세 누락

**TODO**:
- [ ] 누락된 이벤트 추가
  - [ ] `message:read` - 메시지 읽음 처리
  - [ ] `typing:start`, `typing:stop` - 타이핑 표시
  - [ ] `user:online`, `user:offline` - 온라인 상태
  - [ ] `notification:send` - 실시간 알림
- [ ] 이벤트 페이로드 스키마 상세화
- [ ] 클라이언트-서버 시퀀스 다이어그램 추가

**참고 파일**:
```
socket_server/docs/02_api/
cc/src/hooks/use-chat-socket.ts
cc/src/hooks/use-realtime-notifications.ts
```

---

### 5. 컴포넌트 문서화

**현재 상태**:
- 컴포넌트별 문서 없음
- Storybook 미설정

**TODO**:
- [ ] 주요 UI 컴포넌트 문서화
  - Button, Input, Card 등 기본 UI
  - PostCard, CommentList 등 도메인 컴포넌트
  - Modal, Dialog 등 오버레이 컴포넌트
- [ ] Props 명세 문서 또는 Storybook 설정
  ```bash
  npx storybook@latest init
  ```
- [ ] 사용 예시 추가

**참고 파일**:
```
cc/src/components/ui/
cc/src/components/common/
cc/src/components/board/
```

---

### 6. 데이터베이스 스키마 문서 동기화

**현재 상태**:
- docs/04_database/database-schema.md 존재
- Prisma 스키마와 일부 불일치 가능성

**TODO**:
- [ ] Prisma 스키마와 문서 비교
  - 필드 추가/변경 사항 확인
  - 관계 설정 확인
- [ ] ERD 다이어그램 업데이트
- [ ] 인덱스 설정 문서화

**참고 파일**:
```
docs/04_database/database-schema.md
docs/04_database/entity-schema.md
cc/prisma/schema.prisma
```

---

### 7. 배포 가이드 업데이트 (중요)

**현재 상태**:
- docs/07_deployment/aws-deployment.md 존재
- 실제 배포 설정과 동기화 필요

**TODO**:
- [ ] 환경변수 전체 목록 문서화
  ```markdown
  ## 필수 환경변수
  | 변수명 | 설명 | 예시 |
  |--------|------|------|
  | DATABASE_URL | PostgreSQL 연결 URL | postgresql://... |
  | NEXTAUTH_SECRET | 인증 시크릿 (32자 이상) | xxx |
  | NEXTAUTH_URL | 앱 URL | https://example.com |
  | AI_SERVER_URL | AI 서버 URL | https://ai.example.com |
  | SOCKET_SERVER_URL | Socket 서버 URL | https://socket.example.com |
  ```
- [ ] 빌드 전 체크리스트 추가
- [ ] 배포 후 확인사항 추가
- [ ] 롤백 절차 문서화
- [ ] Docker 설정 문서화
- [ ] CI/CD 파이프라인 문서화
- [ ] 모니터링 설정 가이드 추가

**참고 파일**:
```
docs/07_deployment/aws-deployment.md
cc/Dockerfile (존재 시)
ai_server/Dockerfile
socket_server/Dockerfile (존재 시)
```

---

### 8. 개발 환경 설정 가이드 업데이트

**현재 상태**:
- docs/06_development/setup.md 존재

**TODO**:
- [ ] 필수 환경변수 목록 최신화
  ```
  # .env.example 파일과 동기화
  DATABASE_URL=
  NEXTAUTH_SECRET=
  NEXTAUTH_URL=
  AI_SERVER_URL=
  SOCKET_SERVER_URL=
  # OAuth
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  KAKAO_CLIENT_ID=
  KAKAO_CLIENT_SECRET=
  NAVER_CLIENT_ID=
  NAVER_CLIENT_SECRET=
  # S3
  S3_BUCKET=
  S3_REGION=
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  ```
- [ ] 로컬 개발 환경 설정 단계별 가이드
- [ ] 트러블슈팅 가이드 추가

**참고 파일**:
```
docs/06_development/setup.md
cc/.env.example (존재 시)
```

---

### 9. 타입 정의 문서화

**현재 상태**:
- cc/src/types/ 폴더에 타입 정의 존재
- 문서화되지 않음

**TODO**:
- [ ] 주요 타입 정의 문서화
  - User, Post, Comment 등
  - API 요청/응답 타입
  - Socket 이벤트 타입
- [ ] 또는 TypeDoc 설정
  ```bash
  npm install -D typedoc
  npx typedoc --entryPoints cc/src/types --out docs/types
  ```

**참고 파일**:
```
cc/src/types/*.ts
```

---

### 10. TODO 문서 현행화

**현재 상태**:
- docs/08_todo/nextjs/ 폴더에 Phase별 TODO 존재
- 일부 완료된 항목 체크 안됨

**TODO**:
- [ ] 각 Phase 문서의 체크박스 업데이트
  - 00-project-setup.md
  - 01-design-system.md
  - 02-common-components/*.md
  - 03-layouts.md
  - 04-auth-pages.md
  - 05-board-pages.md
  - 06-chat-pages.md
  - 07-friends-pages.md
  - 08-dashboard-pages.md
  - 09-settings-pages.md
  - 10-backend-api.md
  - 11-ai-integration.md
  - 12-socket-integration.md
  - 13-optimization.md
- [ ] 완료된 항목 [x]로 표시
- [ ] 진행 상황 README.md에 요약

**참고 파일**:
```
docs/08_todo/nextjs/*.md
docs/08_todo/nextjs/README.md
```

---

## 📌 문서 품질 기준

### 좋은 문서의 조건
1. **최신성**: 실제 코드와 동기화
2. **명확성**: 모호하지 않은 명세
3. **완전성**: 필요한 정보 누락 없음
4. **일관성**: 용어 및 형식 통일
5. **접근성**: 쉽게 찾고 이해할 수 있음

### 문서 리뷰 체크포인트
- [ ] 코드 변경 시 관련 문서 업데이트 여부 확인
- [ ] 새 기능 추가 시 API/화면 문서 작성 여부 확인
- [ ] 환경변수 추가 시 setup.md 업데이트 여부 확인

---

## 📌 구현 순서 권장

1. API 명세서 보완 (개발 중 참조 빈도 높음)
2. TODO 문서 현행화 (진행 상황 파악)
3. 화면 설계 문서 보완
4. Socket 이벤트 문서 보완
5. 데이터베이스 스키마 동기화
6. 관리자 페이지 문서 추가
7. 개발 환경 설정 가이드 업데이트
8. 배포 가이드 업데이트
9. 컴포넌트 문서화 (Storybook)
10. 타입 정의 문서화

---

**이전 문서**: [최적화 보완 작업](./07-optimization-complement.md)  
**메인 문서**: [README.md](./README.md)
