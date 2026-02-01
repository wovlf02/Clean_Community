# Git 컨벤션

**관련 문서**: [코딩 컨벤션](../06_development/coding-conventions.md)

---

## 1. 브랜치 전략

### 1.1 브랜치 구조

```
main (production)
  │
  └── develop (development)
        │
        ├── feature/auth-login
        ├── feature/board-crud
        ├── feature/chat-socket
        ├── fix/login-error
        ├── hotfix/security-patch
        └── release/v1.0.0
```

### 1.2 브랜치 네이밍

| 유형 | 형식 | 예시 |
|------|------|------|
| 기능 개발 | `feature/<기능명>` | `feature/auth-login` |
| 버그 수정 | `fix/<버그명>` | `fix/login-validation` |
| 긴급 수정 | `hotfix/<이슈>` | `hotfix/security-patch` |
| 릴리즈 | `release/<버전>` | `release/v1.0.0` |
| 리팩토링 | `refactor/<대상>` | `refactor/auth-module` |
| 문서 | `docs/<문서명>` | `docs/api-spec` |

### 1.3 브랜치 규칙

- `main`: 프로덕션 배포 브랜치 (직접 푸시 금지)
- `develop`: 개발 통합 브랜치
- 모든 기능은 `develop`에서 분기
- PR 머지 후 feature 브랜치 삭제

---

## 2. 커밋 메시지

### 2.1 커밋 메시지 형식

```
<type>(<scope>): <subject>

[body]

[footer]
```

### 2.2 타입 (Type)

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷팅, 세미콜론 누락 등 (기능 변경 X) |
| `refactor` | 코드 리팩토링 (기능 변경 X) |
| `test` | 테스트 코드 추가/수정 |
| `chore` | 빌드, 설정 파일 수정 |
| `perf` | 성능 개선 |
| `ci` | CI/CD 설정 변경 |

### 2.3 스코프 (Scope)

| 스코프 | 설명 |
|--------|------|
| `auth` | 인증 관련 |
| `board` | 게시판 관련 |
| `chat` | 채팅 관련 |
| `friend` | 친구 관련 |
| `dashboard` | 대시보드 관련 |
| `ui` | UI 컴포넌트 |
| `api` | API 관련 |
| `db` | 데이터베이스 관련 |
| `config` | 설정 관련 |

### 2.4 커밋 메시지 예시

```bash
# 기능 추가
feat(auth): 이메일 로그인 기능 추가

NextAuth.js를 사용하여 Credentials Provider 구현
- 이메일/비밀번호 로그인
- JWT 세션 관리
- 자동 로그인 옵션

Closes #12

# 버그 수정
fix(board): 게시글 페이지네이션 오류 수정

offset 계산 오류로 인해 중복 게시글이 표시되던 문제 해결

Fixes #45

# 리팩토링
refactor(api): API 에러 핸들링 통합

커스텀 AppError 클래스로 에러 처리 일원화

# 문서
docs(readme): 설치 가이드 업데이트

# 설정
chore: ESLint 규칙 추가
```

---

## 3. Pull Request

### 3.1 PR 제목 형식

```
[<type>] <간단한 설명>
```

예시:
- `[feat] 이메일 로그인 기능 추가`
- `[fix] 게시글 조회수 중복 카운트 수정`
- `[refactor] 인증 모듈 리팩토링`

### 3.2 PR 템플릿

```markdown
## 📋 작업 내용

<!-- 변경 사항을 간략히 설명해주세요 -->

- 
- 

## 🎯 관련 이슈

<!-- 관련된 이슈 번호를 작성해주세요 -->

Closes #

## ✅ 체크리스트

- [ ] 코드가 정상적으로 동작하는지 확인했습니다
- [ ] 관련 테스트를 추가/수정했습니다
- [ ] 문서를 업데이트했습니다 (필요한 경우)
- [ ] 린팅 오류가 없습니다
- [ ] 타입 오류가 없습니다

## 📸 스크린샷 (선택)

<!-- UI 변경이 있는 경우 스크린샷을 첨부해주세요 -->

## 💬 참고 사항

<!-- 리뷰어가 알아야 할 사항이 있다면 작성해주세요 -->
```

### 3.3 PR 규칙

- 작은 단위로 PR 생성 (300줄 이하 권장)
- 최소 1명의 리뷰어 승인 필요
- CI 통과 필수
- Squash and Merge 사용

---

## 4. 코드 리뷰

### 4.1 리뷰어 가이드

- 코드의 기능적 정확성 확인
- 코딩 컨벤션 준수 여부 확인
- 성능 이슈 검토
- 보안 취약점 검토
- 테스트 커버리지 확인

### 4.2 리뷰 코멘트 접두사

| 접두사 | 의미 |
|--------|------|
| `[필수]` | 반드시 수정 필요 |
| `[권장]` | 수정 권장 |
| `[질문]` | 이해가 필요한 부분 |
| `[칭찬]` | 좋은 코드 |
| `[논의]` | 논의가 필요한 부분 |

### 4.3 예시

```
[필수] 여기서 에러 핸들링이 빠져있습니다. try-catch로 감싸주세요.

[권장] 이 함수는 utils로 분리하면 재사용성이 높아질 것 같습니다.

[질문] 이 로직의 의도가 잘 이해되지 않는데 설명 부탁드립니다.

[칭찬] 깔끔한 추상화입니다! 👍
```

---

## 5. 버전 관리

### 5.1 시맨틱 버저닝

```
MAJOR.MINOR.PATCH

예: v1.2.3
    │ │ └── PATCH: 버그 수정
    │ └──── MINOR: 하위 호환 기능 추가
    └────── MAJOR: 호환되지 않는 변경
```

### 5.2 버전 업데이트 기준

| 변경 유형 | 버전 업데이트 |
|----------|---------------|
| 버그 수정 | PATCH |
| 새 기능 (하위 호환) | MINOR |
| 기존 기능 변경/삭제 | MAJOR |
| 초기 개발 | 0.x.x |

---

## 6. Git 명령어 가이드

### 6.1 자주 사용하는 명령어

```bash
# 브랜치 생성 및 이동
git checkout -b feature/new-feature

# 변경사항 스테이징
git add .

# 커밋
git commit -m "feat(scope): 설명"

# 원격 저장소에 푸시
git push origin feature/new-feature

# develop 브랜치 최신화
git checkout develop
git pull origin develop

# 브랜치 리베이스
git checkout feature/new-feature
git rebase develop

# 충돌 해결 후
git add .
git rebase --continue

# 강제 푸시 (리베이스 후)
git push -f origin feature/new-feature

# 브랜치 삭제
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### 6.2 커밋 수정

```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "새로운 메시지"

# 마지막 N개 커밋 합치기
git rebase -i HEAD~N

# 특정 커밋 취소
git revert <commit-hash>
```

---

## 7. .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build
.next/
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Test
coverage/

# Python
__pycache__/
*.py[cod]
venv/
.venv/

# Prisma
prisma/migrations/**/migration_lock.toml
```

---

**최종 업데이트**: 2026년 2월 2일
