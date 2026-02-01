'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/layout/auth-layout';
import { StepBasicInfo } from './steps/step-basic-info';
import { StepEmailVerify } from './steps/step-email-verify';
import { StepProfile } from './steps/step-profile';
import { StepTerms } from './steps/step-terms';
import './register.css';

type RegisterStep = 'basic' | 'verify' | 'profile' | 'terms';

interface RegisterData {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  nickname?: string;
  name?: string;
  bio?: string;
}

const stepLabels: Record<RegisterStep, string> = {
  basic: '기본 정보',
  verify: '이메일 인증',
  profile: '프로필',
  terms: '약관 동의',
};

const steps: RegisterStep[] = ['basic', 'verify', 'profile', 'terms'];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<RegisterStep>('basic');
  const [formData, setFormData] = useState<RegisterData>({});

  const currentStepIndex = steps.indexOf(currentStep);

  const goToNextStep = (data: Partial<RegisterData>) => {
    setFormData({ ...formData, ...data });
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  return (
    <AuthLayout>
      <div className="register-page">
        {/* 스텝 인디케이터 */}
        <div className="register-page__steps">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`register-page__step ${
                index <= currentStepIndex ? 'register-page__step--active' : ''
              }`}
            >
              <div className="register-page__step-number">{index + 1}</div>
              <span className="register-page__step-label">{stepLabels[step]}</span>
            </div>
          ))}
        </div>

        {/* 스텝 컨텐츠 */}
        {currentStep === 'basic' && (
          <StepBasicInfo onNext={goToNextStep} defaultValues={formData} />
        )}
        {currentStep === 'verify' && (
          <StepEmailVerify
            email={formData.email || ''}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}
        {currentStep === 'profile' && (
          <StepProfile
            onNext={goToNextStep}
            onBack={goToPrevStep}
            defaultValues={formData}
          />
        )}
        {currentStep === 'terms' && (
          <StepTerms formData={formData} onBack={goToPrevStep} />
        )}

        {/* 로그인 링크 */}
        <p className="register-page__login">
          이미 계정이 있으신가요? <Link href="/login">로그인</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
