# 02-1: shadcn/ui 설치 및 기본 설정

**상위 문서**: [README.md](./README.md)

---

## 📋 개요

shadcn/ui 컴포넌트를 설치하고 프로젝트에 맞게 기본 설정을 구성합니다.

**예상 소요 시간**: 2시간

---

## ✅ 체크리스트

### 1. shadcn/ui 초기화

```bash
npx shadcn@latest init
```

초기화 시 선택 옵션:
- Style: Default
- Base color: Slate
- CSS variables: Yes

- [x] shadcn/ui 초기화 완료
- [x] components.json 생성 확인

---

### 2. 기본 컴포넌트 설치

#### 2.1 버튼 및 입력 필드

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add label
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add select
npx shadcn@latest add switch
```

- [x] button 설치
- [x] input 설치
- [x] textarea 설치
- [x] label 설치
- [x] checkbox 설치
- [x] radio-group 설치
- [x] select 설치
- [x] switch 설치

#### 2.2 레이아웃 컴포넌트

```bash
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
```

- [x] card 설치
- [x] separator 설치
- [x] scroll-area 설치

#### 2.3 오버레이 컴포넌트

```bash
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add sheet
npx shadcn@latest add popover
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tooltip
```

- [x] dialog 설치
- [x] alert-dialog 설치
- [x] sheet 설치
- [x] popover 설치
- [x] dropdown-menu 설치
- [x] tooltip 설치

#### 2.4 피드백 컴포넌트

```bash
npx shadcn@latest add sonner
npx shadcn@latest add skeleton
npx shadcn@latest add progress
```

- [x] sonner (toast) 설치
- [x] skeleton 설치
- [x] progress 설치

#### 2.5 데이터 표시 컴포넌트

```bash
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add tabs
```

- [x] avatar 설치
- [x] badge 설치
- [x] tabs 설치

#### 2.6 폼 컴포넌트

```bash
npx shadcn@latest add form
npx shadcn@latest add command
```

- [x] form (react-hook-form 통합) 설치
- [x] command (검색/명령 팔레트) 설치

---

### 3. 컴포넌트 폴더 구조 재구성

shadcn/ui 설치 후 기본 구조를 CSS 분리 구조로 재구성합니다.

#### 3.1 기존 구조 (shadcn 기본)

```
components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
└── ...
```

#### 3.2 재구성 구조 (CSS 분리)

```
components/ui/
├── button/
│   ├── button.tsx      # 기존 button.tsx 이동 + CSS import 추가
│   ├── button.css      # 신규 생성
│   └── index.ts        # export { Button } from './button'
├── input/
│   ├── input.tsx
│   ├── input.css
│   └── index.ts
└── ...
```

- [x] 각 컴포넌트를 폴더 구조로 재구성
- [x] CSS 파일 생성
- [x] index.ts 배럴 파일 생성
- [x] import 경로 업데이트

#### 3.3 배럴 파일 예시

```typescript
// components/ui/button/index.ts
export { Button, type ButtonProps } from './button';
```

```typescript
// components/ui/index.ts (전체 배럴)
export * from './button';
export * from './input';
export * from './card';
// ... 기타 컴포넌트
```

- [x] 개별 컴포넌트 배럴 파일 생성
- [x] 전체 UI 배럴 파일 생성

---

### 4. lib/utils.ts 확인

shadcn/ui 초기화 시 자동 생성되는 유틸리티 함수를 확인합니다.

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [x] cn 함수 존재 확인
- [x] clsx, tailwind-merge 패키지 설치 확인

---

### 5. 공통 컴포넌트 폴더 생성

비즈니스 로직이 포함된 공통 컴포넌트를 위한 폴더를 생성합니다.

```bash
mkdir -p src/components/common
mkdir -p src/components/common/form-field
mkdir -p src/components/common/confirm-dialog
mkdir -p src/components/common/sentiment-warning-modal
mkdir -p src/components/common/user-avatar
mkdir -p src/components/common/pagination
mkdir -p src/components/common/empty-state
mkdir -p src/components/common/toaster
mkdir -p src/components/common/skeletons
```

- [x] common 폴더 구조 생성

---

## ✅ 완료 조건

- [x] 모든 shadcn/ui 컴포넌트 설치 완료
- [x] 컴포넌트 폴더 구조 재구성 완료
- [x] 배럴 파일 생성 완료
- [x] common 폴더 구조 생성 완료
- [x] 프로젝트 빌드 성공 (`npm run build`)

---

**다음**: [02-button-input.md](./02-button-input.md)
