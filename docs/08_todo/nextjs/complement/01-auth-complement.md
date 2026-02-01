# 인증 보완 작업 (Auth Complement)

**관련 문서**: 
- [기능 요구사항 - 사용자 인증](../../../02_requirements/functional.md#1-사용자-인증-fr-01--fr-06)
- [로그인 화면 설계](../../../05_screens/01_auth/login-page.md)
- [회원가입 화면 설계](../../../05_screens/01_auth/register-page.md)
- [아이디 찾기 화면 설계](../../../05_screens/01_auth/find-id-page.md)
- [비밀번호 찾기 화면 설계](../../../05_screens/01_auth/forgot-password-page.md)
- [NextAuth.js 설정](../../10-backend-api.md)

---

## 📋 현재 구현 상태

| 기능 요구사항 | 상태 | 구현 위치 |
|--------------|------|----------|
| FR-01: 회원가입 | ✅ 완료 | `cc/src/app/(auth)/register/` |
| FR-02: 로그인 | ⚠️ 부분 | `cc/src/app/(auth)/login/` |
| FR-03: 로그아웃 | ✅ 완료 | NextAuth.js |
| FR-04: 비밀번호 재설정 | ⚠️ 부분 | `cc/src/app/(auth)/forgot-password/` |
| FR-05: 프로필 관리 | ✅ 완료 | `cc/src/app/(main)/profile/` |
| FR-06: 계정 탈퇴 | ✅ 완료 | `cc/src/app/(main)/settings/delete-account/` |

---

## ✅ 체크리스트

### 1. OAuth 소셜 로그인 연동

**문서 설계 내용** (login-page.md 참조):
- Google, Kakao, Naver 소셜 로그인 지원
- 원형 아이콘 버튼 (48px × 48px)
- hover 시 scale(1.05) 효과

**현재 상태**:
- UI 컴포넌트만 존재, 실제 OAuth 연동 미완성
- NextAuth.js Provider 설정 필요

**TODO**:
- [ ] Google OAuth Provider 설정
  - Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 환경변수 설정
  - NextAuth.js에 GoogleProvider 추가
- [ ] Kakao OAuth Provider 설정
  - Kakao Developers에서 앱 등록
  - `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET` 환경변수 설정
  - NextAuth.js에 KakaoProvider 추가
- [ ] Naver OAuth Provider 설정
  - Naver Developers에서 앱 등록
  - `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 환경변수 설정
  - NextAuth.js에 NaverProvider 추가
- [ ] 소셜 로그인 버튼 onClick 핸들러 연결
- [ ] 소셜 로그인 후 콜백 처리
- [ ] 기존 계정과 소셜 계정 연동 처리

**참고 파일**:
```
cc/src/lib/auth.ts
cc/src/app/api/auth/[...nextauth]/route.ts
cc/src/app/(auth)/login/page.tsx
```

---

### 2. 비밀번호 재설정 이메일 발송

**문서 설계 내용** (functional.md FR-04 참조):
- 가입된 이메일로 재설정 링크 발송
- 새 비밀번호 설정 페이지 제공

**현재 상태**:
- UI 페이지만 존재
- 이메일 발송 로직 미구현

**TODO**:
- [ ] 이메일 발송 서비스 설정
  - Resend, SendGrid, AWS SES 중 선택
  - 환경변수 설정 (`EMAIL_SERVER_*`, `EMAIL_FROM`)
- [ ] 비밀번호 재설정 토큰 생성 API 구현
  - `POST /api/auth/forgot-password`
  - 토큰 생성 및 DB 저장 (VerificationToken 모델 활용)
  - 만료 시간 설정 (예: 1시간)
- [ ] 이메일 템플릿 작성
  - 비밀번호 재설정 링크 포함
  - 브랜드 스타일 적용
- [ ] 비밀번호 재설정 페이지 구현
  - `GET /reset-password?token=xxx`
  - 토큰 유효성 검증
  - 새 비밀번호 설정 폼
- [ ] 비밀번호 변경 API 구현
  - `POST /api/auth/reset-password`
  - 토큰 검증 후 비밀번호 업데이트

**참고 파일**:
```
cc/src/app/(auth)/forgot-password/page.tsx
cc/prisma/schema.prisma (VerificationToken 모델)
```

---

### 3. 아이디 찾기 기능

**문서 설계 내용** (find-id-page.md 참조):
- 이메일로 아이디(이메일 마스킹) 안내

**현재 상태**:
- UI 페이지 존재
- 실제 조회 및 이메일 발송 미구현

**TODO**:
- [ ] 아이디 찾기 API 구현
  - `POST /api/auth/find-id`
  - 이름 + 휴대폰 번호 또는 이메일로 조회
- [ ] 마스킹된 이메일 반환 (예: `u***@example.com`)
- [ ] 아이디 찾기 결과 페이지 UI 완성

**참고 파일**:
```
cc/src/app/(auth)/find-id/page.tsx
```

---

### 4. 이메일 인증 플로우 보완

**문서 설계 내용** (register-page.md 참조):
- 회원가입 시 이메일 인증 코드 발송
- 인증 코드 입력 후 다음 단계 진행

**현재 상태**:
- 스텝 UI 존재 (step-email-verify)
- 실제 이메일 발송 및 검증 미구현

**TODO**:
- [ ] 이메일 인증 코드 발송 API
  - `POST /api/auth/send-verification-code`
  - 6자리 랜덤 코드 생성
  - 이메일 발송
- [ ] 인증 코드 검증 API
  - `POST /api/auth/verify-code`
  - 코드 유효성 및 만료 시간 검증
- [ ] 인증 완료 후 상태 관리
- [ ] 재발송 기능 (쿨다운 타이머)

**참고 파일**:
```
cc/src/app/(auth)/register/steps/step-email-verify.tsx
```

---

### 5. 자동 로그인 기능

**문서 설계 내용** (login-page.md 참조):
- 자동 로그인 체크박스 옵션
- 세션 유지 기능

**현재 상태**:
- UI 체크박스 존재
- 실제 동작 미구현

**TODO**:
- [ ] 세션 만료 시간 조정 로직
  - 자동 로그인 체크 시: 30일
  - 미체크 시: 세션 종료 시 만료
- [ ] Remember me 쿠키 설정
- [ ] NextAuth.js session 설정 수정

**참고 파일**:
```
cc/src/app/(auth)/login/page.tsx
cc/src/lib/auth.ts
```

---

## 📝 문서 보완 필요 사항

### auth-screens.md 보완 필요
- [ ] OAuth 콜백 처리 플로우 추가
- [ ] 이메일 인증 상태 다이어그램 추가
- [ ] 에러 케이스별 UI 명세 추가

### API 문서 보완 필요
- [ ] `/api/auth/send-verification-code` 엔드포인트 추가
- [ ] `/api/auth/verify-code` 엔드포인트 추가
- [ ] `/api/auth/find-id` 엔드포인트 추가

---

## 📌 구현 순서 권장

1. 이메일 발송 서비스 설정 (공통 인프라)
2. OAuth 소셜 로그인 연동 (우선순위 높음)
3. 이메일 인증 플로우 완성
4. 비밀번호 재설정 기능
5. 아이디 찾기 기능
6. 자동 로그인 기능

---

**다음 문서**: [게시판 보완 작업](./02-board-complement.md)
