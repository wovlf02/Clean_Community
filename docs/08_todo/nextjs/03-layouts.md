# Phase 3: 레이아웃 구현

**관련 문서**: [레이아웃](../../05_screens/00_common/layouts.md) | [Phase 2: 공통 컴포넌트](./02-common-components/)

---

## 📋 개요

전체 애플리케이션의 레이아웃 구조를 구현합니다. Desktop/Tablet/Mobile 반응형 레이아웃을 지원합니다.

**예상 소요 시간**: 2일

**참고 문서**: `docs/05_screens/00_common/layouts.md`

---

## 🎯 레이아웃 구조

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────────────────┐
│                         Header (64px)                            │
├──────────┬──────────────────────────────────┬───────────────────┤
│ Sidebar  │           Main Content           │   Right Panel     │
│ (240px)  │             (flex-1)             │     (320px)       │
└──────────┴──────────────────────────────────┴───────────────────┘
```

### Mobile (~767px)
```
┌─────────────────────────────────────────────────────────────────┐
│                    Header (56px)                                 │
├─────────────────────────────────────────────────────────────────┤
│                     Main Content                                 │
├─────────────────────────────────────────────────────────────────┤
│                   Bottom Tab Bar (64px)                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ 체크리스트

### 1. 전역 레이아웃 (RootLayout)

#### 1.1 app/layout.tsx

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/common/toaster';
import './globals.css';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '감성 커뮤니티',
  description: 'AI 기반 건강한 온라인 커뮤니티',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] 폰트 설정
- [ ] Provider 적용
- [ ] Toaster 추가
- [ ] 메타데이터 설정

---

### 2. Header 컴포넌트

#### 2.1 Header CSS

```css
/* components/layout/header/header.css */

.header {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  border-bottom: 1px solid rgb(var(--border));
  background-color: rgb(var(--background) / 0.95);
  backdrop-filter: blur(8px);
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem; /* 64px */
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* 로고 */
.header__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--foreground));
  text-decoration: none;
}

.header__logo:hover {
  opacity: 0.9;
}

/* 네비게이션 */
.header__nav {
  display: none;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .header__nav {
    display: flex;
  }
}

.header__nav-item {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--muted-foreground));
  border-radius: 0.5rem;
  transition: all 150ms ease-out;
}

.header__nav-item:hover {
  color: rgb(var(--foreground));
  background-color: rgb(var(--accent));
}

.header__nav-item--active {
  color: rgb(var(--primary));
  background-color: rgb(var(--accent));
}

/* 우측 액션 영역 */
.header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 알림 버튼 */
.header__notification {
  position: relative;
}

.header__notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 1rem;
  height: 1rem;
  padding: 0 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  background-color: rgb(239 68 68);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 프로필 드롭다운 */
.header__profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  padding-right: 0.75rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.header__profile:hover {
  background-color: rgb(var(--accent));
}

.header__profile-name {
  display: none;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (min-width: 768px) {
  .header__profile-name {
    display: block;
  }
}

/* 모바일 헤더 */
.header__mobile-menu {
  display: flex;
}

@media (min-width: 768px) {
  .header__mobile-menu {
    display: none;
  }
}

/* 모바일 높이 조정 */
@media (max-width: 767px) {
  .header__container {
    height: 3.5rem; /* 56px */
    padding: 0 1rem;
  }
}
```

#### 2.2 Header 컴포넌트

```typescript
// components/layout/header/header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { cn } from '@/lib/utils';
import './header.css';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/board', label: '게시판' },
  { href: '/chat', label: '채팅' },
  { href: '/friends', label: '친구' },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  // TODO: 실제 사용자 데이터로 교체
  const user = {
    name: '홍길동',
    image: null,
    isOnline: true,
  };
  const notificationCount = 3;

  return (
    <header className="header">
      <div className="header__container">
        {/* 모바일 메뉴 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="header__mobile-menu"
          onClick={onMenuClick}
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* 로고 */}
        <Link href="/" className="header__logo">
          <span>감성 커뮤니티</span>
        </Link>

        {/* 네비게이션 */}
        <nav className="header__nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'header__nav-item',
                pathname === item.href && 'header__nav-item--active'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 액션 영역 */}
        <div className="header__actions">
          {/* 검색 (모바일) */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* 알림 */}
          <div className="header__notification">
            <Button variant="ghost" size="icon" aria-label="알림">
              <Bell className="h-5 w-5" />
            </Button>
            {notificationCount > 0 && (
              <span className="header__notification-badge">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </div>

          {/* 프로필 */}
          <div className="header__profile">
            <UserAvatar
              src={user.image}
              name={user.name}
              size="sm"
              isOnline={user.isOnline}
            />
            <span className="header__profile-name">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] header.css 파일 생성
- [ ] header.tsx 파일 생성
- [ ] 반응형 네비게이션
- [ ] 알림 배지
- [ ] 프로필 드롭다운 (추후)

---

### 3. Sidebar 컴포넌트

#### 3.1 Sidebar CSS

```css
/* components/layout/sidebar/sidebar.css */

