'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, MessageCircle, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import './sidebar.css';

const mainNavItems = [
  { href: '/dashboard', label: '홈', icon: Home },
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

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

      {/* 스페이서 - 하단 네비게이션을 아래로 밀어냄 */}
      <div className="sidebar__spacer" />

      <div className="sidebar__divider" />

      {/* 하단 네비게이션 */}
      <nav className="sidebar__group">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

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
