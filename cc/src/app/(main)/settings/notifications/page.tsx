'use client';

import { useState, useMemo } from 'react';
import {
  Bell,
  MessageCircle,
  Heart,
  UserPlus,
  AtSign,
  Mail,
  Smartphone,
  Globe,
  Info,
  Zap,
  Users,
  Volume2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/toast';
import './notifications.css';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  enabled: boolean;
  isNew?: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: typeof Bell;
  settings: NotificationSetting[];
}

const initialSettings: NotificationCategory[] = [
  {
    id: 'activity',
    title: '활동 알림',
    description: '내 활동과 관련된 알림을 받습니다',
    icon: Zap,
    settings: [
      {
        id: 'comments',
        label: '댓글',
        description: '내 게시글에 댓글이 달리면 알림',
        icon: MessageCircle,
        enabled: true,
      },
      {
        id: 'likes',
        label: '좋아요',
        description: '내 게시글이나 댓글에 좋아요가 달리면 알림',
        icon: Heart,
        enabled: true,
      },
      {
        id: 'mentions',
        label: '멘션',
        description: '다른 사용자가 나를 멘션하면 알림',
        icon: AtSign,
        enabled: true,
        isNew: true,
      },
    ],
  },
  {
    id: 'social',
    title: '소셜 알림',
    description: '친구 및 팔로우 관련 알림을 받습니다',
    icon: Users,
    settings: [
      {
        id: 'friend-requests',
        label: '친구 요청',
        description: '새로운 친구 요청이 오면 알림',
        icon: UserPlus,
        enabled: true,
      },
      {
        id: 'messages',
        label: '메시지',
        description: '새로운 채팅 메시지가 오면 알림',
        icon: MessageCircle,
        enabled: true,
      },
    ],
  },
  {
    id: 'channels',
    title: '알림 채널',
    description: '알림을 받을 방법을 선택합니다',
    icon: Volume2,
    settings: [
      {
        id: 'push',
        label: '푸시 알림',
        description: '브라우저 푸시 알림 받기',
        icon: Smartphone,
        enabled: true,
      },
      {
        id: 'email',
        label: '이메일',
        description: '이메일로 중요 알림 받기',
        icon: Mail,
        enabled: false,
      },
      {
        id: 'in-app',
        label: '인앱 알림',
        description: '앱 내에서 알림 표시',
        icon: Globe,
        enabled: true,
      },
    ],
  },
];

export default function NotificationsSettingsPage() {
  const [categories, setCategories] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // 통계 계산
  const stats = useMemo(() => {
    const allSettings = categories.flatMap(cat => cat.settings);
    const enabledCount = allSettings.filter(s => s.enabled).length;
    const totalCount = allSettings.length;
    return { enabledCount, totalCount, percentage: Math.round((enabledCount / totalCount) * 100) };
  }, [categories]);

  const handleToggle = (categoryId: string, settingId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          settings: cat.settings.map((setting) =>
            setting.id === settingId
              ? { ...setting, enabled: !setting.enabled }
              : setting
          ),
        };
      })
    );
    setHasChanges(true);
  };

  const handleToggleAll = (categoryId: string, enabled: boolean) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          settings: cat.settings.map((setting) => ({
            ...setting,
            enabled,
          })),
        };
      })
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Mock API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    showToast.success('저장 완료', '알림 설정이 저장되었습니다.');
  };

  const handleReset = () => {
    setCategories(initialSettings);
    setHasChanges(false);
    showToast.success('초기화 완료', '알림 설정이 기본값으로 초기화되었습니다.');
  };

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <div className="notifications-page__header-icon">
          <Bell className="h-6 w-6" />
        </div>
        <div className="notifications-page__header-content">
          <h1 className="notifications-page__title">알림 설정</h1>
          <p className="notifications-page__subtitle">
            어떤 알림을 받을지 선택하세요
          </p>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="notifications-page__summary">
        <div className="notifications-page__summary-card">
          <span className="notifications-page__summary-value">{stats.enabledCount}</span>
          <span className="notifications-page__summary-label">활성화된 알림</span>
        </div>
        <div className="notifications-page__summary-card">
          <span className="notifications-page__summary-value">{stats.totalCount}</span>
          <span className="notifications-page__summary-label">전체 알림</span>
        </div>
        <div className="notifications-page__summary-card">
          <span className="notifications-page__summary-value">{stats.percentage}%</span>
          <span className="notifications-page__summary-label">활성화 비율</span>
        </div>
      </div>

      <div className="notifications-page__content">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const allEnabled = category.settings.every((s) => s.enabled);
          const someEnabled = category.settings.some((s) => s.enabled);

          return (
            <Card key={category.id} className="notifications-page__card">
              <CardHeader className="notifications-page__card-header">
                <div className="notifications-page__card-title-row">
                  <div className="notifications-page__card-title-content">
                    <CardTitle className="notifications-page__card-title">
                      <CategoryIcon className="notifications-page__card-title-icon" />
                      {category.title}
                    </CardTitle>
                    <CardDescription className="notifications-page__card-desc">
                      {category.description}
                    </CardDescription>
                  </div>
                  <button
                    type="button"
                    className="notifications-page__toggle-all"
                    onClick={() => handleToggleAll(category.id, !allEnabled)}
                  >
                    {allEnabled ? '모두 끄기' : someEnabled ? '모두 켜기' : '모두 켜기'}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="notifications-page__card-content">
                {category.settings.map((setting) => {
                  const Icon = setting.icon;
                  return (
                    <div
                      key={setting.id}
                      className={`notifications-page__setting ${setting.enabled ? 'notifications-page__setting--enabled' : ''}`}
                      onClick={() => handleToggle(category.id, setting.id)}
                    >
                      <div className="notifications-page__setting-icon">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="notifications-page__setting-info">
                        <span className="notifications-page__setting-label">
                          {setting.label}
                          {setting.isNew && (
                            <span className="notifications-page__setting-badge notifications-page__setting-badge--new">
                              NEW
                            </span>
                          )}
                        </span>
                        <span className="notifications-page__setting-desc">
                          {setting.description}
                        </span>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() =>
                          handleToggle(category.id, setting.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="notifications-page__actions">
        <div className="notifications-page__actions-info">
          <Info className="h-4 w-4" />
          {hasChanges ? '변경사항이 있습니다' : '모든 변경사항이 저장됨'}
        </div>
        <div className="notifications-page__actions-buttons">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            기본값으로 초기화
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!hasChanges}
            className="notifications-page__save-btn"
          >
            변경사항 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
