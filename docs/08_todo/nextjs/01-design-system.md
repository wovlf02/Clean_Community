# Phase 1: 디자인 시스템 구축

**관련 문서**: [디자인 시스템](../../05_screens/00_common/design-system.md) | [Phase 0: 프로젝트 초기 설정](./00-project-setup.md)

---

## 📋 개요

Tailwind CSS 기반 디자인 시스템을 구축하고, 프로젝트 전반에서 일관된 스타일을 적용합니다.

**예상 소요 시간**: 1일

**참고 문서**: `docs/05_screens/00_common/design-system.md`

---

## ✅ 체크리스트

### 1. Tailwind CSS 테마 커스터마이징

#### 1.1 tailwind.config.ts 설정

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 컬러 (Blue 계열)
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',  // 메인 브랜드 컬러
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        // 시맨틱 컬러
        success: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['30px', { lineHeight: '1.25', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

- [x] tailwind.config.ts 생성/수정
- [x] 브랜드 컬러 팔레트 설정
- [x] 시맨틱 컬러 설정
- [x] 커스텀 폰트 크기 설정
- [x] 커스텀 애니메이션 설정
- [x] Typography 플러그인 적용

---

### 2. CSS 변수 정의

#### 2.1 globals.css 설정

```css
/* src/app/globals.css */
@import 'tailwindcss';

/* ===================================
   CSS Custom Properties (Light Mode)
   =================================== */
:root {
  /* Background */
  --background: 249 250 251;        /* neutral-50 */
  --foreground: 17 24 39;           /* neutral-900 */
  
  /* Card */
  --card: 255 255 255;              /* white */
  --card-foreground: 17 24 39;      /* neutral-900 */
  
  /* Primary (Brand) */
  --primary: 59 130 246;            /* brand-500 */
  --primary-foreground: 255 255 255;
  
  /* Secondary */
  --secondary: 243 244 246;         /* neutral-100 */
  --secondary-foreground: 55 65 81; /* neutral-700 */
  
  /* Muted */
  --muted: 243 244 246;             /* neutral-100 */
  --muted-foreground: 107 114 128;  /* neutral-500 */
  
  /* Accent */
  --accent: 239 246 255;            /* brand-50 */
  --accent-foreground: 29 78 216;   /* brand-700 */
  
  /* Destructive */
  --destructive: 239 68 68;         /* error */
  --destructive-foreground: 255 255 255;
  
  /* Border */
  --border: 229 231 235;            /* neutral-200 */
  --input: 229 231 235;             /* neutral-200 */
  --ring: 59 130 246;               /* brand-500 */
  
  /* Radius */
  --radius: 0.5rem;
}

/* ===================================
   CSS Custom Properties (Dark Mode)
   =================================== */
.dark {
  /* Background */
  --background: 24 24 27;           /* zinc-900 */
  --foreground: 250 250 250;        /* zinc-50 */
  
  /* Card */
  --card: 39 39 42;                 /* zinc-800 */
  --card-foreground: 250 250 250;   /* zinc-50 */
  
  /* Primary (Brand) */
  --primary: 96 165 250;            /* brand-400 */
  --primary-foreground: 23 37 84;   /* brand-950 */
  
  /* Secondary */
  --secondary: 39 39 42;            /* zinc-800 */
  --secondary-foreground: 228 228 231; /* zinc-200 */
  
  /* Muted */
  --muted: 39 39 42;                /* zinc-800 */
  --muted-foreground: 161 161 170;  /* zinc-400 */
  
  /* Accent */
  --accent: 30 58 138;              /* brand-900 */
  --accent-foreground: 191 219 254; /* brand-200 */
  
  /* Destructive */
  --destructive: 239 68 68;         /* error */
  --destructive-foreground: 255 255 255;
  
  /* Border */
  --border: 63 63 70;               /* zinc-700 */
  --input: 63 63 70;                /* zinc-700 */
  --ring: 96 165 250;               /* brand-400 */
}

/* ===================================
   Base Styles
   =================================== */
* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* ===================================
   Scrollbar Styles
   =================================== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-neutral-300 dark:bg-neutral-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-neutral-400 dark:bg-neutral-500;
}

/* ===================================
   Focus Styles
   =================================== */
:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}

/* ===================================
   Selection Styles
   =================================== */
::selection {
  @apply bg-brand-500/20 text-brand-900 dark:bg-brand-400/20 dark:text-brand-100;
}
```

- [x] CSS 변수 정의 (라이트 모드)
- [x] CSS 변수 정의 (다크 모드)
- [x] 기본 스타일 정의
- [x] 스크롤바 스타일
- [x] 포커스 스타일
- [x] 선택 스타일

---

### 3. 다크 모드 설정

#### 3.1 next-themes 설정 확인

```typescript
// providers/theme-provider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [x] ThemeProvider 설정 확인
- [x] `attribute="class"` 설정 (Tailwind dark mode)
- [x] `enableSystem` 설정 (시스템 테마 감지)

#### 3.2 다크 모드 토글 훅

```typescript
// hooks/use-theme-toggle.ts
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isDark = resolvedTheme === 'dark';

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    mounted,
  };
}
```

- [x] useThemeToggle 훅 생성
- [x] 마운트 상태 처리 (hydration 이슈 방지)

---

### 4. Pretendard 폰트 적용

#### 4.1 폰트 설정 (CDN 방식)

```css
/* src/styles/fonts.css */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
```

#### 4.2 또는 next/font 방식 (권장)

```typescript
// src/app/layout.tsx
import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    {
      path: '../fonts/PretendardVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* ... */}
      </body>
    </html>
  );
}
```

- [x] 폰트 파일 다운로드 또는 CDN 설정
- [x] next/font 또는 CSS import 적용
- [x] CSS 변수 설정 (`--font-pretendard`)
- [x] Tailwind fontFamily에 연결

---

### 5. 컴포넌트 스타일 유틸리티

#### 5.1 스타일 상수 정의

```typescript
// lib/styles.ts
export const buttonStyles = {
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
    secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700',
    outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800',
    danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700',
  },
  sizes: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
  },
};

