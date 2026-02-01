'use client';

import Link from 'next/link';
import {
  PenSquare,
  MessageCircle,
  Users,
  Settings,
  BookOpen,
  Bell,
  HelpCircle,
  Bookmark,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import './quick-actions.css';

const actions = [
  {
    icon: PenSquare,
    label: '글 작성',
    description: '새 게시글 작성',
    href: '/board/write',
    color: 'hsl(217, 91%, 60%)',
    bgColor: 'hsl(217, 91%, 60%, 0.1)',
  },
  {
    icon: MessageCircle,
    label: '채팅',
    description: '친구와 대화',
    href: '/chat',
    color: 'hsl(142, 76%, 36%)',
    bgColor: 'hsl(142, 76%, 36%, 0.1)',
  },
  {
    icon: Users,
    label: '친구',
    description: '친구 목록 보기',
    href: '/friends',
    color: 'hsl(262, 83%, 58%)',
    bgColor: 'hsl(262, 83%, 58%, 0.1)',
  },
  {
    icon: BookOpen,
    label: '게시판',
    description: '게시글 둘러보기',
    href: '/board',
    color: 'hsl(37, 91%, 55%)',
    bgColor: 'hsl(37, 91%, 55%, 0.1)',
  },
  {
    icon: Bookmark,
    label: '북마크',
    description: '저장한 게시글',
    href: '/board?filter=bookmarked',
    color: 'hsl(330, 81%, 60%)',
    bgColor: 'hsl(330, 81%, 60%, 0.1)',
  },
  {
    icon: Bell,
    label: '알림',
    description: '알림 확인',
    href: '/settings',
    color: 'hsl(0, 72%, 51%)',
    bgColor: 'hsl(0, 72%, 51%, 0.1)',
  },
  {
    icon: Settings,
    label: '설정',
    description: '계정 설정',
    href: '/settings',
    color: 'hsl(0, 0%, 45%)',
    bgColor: 'hsl(0, 0%, 45%, 0.1)',
  },
  {
    icon: HelpCircle,
    label: '도움말',
    description: '이용 가이드',
    href: '/terms',
    color: 'hsl(192, 91%, 36%)',
    bgColor: 'hsl(192, 91%, 36%, 0.1)',
  },
];

export function QuickActions() {
  return (
    <Card className="quick-actions">
      <CardHeader>
        <CardTitle className="quick-actions__title">빠른 메뉴</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="quick-actions__grid">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="quick-actions__item"
            >
              <div
                className="quick-actions__icon"
                style={{ backgroundColor: action.bgColor, color: action.color }}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <div className="quick-actions__content">
                <span className="quick-actions__label">{action.label}</span>
                <span className="quick-actions__description">{action.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
