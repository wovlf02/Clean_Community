# 설정 화면 설계 (Settings Screens)

**관련 문서**: [디자인 시스템](../00_common/design-system.md) | [기능 요구사항](../../02_requirements/functional.md)

---

## 화면 목록

설정 도메인의 각 화면은 개별 문서로 분리되어 있습니다.

| 화면 | 파일 | 경로 | 설명 |
|------|------|------|------|
| 프로필 | [profile-page.md](./profile-page.md) | `/profile` | 프로필 조회 및 수정 |
| 설정 | [settings-page.md](./settings-page.md) | `/settings` | 설정 메인 화면 |
| 비밀번호 변경 | [change-password-page.md](./change-password-page.md) | `/settings/password` | 비밀번호 변경 |
| 계정 탈퇴 | [account-delete-page.md](./account-delete-page.md) | `/settings/delete-account` | 계정 탈퇴 |
| 이용약관 | [terms-of-service-page.md](./terms-of-service-page.md) | `/terms` | 이용약관 조회 |
| 개인정보 처리방침 | [privacy-policy-page.md](./privacy-policy-page.md) | `/privacy` | 개인정보 처리방침 조회 |
| 마케팅 정보 수신 | [marketing-consent-page.md](./marketing-consent-page.md) | `/settings/marketing` | 마케팅 수신 동의 관리 |

---

## 화면 흐름

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  설정 (SettingsPage)                                                        │
│  ├── 프로필 관리 → 프로필 (ProfilePage)                                    │
│  ├── 비밀번호 변경 → 비밀번호 변경 (ChangePasswordPage)                    │
│  ├── 연결된 계정 → (소셜 로그인 관리)                                      │
│  ├── 이용약관 → 이용약관 (TermsOfServicePage)                              │
│  ├── 개인정보 처리방침 → 개인정보 처리방침 (PrivacyPolicyPage)             │
│  ├── 마케팅 수신 → 마케팅 정보 수신 (MarketingConsentPage)                 │
│  └── 계정 탈퇴 → 계정 탈퇴 (AccountDeletePage)                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 공통 규칙

### 레이아웃 구조

- **Desktop**: Header + Sidebar + Main Content 레이아웃
- **Mobile**: Header + Main Content + Bottom Navigation 레이아웃

### 접근 권한

| 화면 | 권한 |
|------|------|
| 프로필, 설정, 비밀번호 변경, 계정 탈퇴, 마케팅 수신 | 로그인 필수 |
| 이용약관, 개인정보 처리방침 | 전체 (비로그인 포함) |

---

**최종 업데이트**: 2026년 1월 30일
