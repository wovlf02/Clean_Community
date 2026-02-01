'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/common/form-field';
import { showToast } from '@/lib/toast';

interface StepEmailVerifyProps {
  email: string;
  onNext: (data: object) => void;
  onBack: () => void;
}

export function StepEmailVerify({ email, onNext, onBack }: StepEmailVerifyProps) {
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3분
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    setCountdown(180);
    showToast.success('인증번호 재발송', '인증번호가 다시 발송되었습니다.');
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      setError('인증번호 6자리를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    // Mock 인증 (1초 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 123456을 유효한 인증번호로 가정
    if (verifyCode === '123456') {
      showToast.success('인증 완료', '이메일 인증이 완료되었습니다.');
      onNext({});
    } else {
      setError('인증번호가 일치하지 않습니다');
    }

    setIsLoading(false);
  };

  return (
    <div className="register-step">
      <div className="register-page__header">
        <h1 className="register-page__title">이메일 인증</h1>
        <p className="register-page__subtitle">
          {email}로 발송된 인증번호를 입력해주세요
        </p>
      </div>

      <div className="register-step__form">
        <FormField
          label="인증번호"
          error={error}
          description={`남은 시간: ${formatTime(countdown)}`}
          required
        >
          <div className="register-step__verify-code">
            <Input
              className="register-step__verify-input"
              type="text"
              placeholder="인증번호 6자리"
              maxLength={6}
              value={verifyCode}
              onChange={(e) =>
                setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))
              }
              error={!!error}
            />
          </div>
        </FormField>

        <p className="register-step__resend">
          인증번호를 받지 못하셨나요?{' '}
          <button
            type="button"
            className="register-step__resend-btn"
            onClick={handleResend}
            disabled={countdown > 170}
          >
            재발송
          </button>
        </p>

        <div className="register-step__actions">
          <Button type="button" variant="outline" onClick={onBack}>
            이전
          </Button>
          <Button
            type="button"
            onClick={handleVerify}
            isLoading={isLoading}
            disabled={countdown === 0}
          >
            인증 확인
          </Button>
        </div>
      </div>
    </div>
  );
}
