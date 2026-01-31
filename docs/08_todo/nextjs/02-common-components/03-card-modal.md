# 02-3: 카드, 모달/다이얼로그 컴포넌트

**상위 문서**: [README.md](./README.md)

---

## 📋 개요

카드와 모달/다이얼로그 컴포넌트를 CSS 분리 방식으로 구현합니다.

**예상 소요 시간**: 4시간

---

## ✅ 체크리스트

### 1. Card 컴포넌트

#### 1.1 카드 CSS 파일

```css
/* components/ui/card/card.css */

/* ===== 기본 카드 ===== */
.card {
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--border));
  background-color: rgb(var(--card));
  color: rgb(var(--card-foreground));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 200ms ease-out;
}

/* ===== 인터랙티브 카드 ===== */
.card--interactive {
  cursor: pointer;
}

.card--interactive:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
  border-color: rgb(var(--primary) / 0.3);
}

.card--interactive:active {
  transform: translateY(0);
}

/* ===== 아웃라인 카드 ===== */
.card--outline {
  box-shadow: none;
  border-width: 2px;
}

/* ===== 카드 헤더 ===== */
.card__header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.25rem;
  padding-bottom: 0;
}

/* ===== 카드 제목 ===== */
.card__title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

/* ===== 카드 설명 ===== */
.card__description {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
  line-height: 1.5;
}

/* ===== 카드 콘텐츠 ===== */
.card__content {
  padding: 1.25rem;
}

/* ===== 카드 푸터 ===== */
.card__footer {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  padding-top: 0;
}

/* ===== 포커스 상태 (키보드 네비게이션) ===== */
.card--interactive:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgb(var(--background)), 0 0 0 4px rgb(var(--primary));
}

/* ===== 다크 모드 ===== */
:root.dark .card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

:root.dark .card--interactive:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
}
```

#### 1.2 카드 컴포넌트

```typescript
// components/ui/card/card.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import './card.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'outline';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'card',
        variant !== 'default' && `card--${variant}`,
        className
      )}
      tabIndex={variant === 'interactive' ? 0 : undefined}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('card__header', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('card__title', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('card__description', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('card__content', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('card__footer', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
```

- [ ] card.css 파일 생성
- [ ] card.tsx 파일 생성
- [ ] interactive variant 호버 효과 (translateY + shadow)
- [ ] 키보드 네비게이션 포커스 스타일
- [ ] 다크 모드 그림자 조정

---

### 2. Modal 공통 스타일

#### 2.1 모달 공통 CSS

```css
/* components/common/modal/modal.css */

/* ===== 오버레이 ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 50;
  animation: modal-overlay-show 200ms ease-out;
}

@keyframes modal-overlay-show {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ===== 모달 콘텐츠 ===== */
.modal-content {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 51;
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
  background-color: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  animation: modal-content-show 200ms ease-out;
}

@keyframes modal-content-show {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* ===== 모바일 최적화 ===== */
@media (max-width: 640px) {
  .modal-content {
    max-width: calc(100% - 2rem);
    padding: 1.25rem;
  }
  
  /* 하단 시트 스타일 옵션 */
  .modal-content--bottom-sheet {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    border-radius: 1rem 1rem 0 0;
    max-height: 80vh;
    animation: modal-slide-up 300ms ease-out;
  }
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 모달 헤더 ===== */
.modal-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.modal-header__icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-header__icon--warning {
  background-color: rgb(254 243 199); /* warning-light */
  color: rgb(245 158 11); /* warning */
}

.modal-header__icon--danger {
  background-color: rgb(254 226 226); /* error-light */
  color: rgb(239 68 68); /* error */
}

.modal-header__icon--success {
  background-color: rgb(220 252 231); /* success-light */
  color: rgb(34 197 94); /* success */
}

.modal-header__title {
  font-size: 1.125rem;
  font-weight: 600;
}

.modal-header__description {
  font-size: 0.875rem;
  color: rgb(var(--muted-foreground));
}

/* ===== 모달 푸터 ===== */
.modal-footer {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

@media (min-width: 640px) {
  .modal-footer {
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .modal-footer > * {
    flex: 0 0 auto;
  }
}

/* ===== 닫기 버튼 ===== */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  color: rgb(var(--muted-foreground));
  transition: all 150ms ease-out;
}

.modal-close:hover {
  background-color: rgb(var(--muted));
  color: rgb(var(--foreground));
}
```

- [ ] modal.css 공통 스타일 파일 생성
- [ ] 애니메이션 (fade + scale)
- [ ] 모바일 하단 시트 스타일 옵션
- [ ] 아이콘 변형 (success, danger, warning)

