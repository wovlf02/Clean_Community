'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  Shield,
  FileText,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import './settings.css';

interface SettingsItem {
  href: string;
  label: string;
  icon: typeof User;
  danger?: boolean;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

const settingsGroups: SettingsGroup[] = [
  {
    title: '계정',
    items: [
      { href: '/profile', label: '프로필', icon: User },
      { href: '/settings/password', label: '비밀번호 변경', icon: Lock },
    ],
  },
  {
    title: '알림',
    items: [
      { href: '/settings/notifications', label: '알림 설정', icon: Bell },
    ],
  },
  {
    title: '정보',
    items: [
      { href: '/terms', label: '이용약관', icon: FileText },
      { href: '/privacy', label: '개인정보 처리방침', icon: Shield },
    ],
  },
  {
    title: '계정 관리',
    items: [
      {
        href: '/settings/delete-account',
        label: '계정 탈퇴',
        icon: Trash2,
        danger: true,
      },
    ],
  },
];

export default function SettingsPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">설정</h1>

      {/* 다크 모드 토글 */}
      <Card className="settings-page__section settings-page__theme-card">
        <CardContent className="settings-page__item settings-page__theme-item">
          <div className="settings-page__item-left">
            <div className="settings-page__theme-icon">
              {mounted && isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </div>
            <div className="settings-page__theme-info">
              <span className="settings-page__theme-label">
                {mounted && isDarkMode ? '다크 모드' : '라이트 모드'}
              </span>
              <span className="settings-page__theme-desc">
                {mounted && isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
              </span>
            </div>
          </div>
          <Switch
            checked={mounted && isDarkMode}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </CardContent>
      </Card>

      {/* 설정 그룹 */}
      {settingsGroups.map((group) => (
        <div key={group.title} className="settings-page__group">
          <h2 className="settings-page__group-title">{group.title}</h2>
          <Card>
            <CardContent className="settings-page__group-content">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`settings-page__link ${
                      item.danger ? 'settings-page__link--danger' : ''
                    }`}
                  >
                    <div className="settings-page__item-left">
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