.sidebar {
  position: sticky;
  top: 4rem; /* header 높이 */
  height: calc(100vh - 4rem);
  width: 15rem; /* 240px */
  padding: 1rem;
  border-right: 1px solid rgb(var(--border));
  background-color: rgb(var(--background));
  overflow-y: auto;
  flex-shrink: 0;
}

/* 네비게이션 그룹 */
.sidebar__group {
  margin-bottom: 1.5rem;
}

.sidebar__group-title {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--muted-foreground));
}

/* 네비게이션 아이템 */
.sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--muted-foreground));
  border-radius: 0.5rem;
  transition: all 150ms ease-out;
  cursor: pointer;
}

.sidebar__item:hover {
  color: rgb(var(--foreground));
  background-color: rgb(var(--accent));
}

.sidebar__item--active {
  color: rgb(var(--primary));
  background-color: rgb(var(--accent));
}

.sidebar__item-icon {
  flex-shrink: 0;
}

.sidebar__item-label {
  flex: 1;
}

.sidebar__item-badge {
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  background-color: rgb(var(--primary));
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 구분선 */
.sidebar__divider {
  height: 1px;
  margin: 1rem 0;
  background-color: rgb(var(--border));
}

/* 태블릿 (접힌 상태) */
@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar {
    width: 4rem; /* 64px */
    padding: 0.75rem;
  }

  .sidebar__group-title,
  .sidebar__item-label {
    display: none;
  }

  .sidebar__item {
    justify-content: center;
    padding: 0.75rem;
  }

  .sidebar__item-badge {
    position: absolute;
    top: 0;
    right: 0;
  }

  .sidebar__item {
    position: relative;
  }
}

/* 모바일 (숨김) */
@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}
```

#### 3.2 Sidebar 컴포넌트

```typescript
// components/layout/sidebar/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, MessageCircle, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import './sidebar.css';

const mainNavItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/board', label: '게시판', icon: FileText },
  { href: '/chat', label: '채팅', icon: MessageCircle, badge: 3 },
  { href: '/friends', label: '친구', icon: Users, badge: 2 },
];

const bottomNavItems = [
  { href: '/settings', label: '설정', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* 메인 네비게이션 */}
      <nav className="sidebar__group">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar__item',
                isActive && 'sidebar__item--active'
              )}
            >
              <Icon className="sidebar__item-icon h-5 w-5" />
              <span className="sidebar__item-label">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="sidebar__item-badge">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar__divider" />

      {/* 하단 네비게이션 */}
      <nav className="sidebar__group">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar__item',
                isActive && 'sidebar__item--active'
              )}
            >
              <Icon className="sidebar__item-icon h-5 w-5" />
              <span className="sidebar__item-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] sidebar.css 파일 생성
- [ ] sidebar.tsx 파일 생성
- [ ] 네비게이션 아이템
- [ ] 배지 표시
- [ ] 태블릿 접힘 상태

---

### 4. Bottom Tab Bar (Mobile)

#### 4.1 BottomTabBar CSS

```css
/* components/layout/bottom-tab-bar/bottom-tab-bar.css */

.bottom-tab-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  height: 4rem; /* 64px */
  background-color: rgb(var(--background));
  border-top: 1px solid rgb(var(--border));
  padding-bottom: env(safe-area-inset-bottom);
}

@media (max-width: 767px) {
  .bottom-tab-bar {
    display: flex;
  }
}

.bottom-tab-bar__nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

.bottom-tab-bar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex: 1;
  height: 100%;
  padding: 0.5rem;
  color: rgb(var(--muted-foreground));
  transition: color 150ms ease-out;
  position: relative;
}

.bottom-tab-bar__item:active {
  transform: scale(0.95);
}

.bottom-tab-bar__item--active {
  color: rgb(var(--primary));
}

.bottom-tab-bar__icon {
  position: relative;
}

.bottom-tab-bar__label {
  font-size: 0.625rem;
  font-weight: 500;
}

.bottom-tab-bar__badge {
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 1rem;
  height: 1rem;
  padding: 0 0.25rem;
  font-size: 0.5rem;
  font-weight: 600;
  color: white;
  background-color: rgb(239 68 68);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 4.2 BottomTabBar 컴포넌트

```typescript
// components/layout/bottom-tab-bar/bottom-tab-bar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, MessageCircle, Users, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import './bottom-tab-bar.css';

const tabItems = [
  { href: '/', label: '홈', icon: Home },
  { href: '/board', label: '게시판', icon: FileText },
  { href: '/chat', label: '채팅', icon: MessageCircle, badge: 3 },
  { href: '/friends', label: '친구', icon: Users },
  { href: '/more', label: '더보기', icon: MoreHorizontal },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <div className="bottom-tab-bar">
      <nav className="bottom-tab-bar__nav">
        {tabItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'bottom-tab-bar__item',
                isActive && 'bottom-tab-bar__item--active'
              )}
            >
              <div className="bottom-tab-bar__icon">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="bottom-tab-bar__badge">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="bottom-tab-bar__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
