'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/auth-store';
import { showToast } from '@/lib/toast';

interface RegisterData {
  email?: string;
  password?: string;
  nickname?: string;
  name?: string;
  bio?: string;
}

interface StepTermsProps {
  formData: RegisterData;
  onBack: () => void;
}

interface TermItem {
  id: string;
  label: string;
  required: boolean;
}

const terms: TermItem[] = [
  { id: 'service', label: '서비스 이용약관 동의', required: true },
  { id: 'privacy', label: '개인정보 처리방침 동의', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
];

export function StepTerms({ formData, onBack }: StepTermsProps) {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});

  const allRequiredAgreed = terms
    .filter((t) => t.required)
    .every((t) => agreed[t.id]);

  const allAgreed = terms.every((t) => agreed[t.id]);

  const handleToggle = (id: string, checked: boolean) => {
    setAgreed((prev) => ({ ...prev, [id]: checked }));
  };

  const handleToggleAll = (checked: boolean) => {
    const newAgreed: Record<string, boolean> = {};
    terms.forEach((t) => {
      newAgreed[t.id] = checked;
    });
    setAgreed(newAgreed);
  };

  const handleSubmit = async () => {
    if (!allRequiredAgreed) {
      showToast.error('필수 약관 동의', '필수 약관에 모두 동의해주세요.');
      return;
    }

    const success = await registerUser({
      email: formData.email || '',
      password: formData.password || '',
      nickname: formData.nickname || '',
      name: formData.name || '',
    });

    if (success) {
      showToast.success('회원가입 완료', '감성 커뮤니티에 오신 것을 환영합니다!');
      router.push('/');
    } else {
      showToast.error('회원가입 실패', '다시 시도해주세요.');
    }
  };

  return (
    <div className="register-step">
      <div className="register-page__header">
        <h1 className="register-page__title">약관 동의</h1>
        <p className="register-page__subtitle">서비스 이용을 위한 약관에 동의해주세요</p>
      </div>

      <div className="register-step__terms">
        {/* 전체 동의 */}
        <label className="register-step__all-agree">
          <Checkbox
            checked={allAgreed}
            onCheckedChange={(checked) => handleToggleAll(!!checked)}
          />
          <span>전체 동의</span>
        </label>

        {/* 개별 약관 */}
        {terms.map((term) => (
          <div
            key={term.id}
            className={`register-step__term-item ${
              term.required ? 'register-step__term-item--required' : ''
            }`}
          >
            <Checkbox
              checked={agreed[term.id] || false}
              onCheckedChange={(checked) => handleToggle(term.id, !!checked)}
            />
            <span className="register-step__term-label">
              {term.label}
              {term.required && (
                <span className="register-step__term-required">*</span>
              )}
            </span>
            <button type="button" className="register-step__term-view">
              보기
            </button>
          </div>
        ))}
      </div>

      <div className="register-step__actions">
        <Button type="button" variant="outline" onClick={onBack}>
          이전
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!allRequiredAgreed}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
}
