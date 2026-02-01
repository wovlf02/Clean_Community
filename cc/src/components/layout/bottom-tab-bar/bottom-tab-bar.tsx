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