---

### 3. ConfirmDialog 컴포넌트

#### 3.1 확인 모달 CSS

```css
/* components/common/confirm-dialog/confirm-dialog.css */
@import '../modal/modal.css';

/* 추가 스타일이 필요한 경우 여기에 작성 */
```

#### 3.2 확인 모달 컴포넌트

```typescript
// components/common/confirm-dialog/confirm-dialog.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import './confirm-dialog.css';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  onConfirm: () => void;
  isLoading?: boolean;
}

const iconMap = {
  default: CheckCircle,
  destructive: Trash2,
  warning: AlertTriangle,
};

const iconClassMap = {
  default: 'modal-header__icon--success',
  destructive: 'modal-header__icon--danger',
  warning: 'modal-header__icon--warning',
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  onConfirm,
  isLoading,
}: ConfirmDialogProps) {
  const Icon = iconMap[variant];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="modal-content">
        <AlertDialogHeader className="modal-header">
          <div className={`modal-header__icon ${iconClassMap[variant]}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="modal-header__title">{title}</AlertDialogTitle>
          <AlertDialogDescription className="modal-header__description">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="modal-footer">
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelText}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] ConfirmDialog 컴포넌트 생성
- [ ] 아이콘 변형 (success, danger, warning)
- [ ] isLoading 상태 지원

---

### 4. SentimentWarningModal 컴포넌트

#### 4.1 감정분석 경고 모달 CSS

```css
/* components/common/sentiment-warning-modal/sentiment-warning-modal.css */
@import '../modal/modal.css';

.sentiment-modal__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  padding: 1rem 0;
}

.sentiment-modal__category {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background-color: rgb(254 226 226);
  color: rgb(185 28 28);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  animation: badge-pop 300ms ease-out backwards;
}

/* 순차 등장 애니메이션 (UX 강화) */
.sentiment-modal__category:nth-child(1) { animation-delay: 0ms; }
.sentiment-modal__category:nth-child(2) { animation-delay: 50ms; }
.sentiment-modal__category:nth-child(3) { animation-delay: 100ms; }
.sentiment-modal__category:nth-child(4) { animation-delay: 150ms; }
.sentiment-modal__category:nth-child(5) { animation-delay: 200ms; }

@keyframes badge-pop {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 다크 모드 */
:root.dark .sentiment-modal__category {
  background-color: rgb(127 29 29);
  color: rgb(254 202 202);
}
```

#### 4.2 감정분석 경고 모달 컴포넌트

```typescript
// components/common/sentiment-warning-modal/sentiment-warning-modal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import './sentiment-warning-modal.css';

interface SentimentWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onEdit: () => void;
  onProceed: () => void;
  isLoading?: boolean;
}

export function SentimentWarningModal({
  open,
  onOpenChange,
  categories,
  onEdit,
  onProceed,
  isLoading,
}: SentimentWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal-content sm:max-w-md">
        <DialogHeader className="modal-header">
          <div className="modal-header__icon modal-header__icon--warning">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="modal-header__title">유해 표현 감지</DialogTitle>
          <DialogDescription className="modal-header__description">
            작성하신 내용에서 아래 카테고리의 유해 표현이 감지되었습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className="sentiment-modal__categories" 
          role="list" 
          aria-label="감지된 유해 표현 카테고리"
        >
          {categories.map((category) => (
            <span 
              key={category} 
              className="sentiment-modal__category"
              role="listitem"
            >
              {category}
            </span>
          ))}
        </div>
        
        <DialogFooter className="modal-footer">
          <Button variant="outline" onClick={onEdit} className="w-full sm:w-auto">
            수정하기
          </Button>
          <Button
            variant="secondary"
            onClick={onProceed}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            그대로 등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] sentiment-warning-modal.css 파일 생성
- [ ] sentiment-warning-modal.tsx 파일 생성
- [ ] 배지 순차 등장 애니메이션
- [ ] 접근성 role 속성 추가

---

## ✅ 완료 조건

- [ ] Card 컴포넌트 (CSS 분리) 완료
- [ ] Modal 공통 CSS 완료
- [ ] ConfirmDialog 컴포넌트 완료
- [ ] SentimentWarningModal 컴포넌트 완료
- [ ] 모든 애니메이션 동작 확인
- [ ] 모바일 반응형 확인
- [ ] 프로젝트 빌드 성공

---

**이전**: [02-button-input.md](./02-button-input.md)

**다음**: [04-feedback.md](./04-feedback.md)
