'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/dashboard/hero-section';
import { LandingSidebar } from '@/components/layout/landing-sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './globals.css';
import './landing.css';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* 토글 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="landing-page__menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="메뉴"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* 사이드바 */}
      <LandingSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 메인 콘텐츠 */}
      <main className={`landing-page__content ${sidebarOpen ? 'landing-page__content--shifted' : ''}`}>
        <HeroSection />
      </main>

      {/* 오버레이 */}
      {sidebarOpen && (
        <div
          className="landing-page__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