export const inputStyles = {
  base: 'flex w-full rounded-lg border bg-transparent px-4 py-2 text-body transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    default: 'border-input',
    error: 'border-error focus-visible:ring-error',
  },
  sizes: {
    sm: 'h-9 text-sm',
    md: 'h-11 text-body',
    lg: 'h-12 text-body-lg',
  },
};

export const cardStyles = {
  base: 'rounded-xl border bg-card text-card-foreground shadow-card',
  variants: {
    default: '',
    interactive: 'cursor-pointer transition-shadow hover:shadow-card-hover',
  },
};

export const badgeStyles = {
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variants: {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    primary: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
    success: 'bg-success-light text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-warning-light text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    danger: 'bg-error-light text-red-800 dark:bg-red-900 dark:text-red-200',
    outline: 'border border-current bg-transparent',
  },
};
```

- [x] 버튼 스타일 상수 정의
- [x] 입력 필드 스타일 상수 정의
- [x] 카드 스타일 상수 정의
- [x] 배지 스타일 상수 정의

---

### 6. 반응형 브레이크포인트

#### 6.1 Tailwind 기본 브레이크포인트 확인

| Breakpoint | Min Width | 용도 |
|------------|-----------|------|
| `sm` | 640px | 소형 모바일 이상 |
| `md` | 768px | 태블릿 이상 |
| `lg` | 1024px | 데스크톱 이상 |
| `xl` | 1280px | 대형 데스크톱 이상 |
| `2xl` | 1536px | 초대형 화면 |

#### 6.2 반응형 유틸리티 훅

```typescript
// hooks/use-media-query.ts
'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// 프리셋 훅들
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}
```

- [x] useMediaQuery 훅 생성
- [x] useIsMobile, useIsTablet, useIsDesktop 훅 생성

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/
│   └── globals.css          (수정)
├── styles/
│   └── fonts.css            (생성)
├── lib/
│   ├── utils.ts             (수정/확인)
│   └── styles.ts            (생성)
├── hooks/
│   ├── use-theme-toggle.ts  (생성)
│   └── use-media-query.ts   (생성)
├── providers/
│   └── theme-provider.tsx   (수정/확인)
└── tailwind.config.ts       (수정)
```

---

## ✅ 완료 조건

- [x] Tailwind CSS 테마 커스터마이징 완료
- [x] CSS 변수 정의 완료 (라이트/다크 모드)
- [x] 다크 모드 토글 동작 확인
- [x] Pretendard 폰트 적용 확인
- [x] 스타일 유틸리티 정의 완료
- [x] 반응형 훅 생성 완료
- [x] 프로젝트 빌드 성공 (`npm run build`)

---

## 🎨 디자인 토큰 요약

### 컬러

| 용도 | Light | Dark |
|------|-------|------|
| Background | `#F9FAFB` | `#18181B` |
| Card | `#FFFFFF` | `#27272A` |
| Primary | `#3B82F6` | `#60A5FA` |
| Text | `#111827` | `#FAFAFA` |
| Border | `#E5E7EB` | `#3F3F46` |

### 간격 (4px 단위)

- `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `5` = 20px, `6` = 24px, `8` = 32px

### 라운드

- `sm` = 4px, `md` = 8px, `lg` = 12px, `xl` = 16px, `full` = 9999px

---

**이전 단계**: [Phase 0: 프로젝트 초기 설정](./00-project-setup.md)

**다음 단계**: [Phase 2: 공통 컴포넌트 개발](./02-common-components.md)
