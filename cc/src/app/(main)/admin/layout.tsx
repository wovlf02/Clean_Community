'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Flag,
  Settings,
  Shield,
  BarChart3,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '신고 관리',
    href: '/admin/reports',
    icon: Flag,
    badge: 12,
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: '게시글 관리',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    title: '채팅 관리',
    href: '/admin/chats',
    icon: MessageSquare,
  },
  {
    title: '통계',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: '설정',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="admin-wrapper">
      {/* 관리자 사이드바 */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <Shield className="h-6 w-6" />
            <span>관리자</span>
          </div>
          <Button variant="ghost" size="icon" asChild className="admin-sidebar__back">
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <nav className="admin-sidebar__nav">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'admin-sidebar__nav-item',
                  isActive && 'admin-sidebar__nav-item--active'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
                {item.badge && (
                  <span className="admin-sidebar__badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <p className="admin-sidebar__version">v1.0.0</p>
        </div>
      </aside>

      {/* 콘텐츠 영역 */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
