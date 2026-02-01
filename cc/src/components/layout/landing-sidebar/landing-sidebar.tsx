'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, FileText, MessageCircle, Users, LogIn, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './landing-sidebar.css';

const navItems = [
  { href: '/dashboard', label: '홈', icon: Home },
  { href: '/board', label: '게시판', icon: FileText },
  { href: '/chat', label: '채팅', icon: MessageCircle },
  { href: '/friends', label: '친구', icon: Users },
];

interface LandingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LandingSidebar({ isOpen, onClose }: LandingSidebarProps) {
  return (
    <>
      <aside className={cn('landing-sidebar', isOpen && 'landing-sidebar--open')}>
        {/* 헤더 */}
        <div className="landing-sidebar__header">
          <Link href="/" className="landing-sidebar__logo" onClick={onClose}>
            <div className="landing-sidebar__logo-icon">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span>감성 커뮤니티</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="landing-sidebar__close"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 네비게이션 */}
        <nav className="landing-sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="landing-sidebar__nav-item"
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 하단 액션 */}
        <div className="landing-sidebar__actions">
          <Button asChild className="landing-sidebar__action-primary">
            <Link href="/auth/login" onClick={onClose}>
              <LogIn className="mr-2 h-4 w-4" />
              로그인
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/register" onClick={onClose}>
              <UserPlus className="mr-2 h-4 w-4" />
              회원가입
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
}
