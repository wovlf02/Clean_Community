'use client';

import { useState } from 'react';
import { Save, Bell, Shield, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showToast } from '@/lib/toast';
import '../admin.css';
import './settings.css';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // 일반 설정
    siteName: 'CoUp',
    siteDescription: '스터디 협업 플랫폼',

    // 알림 설정
    enableEmailNotifications: true,
    enablePushNotifications: true,
    notifyOnNewReport: true,
    notifyOnNewUser: false,

    // 콘텐츠 설정
    autoModeration: true,
    requireApproval: false,
    maxPostLength: 10000,
    maxCommentLength: 1000,

    // 보안 설정
    enableCaptcha: true,
    maxLoginAttempts: 5,
    sessionTimeout: 60,

    // 커뮤니티 가이드라인
    communityGuidelines: `1. 서로를 존중해주세요.
2. 욕설, 비방, 혐오 표현을 삼가해주세요.
3. 스팸이나 광고성 게시글은 금지됩니다.
4. 개인정보 보호에 유의해주세요.
5. 건전한 토론 문화를 만들어주세요.`,
  });

  const handleSave = () => {
    showToast.success('저장 완료', '설정이 저장되었습니다.');
  };

  const handleChange = (key: string, value: boolean | string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="admin-settings">
      {/* 헤더 */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">설정</h1>
          <p className="admin-page__description">
            서비스 설정을 관리하세요
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <div className="admin-settings__grid">
        {/* 일반 설정 */}
        <div className="admin-settings__section">
          <div className="admin-settings__section-header">
            <FileText className="h-5 w-5" />
            <h3>일반 설정</h3>
          </div>
          <div className="admin-settings__section-content">
            <div className="admin-settings__field">
              <Label htmlFor="siteName">사이트 이름</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
              />
            </div>
            <div className="admin-settings__field">
              <Label htmlFor="siteDescription">사이트 설명</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="admin-settings__section">
          <div className="admin-settings__section-header">
            <Bell className="h-5 w-5" />
            <h3>알림 설정</h3>
          </div>
          <div className="admin-settings__section-content">
            <div className="admin-settings__toggle">
              <div className="admin-settings__toggle-info">
                <Label>이메일 알림</Label>
                <p>중요한 알림을 이메일로 발송합니다.</p>
              </div>
              <ToggleSwitch
                checked={settings.enableEmailNotifications}
                onCheckedChange={(checked) => handleChange('enableEmailNotifications', checked)}
                size="lg"
              />
            </div>
            <div className="admin-settings__toggle">
              <div className="admin-settings__toggle-info">
                <Label>푸시 알림</Label>
                <p>브라우저 푸시 알림을 활성화합니다.</p>
              </div>
              <ToggleSwitch
                checked={settings.enablePushNotifications}
                onCheckedChange={(checked) => handleChange('enablePushNotifications', checked)}
                size="lg"
              />
            </div>
            <div className="admin-settings__toggle">
              <div className="admin-settings__toggle-info">
                <Label>신고 알림</Label>
                <p>새로운 신고가 접수되면 알림을 받습니다.</p>
              </div>
              <ToggleSwitch
                checked={settings.notifyOnNewReport}
                onCheckedChange={(checked) => handleChange('notifyOnNewReport', checked)}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* 콘텐츠 설정 */}
        <div className="admin-settings__section">
          <div className="admin-settings__section-header">
            <MessageSquare className="h-5 w-5" />
            <h3>콘텐츠 설정</h3>
          </div>
          <div className="admin-settings__section-content">
            <div className="admin-settings__toggle">
              <div className="admin-settings__toggle-info">
                <Label>자동 검토</Label>
                <p>AI를 통해 부적절한 콘텐츠를 자동으로 검토합니다.</p>
              </div>
              <ToggleSwitch
                checked={settings.autoModeration}
                onCheckedChange={(checked) => handleChange('autoModeration', checked)}
                size="lg"
              />
            </div>
            <div className="admin-settings__toggle">
              <div className="admin-settings__toggle-info">
                <Label>게시 전 승인</Label>
                <p>모든 게시글은 관리자 승인 후 게시됩니다.</p>
              </div>
              <ToggleSwitch
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleChange('requireApproval', checked)}
                size="lg"
              />
            </div>
            <div className="admin-settings__field">
              <Label htmlFor="maxPostLength">게시글 최대 글자 수</Label>
              <Input
                id="maxPostLength"
                type="number"
                value={settings.maxPostLength}
                onChange={(e) => handleChange('maxPostLength', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* 보안 설정 */}
        <div className="admin-settings__section">
          <div className="admin-settings__section-header">
            <Shield className="h-5 w-5" />
            <h3>보안 설정</h3>
          </div>
          <div className="admin-settings__section-content">
            <div className="admin-settings__toggle">
              <div className="admin-settings__toggle-info">
                <Label>CAPTCHA 활성화</Label>
                <p>로그인 및 회원가입 시 CAPTCHA를 사용합니다.</p>
              </div>
              <ToggleSwitch
                checked={settings.enableCaptcha}
                onCheckedChange={(checked) => handleChange('enableCaptcha', checked)}
                size="lg"
              />
            </div>
            <div className="admin-settings__field">
              <Label htmlFor="maxLoginAttempts">최대 로그인 시도 횟수</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
              />
            </div>
            <div className="admin-settings__field">
              <Label htmlFor="sessionTimeout">세션 타임아웃 (분)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 커뮤니티 가이드라인 */}
      <div className="admin-settings__section admin-settings__section--full">
        <div className="admin-settings__section-header">
          <FileText className="h-5 w-5" />
          <h3>커뮤니티 가이드라인</h3>
        </div>
        <div className="admin-settings__section-content">
          <Textarea
            value={settings.communityGuidelines}
            onChange={(e) => handleChange('communityGuidelines', e.target.value)}
            rows={8}
            className="admin-settings__guidelines"
          />
        </div>
      </div>
    </div>
  );
}
