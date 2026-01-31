# 02-2: 버튼, 입력 필드, 폼 필드 컴포넌트

**상위 문서**: [README.md](./README.md)

---

## 📋 개요

버튼, 입력 필드, 폼 필드 등 기본 인터랙션 컴포넌트를 CSS 분리 방식으로 구현합니다.

**예상 소요 시간**: 4시간

---

## ✅ 체크리스트

### 1. Button 컴포넌트

#### 1.1 버튼 CSS 파일

```css
/* components/ui/button/button.css */

/* ===== 기본 스타일 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 150ms ease-out;
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
}

/* ===== 포커스 스타일 (접근성) ===== */
.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
}

/* ===== 비활성화 ===== */
.btn:disabled,
.btn--loading {
  pointer-events: none;
  opacity: 0.5;
}

/* ===== 변형 (Variants) ===== */
.btn--default {
  background-color: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
}

.btn--default:hover {
  background-color: rgb(37 99 235); /* brand-600 */
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgb(59 130 246 / 0.3);
}

.btn--default:active {
  transform: translateY(0);
  background-color: rgb(29 78 216); /* brand-700 */
}

.btn--destructive {
  background-color: rgb(var(--destructive));
  color: rgb(var(--destructive-foreground));
}

.btn--destructive:hover {
  background-color: rgb(220 38 38); /* red-600 */
}

.btn--outline {
  border: 1px solid rgb(var(--border));
  background-color: transparent;
}

.btn--outline:hover {
  background-color: rgb(var(--accent));
  border-color: rgb(var(--accent));
}

.btn--secondary {
  background-color: rgb(var(--secondary));
  color: rgb(var(--secondary-foreground));
}

.btn--secondary:hover {
  background-color: rgb(var(--secondary) / 0.8);
}

.btn--ghost {
  background-color: transparent;
}

.btn--ghost:hover {
  background-color: rgb(var(--accent));
}

.btn--link {
  color: rgb(var(--primary));
  text-decoration-line: underline;
  text-underline-offset: 4px;
  background-color: transparent;
}

/* ===== 크기 (Sizes) ===== */
.btn--sm {
  height: 2rem;
  padding: 0 0.75rem;
  font-size: 0.75rem;
}

.btn--md {
  height: 2.75rem; /* 44px - 터치 친화적 */
  padding: 0 1rem;
}

.btn--lg {
  height: 3rem;
  padding: 0 1.5rem;
  font-size: 1rem;
}

.btn--icon {
  height: 2.75rem;
  width: 2.75rem;
  padding: 0;
}

/* ===== 로딩 상태 ===== */
.btn__spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== 리플 효과 (터치 피드백) ===== */
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
}

.btn:active::after {
  transform: scale(2);
  opacity: 1;
  transition: transform 0s, opacity 0s;
}
```

#### 1.2 버튼 컴포넌트 파일

```typescript
// components/ui/button/button.tsx
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import './button.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      asChild = false,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          'btn',
          `btn--${variant}`,
          `btn--${size}`,
          isLoading && 'btn--loading',
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="btn__spinner h-4 w-4" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="btn__icon-left" aria-hidden="true">{leftIcon}</span>
        ) : null}
        <span className="btn__text">{children}</span>
        {!isLoading && rightIcon && (
          <span className="btn__icon-right" aria-hidden="true">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

#### 1.3 배럴 파일

```typescript
// components/ui/button/index.ts
export { Button, type ButtonProps } from './button';
```

- [ ] button.css 파일 생성
- [ ] button.tsx 파일 생성 (CSS import)
- [ ] index.ts 배럴 파일 생성
- [ ] isLoading, leftIcon, rightIcon 속성 추가
- [ ] 리플 효과 (터치 피드백) 구현
- [ ] 호버/액티브 마이크로 애니메이션
- [ ] 44px 최소 높이 (터치 친화적)

---

### 2. Input 컴포넌트

#### 2.1 입력 필드 CSS 파일

```css
/* components/ui/input/input.css */

/* ===== 컨테이너 ===== */
.input-wrapper {
  position: relative;
  width: 100%;
}

/* ===== 기본 스타일 ===== */
.input {
  display: flex;
  width: 100%;
  height: 2.75rem; /* 44px - 터치 친화적 */
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(var(--border));
  background-color: rgb(var(--background));
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(var(--foreground));
  transition: all 150ms ease-out;
}