```

- [ ] bottom-tab-bar.css 파일 생성
- [ ] bottom-tab-bar.tsx 파일 생성
- [ ] safe-area-inset 적용
- [ ] 배지 표시

---

### 5. Main Layout (메인 페이지 레이아웃)

#### 5.1 MainLayout CSS

```css
/* components/layout/main-layout/main-layout.css */

.main-layout {
  display: flex;
  min-height: calc(100vh - 4rem); /* header 높이 제외 */
}

.main-layout__content {
  flex: 1;
  min-width: 0;
  padding: 1.5rem;
}

/* 모바일 여백 조정 */
@media (max-width: 767px) {
  .main-layout {
    min-height: calc(100vh - 3.5rem - 4rem); /* header + bottom tab */
  }

  .main-layout__content {
    padding: 1rem;
    padding-bottom: 5rem; /* bottom tab 높이 + 여백 */
  }
}
```

#### 5.2 MainLayout 컴포넌트

```typescript
// components/layout/main-layout/main-layout.tsx
'use client';

import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomTabBar } from '@/components/layout/bottom-tab-bar';
import './main-layout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="main-layout__content">
          {children}
        </main>
      </div>
      <BottomTabBar />
    </>
  );
}
```

- [ ] main-layout.css 파일 생성
- [ ] main-layout.tsx 파일 생성

---

### 6. Auth Layout (인증 페이지 레이아웃)

#### 6.1 AuthLayout CSS

```css
/* components/layout/auth-layout/auth-layout.css */

.auth-layout {
  display: flex;
  min-height: 100vh;
}

/* 왼쪽 브랜딩 영역 */
.auth-layout__brand {
  display: none;
  flex: 1;
  background: linear-gradient(135deg, rgb(59 130 246) 0%, rgb(29 78 216) 100%);
  padding: 3rem;
  color: white;
}

@media (min-width: 1024px) {
  .auth-layout__brand {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.auth-layout__brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.auth-layout__brand-description {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 400px;
  line-height: 1.6;
}

/* 오른쪽 폼 영역 */
.auth-layout__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: rgb(var(--background));
}

.auth-layout__form-container {
  width: 100%;
  max-width: 400px;
}

/* 모바일 */
@media (max-width: 767px) {
  .auth-layout__content {
    padding: 1.5rem;
  }
}
```

#### 6.2 AuthLayout 컴포넌트

```typescript
// components/layout/auth-layout/auth-layout.tsx
'use client';

import './auth-layout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {/* 브랜딩 영역 (Desktop) */}
      <div className="auth-layout__brand">
        <h1 className="auth-layout__brand-title">감성 커뮤니티</h1>
        <p className="auth-layout__brand-description">
          AI 기반 감정분석으로 건강한 소통 문화를 만들어가는 커뮤니티에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 폼 영역 */}
      <div className="auth-layout__content">
        <div className="auth-layout__form-container">
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] auth-layout.css 파일 생성
- [ ] auth-layout.tsx 파일 생성

---

## 📁 생성되는 파일 목록

```
cc/src/
├── app/
│   └── layout.tsx                    (수정)
├── components/
│   └── layout/
│       ├── header/
│       │   ├── header.tsx
│       │   ├── header.css
│       │   └── index.ts
│       ├── sidebar/
│       │   ├── sidebar.tsx
│       │   ├── sidebar.css
│       │   └── index.ts
│       ├── bottom-tab-bar/
│       │   ├── bottom-tab-bar.tsx
│       │   ├── bottom-tab-bar.css
│       │   └── index.ts
│       ├── main-layout/
│       │   ├── main-layout.tsx
│       │   ├── main-layout.css
│       │   └── index.ts
│       ├── auth-layout/
│       │   ├── auth-layout.tsx
│       │   ├── auth-layout.css
│       │   └── index.ts
│       └── index.ts                  (배럴 파일)
```

---

## ✅ 완료 조건

- [ ] RootLayout 설정 완료
- [ ] Header 컴포넌트 완료
- [ ] Sidebar 컴포넌트 완료
- [ ] BottomTabBar 컴포넌트 완료
- [ ] MainLayout 컴포넌트 완료
- [ ] AuthLayout 컴포넌트 완료
- [ ] 반응형 레이아웃 동작 확인 (Desktop/Tablet/Mobile)
- [ ] 프로젝트 빌드 성공 (`npm run build`)

---

**이전 단계**: [Phase 2: 공통 컴포넌트 개발](./02-common-components/)

**다음 단계**: [Phase 4: 인증 화면 개발](./04-auth-pages.md)
