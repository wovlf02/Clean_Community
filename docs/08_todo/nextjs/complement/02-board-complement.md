# 게시판 보완 작업 (Board Complement)

**관련 문서**: 
- [기능 요구사항 - 게시판](../../../02_requirements/functional.md#2-게시판-fr-07--fr-20)
- [게시글 목록 화면 설계](../../../05_screens/02_board/post-list-page.md)
- [게시글 상세 화면 설계](../../../05_screens/02_board/post-detail-page.md)
- [게시글 작성 화면 설계](../../../05_screens/02_board/post-write-page.md)
- [게시판 페이지 구현 가이드](../../05-board-pages.md)
- [API 명세서 - 게시판](../../../12_api/README.md#-게시판-api)

---

## 📋 현재 구현 상태

| 기능 요구사항 | 상태 | 구현 위치 |
|--------------|------|----------|
| FR-07: 게시글 작성 | ✅ 완료 | `cc/src/app/(main)/board/write/` |
| FR-08: 게시글 조회 | ✅ 완료 | `cc/src/app/(main)/board/[id]/` |
| FR-09: 게시글 수정 | ✅ 완료 | `cc/src/app/(main)/board/[id]/edit/` |
| FR-10: 게시글 삭제 | ✅ 완료 | `cc/src/app/api/posts/[id]/route.ts` |
| FR-11: 게시글 목록 | ✅ 완료 | `cc/src/app/(main)/board/page.tsx` |
| FR-12: 게시글 검색 | ⚠️ 부분 | 기본 검색만 구현 |
| FR-13: 좋아요 | ✅ 완료 | `cc/src/app/api/posts/[id]/like/` |
| FR-14: 게시글 공유 | ⚠️ 부분 | URL 복사만 구현 |
| FR-15: 첨부파일 업로드 | ❌ 미구현 | - |
| FR-16: 첨부파일 미리보기 | ❌ 미구현 | - |
| FR-17: 댓글 작성 | ✅ 완료 | `cc/src/components/board/comment-list/` |
| FR-18: 댓글 수정/삭제 | ✅ 완료 | `cc/src/app/api/comments/[id]/route.ts` |
| FR-19: 대댓글 | ✅ 완료 | 구현됨 |
| FR-20: 조회수 | ⚠️ 부분 | 중복 방지 미구현 |

---

## ✅ 체크리스트

### 1. 첨부파일 업로드 기능

**문서 설계 내용** (functional.md FR-15 참조):
- 지원 형식: jpg, png, gif, webp, pdf
- 파일당 10MB, 게시글당 최대 5개
- 드래그 앤 드롭, 진행률 표시

**현재 상태**:
- Attachment 모델은 Prisma에 정의됨
- 실제 업로드 기능 미구현

**TODO**:
- [ ] 파일 저장소 설정
  - 개발: 로컬 또는 MinIO
  - 프로덕션: AWS S3
  - 환경변수: `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- [ ] 파일 업로드 API 구현
  - `POST /api/upload`
  - 파일 타입 검증 (이미지, PDF만 허용)
  - 파일 크기 제한 (10MB)
  - S3 업로드 및 URL 반환
- [ ] 드래그 앤 드롭 컴포넌트 구현
  - `cc/src/components/common/file-uploader/`
  - 업로드 진행률 표시
  - 미리보기 기능
- [ ] 게시글 작성 폼에 파일 업로드 연동
- [ ] 업로드된 파일 Attachment 테이블에 저장
- [ ] 게시글 삭제 시 첨부파일도 삭제

**참고 파일**:
```
cc/prisma/schema.prisma (Attachment 모델)
cc/src/app/(main)/board/write/page.tsx
cc/src/components/board/post-editor/
```

---

### 2. 첨부파일 미리보기 기능

**문서 설계 내용** (functional.md FR-16 참조):
- 이미지 라이트박스
- PDF 인라인 뷰어

**TODO**:
- [ ] 이미지 라이트박스 컴포넌트
  - `cc/src/components/common/image-lightbox/`
  - 확대/축소, 좌우 탐색
  - 키보드 네비게이션 (ESC, 화살표)
- [ ] PDF 뷰어 컴포넌트
  - `cc/src/components/common/pdf-viewer/`
  - react-pdf 또는 iframe 활용
- [ ] 게시글 상세 페이지에 첨부파일 섹션 추가
- [ ] 첨부파일 다운로드 기능

**참고 파일**:
```
cc/src/app/(main)/board/[id]/page.tsx
```

---

### 3. 조회수 중복 방지 로직

**문서 설계 내용** (functional.md FR-20 참조):
- 동일 사용자 24시간 내 중복 조회 미집계
- IP 또는 사용자 ID 기반

**현재 상태**:
- 조회 시마다 viewCount 증가 (중복 방지 없음)

**TODO**:
- [ ] 조회 기록 저장 방식 결정
  - 옵션 1: Redis (TTL 24시간)
  - 옵션 2: DB 테이블 (PostView)
- [ ] Redis 기반 구현 (권장)
  ```typescript
  // 키: `post:view:{postId}:{userId or IP}`
  // TTL: 86400 (24시간)
  ```
- [ ] 조회수 증가 API 수정
  - `POST /api/posts/[id]/view`
  - 중복 체크 후 조회수 증가
- [ ] 로그인 사용자: userId 기반
- [ ] 비로그인 사용자: IP + UserAgent 기반

**참고 파일**:
```
cc/src/app/api/posts/[id]/view/route.ts
cc/src/lib/prisma.ts
```

---

### 4. 게시글 검색 고도화

**문서 설계 내용** (functional.md FR-12 참조):
- 제목, 본문, 작성자 검색
- 자동완성 기능

**현재 상태**:
- 기본 키워드 검색만 구현
- 자동완성 미구현

**TODO**:
- [ ] 검색 대상 확장
  - 작성자 닉네임 검색 추가
  - 태그 검색 (향후)
- [ ] 검색 자동완성 API
  - `GET /api/posts/search/suggestions?q=xxx`
  - 최근 검색어, 인기 검색어 반환
- [ ] 검색 자동완성 UI
  - Debounce 적용 (300ms)
  - 드롭다운 추천 목록
- [ ] 검색 결과 하이라이팅

**참고 파일**:
```
cc/src/app/(main)/board/page.tsx
cc/src/app/api/posts/route.ts
```

---

### 5. 게시글 공유 기능 완성

**문서 설계 내용** (functional.md FR-14 참조):
- URL 복사
- SNS 공유 (Twitter, Facebook, KakaoTalk)
- OG 태그 지원

**현재 상태**:
- ShareButton 컴포넌트 존재
- SNS 공유 미구현

**TODO**:
- [ ] 카카오톡 공유 연동
  - Kakao JavaScript SDK 로드
  - `Kakao.Share.sendDefault()` 호출
- [ ] Twitter 공유
  - 공유 URL 생성
  - `window.open()` 팝업
- [ ] Facebook 공유
  - Facebook Share Dialog 연동
- [ ] OG 태그 동적 생성 확인
  - `cc/src/app/(main)/board/[id]/page.tsx`에 generateMetadata 확인

**참고 파일**:
```
cc/src/components/board/share-button/
cc/src/app/(main)/board/[id]/page.tsx
```

---

### 6. 리치 텍스트 에디터 개선

**문서 설계 내용** (post-write-page.md 참조):
- 마크다운 에디터
- 이미지 드래그 앤 드롭

**현재 상태**:
- 기본 textarea 또는 간단한 에디터

**TODO**:
- [ ] 리치 텍스트 에디터 라이브러리 선택
  - 옵션: TipTap, Lexical, Plate
- [ ] 에디터 컴포넌트 구현
  - 볼드, 이탤릭, 제목 등 서식
  - 이미지 삽입
  - 코드 블록
- [ ] 이미지 드래그 앤 드롭 지원
- [ ] 에디터 콘텐츠 HTML/Markdown 저장

**참고 파일**:
```
cc/src/components/board/post-editor/
cc/src/app/(main)/board/write/page.tsx
```

---

## 📝 문서 보완 필요 사항

### post-write-page.md 보완 필요
- [ ] 첨부파일 업로드 UI 상세 명세
- [ ] 드래그 앤 드롭 상호작용 설명
- [ ] 파일 업로드 에러 케이스

### API 문서 보완 필요
- [ ] `POST /api/upload` 엔드포인트 추가
- [ ] `GET /api/posts/search/suggestions` 엔드포인트 추가
- [ ] `POST /api/posts/[id]/view` 엔드포인트 상세화

---

## 📌 구현 순서 권장

1. 조회수 중복 방지 로직 (간단하고 중요)
2. 첨부파일 업로드 (핵심 기능)
3. 첨부파일 미리보기
4. 게시글 공유 SNS 연동
5. 검색 자동완성
6. 리치 텍스트 에디터 개선

---

**이전 문서**: [인증 보완 작업](./01-auth-complement.md)  
**다음 문서**: [채팅 보완 작업](./03-chat-complement.md)