/* ===== 플레이스홀더 ===== */
.input::placeholder {
  color: rgb(var(--muted-foreground));
}

/* ===== 포커스 상태 (접근성 강화) ===== */
.input:focus {
  outline: none;
  border-color: rgb(var(--primary));
  box-shadow: 0 0 0 3px rgb(var(--primary) / 0.1);
}

/* ===== 호버 상태 ===== */
.input:hover:not(:focus):not(:disabled) {
  border-color: rgb(var(--primary) / 0.5);
}

/* ===== 에러 상태 ===== */
.input--error {
  border-color: rgb(var(--destructive));
}

.input--error:focus {
  border-color: rgb(var(--destructive));
  box-shadow: 0 0 0 3px rgb(var(--destructive) / 0.1);
}

/* ===== 비활성화 ===== */
.input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: rgb(var(--muted));
}

/* ===== 아이콘 있는 경우 ===== */
.input--with-left-icon {
  padding-left: 2.5rem;
}

.input--with-right-icon {
  padding-right: 2.5rem;
}

/* ===== 아이콘 ===== */
.input__icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(var(--muted-foreground));
  pointer-events: none;
  transition: color 150ms ease-out;
}

.input__icon--left {
  left: 0.75rem;
}

.input__icon--right {
  right: 0.75rem;
}

/* 포커스 시 아이콘 색상 변경 */
.input-wrapper:focus-within .input__icon {
  color: rgb(var(--primary));
}

/* ===== 파일 입력 ===== */
.input[type="file"] {
  padding: 0.375rem 1rem;
}

.input[type="file"]::file-selector-button {
  border: 0;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--primary));
  cursor: pointer;
}

/* ===== 다크 모드 ===== */
:root.dark .input {
  background-color: rgb(var(--card));
}
```

#### 2.2 입력 필드 컴포넌트

```typescript
// components/ui/input/input.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import './input.css';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {leftIcon && (
          <div className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'input',
            error && 'input--error',
            leftIcon && 'input--with-left-icon',
            rightIcon && 'input--with-right-icon',
            className
          )}
          ref={ref}
          aria-invalid={error}
          {...props}
        />
        {rightIcon && (
          <div className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

- [ ] input.css 파일 생성
- [ ] input.tsx 파일 생성 (CSS import)
- [ ] error 상태 스타일 추가
- [ ] leftIcon, rightIcon 지원
- [ ] 높이 44px 적용 (터치 친화적)
- [ ] 포커스 시 아이콘 색상 변경 효과

---

### 3. FormField 컴포넌트

#### 3.1 Form Field CSS 파일

```css
/* components/common/form-field/form-field.css */

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--foreground));
}

.form-field__required {
  margin-left: 0.25rem;
  color: rgb(var(--destructive));
}

.form-field__description {
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
}

.form-field__error {
  font-size: 0.75rem;
  color: rgb(var(--destructive));
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 에러 시 흔들림 애니메이션 (UX 피드백) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.form-field--error .form-field__error {
  animation: shake 0.3s ease-in-out;
}
```

#### 3.2 Form Field 컴포넌트

```typescript
// components/common/form-field/form-field.tsx
'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import './form-field.css';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('form-field', error && 'form-field--error', className)}>
      {label && (
        <label className="form-field__label">
          {label}
          {required && <span className="form-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="form-field__description">{description}</p>
      )}
      {error && (
        <p className="form-field__error" role="alert">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
```

- [ ] form-field.css 파일 생성
- [ ] form-field.tsx 파일 생성
- [ ] 에러 시 흔들림 애니메이션
- [ ] 아이콘과 함께 에러 메시지 표시
- [ ] role="alert" 접근성 속성

---

## ✅ 완료 조건

- [ ] Button 컴포넌트 (CSS 분리) 완료
- [ ] Input 컴포넌트 (CSS 분리) 완료
- [ ] FormField 컴포넌트 완료
- [ ] 모든 컴포넌트 배럴 파일 생성
- [ ] 접근성 속성 (aria-*) 적용
- [ ] 프로젝트 빌드 성공

---

**이전**: [01-setup.md](./01-setup.md)

**다음**: [03-card-modal.md](./03-card-modal.md)
