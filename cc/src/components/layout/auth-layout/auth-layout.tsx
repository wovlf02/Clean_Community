'use client';

import Image from 'next/image';
import Link from 'next/link';
import './auth-layout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {/* 브랜딩 영역 (Desktop) */}
      <div className="auth-layout__brand">
        <Link href="/" className="auth-layout__logo">
          <Image
            src="/logo.png"
            alt="감성 커뮤니티"
            width={64}
            height={64}
            className="auth-layout__logo-image"
          />
        </Link>
        <h1 className="auth-layout__brand-title">감성 커뮤니티</h1>
        <p className="auth-layout__brand-description">
          AI 기반 감정분석으로 건강한 소통 문화를 만들어가는 커뮤니티에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 폼 영역 */}
      <div className="auth-layout__content">
        <div className="auth-layout__form-container">
          {/* 모바일용 로고 */}
          <Link href="/" className="auth-layout__mobile-logo">
            <Image
              src="/logo.png"
              alt="감성 커뮤니티"
              width={48}
              height={48}
              className="auth-layout__logo-image"
            />
            <span>감성 커뮤니티</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
