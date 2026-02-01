'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  RefreshCw,
  Home,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import './error.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [copied, setCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // 에러 로깅 (추후 Sentry 등 연동 가능)
    console.error('Application Error:', error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    // 약간의 딜레이를 주어 사용자에게 피드백 제공
    await new Promise((resolve) => setTimeout(resolve, 500));
    reset();
  };

  const handleCopyError = async () => {
    if (error.digest) {
      await navigator.clipboard.writeText(error.digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="error-page">
      {/* 애니메이션 아이콘 */}
      <div className="error-page__icon-container">
        <div className="error-page__icon-bg" />
        <div className="error-page__icon-bg error-page__icon-bg--delay" />
        <AlertCircle className="error-page__icon" />
      </div>

      {/* 콘텐츠 */}
      <div className="error-page__content">
        <h1 className="error-page__title">문제가 발생했습니다</h1>
        <p className="error-page__description">
          예상치 못한 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도하시거나, 문제가 계속되면 고객센터로 문의해주세요.
        </p>

        {error.digest && (
          <button
            onClick={handleCopyError}
            className="error-page__digest"
            title="클릭하여 오류 코드 복사"
          >
            {copied ? (
              <Check className="error-page__digest-icon" />
            ) : (
              <Copy className="error-page__digest-icon" />
            )}
            <span>오류 코드: {error.digest}</span>
          </button>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="error-page__actions">
        <Button onClick={handleRetry} disabled={isRetrying}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? '재시도 중...' : '다시 시도'}
        </Button>
        <Button variant="outline" asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            홈으로 이동
          </a>
        </Button>
      </div>

      {/* 도움말 섹션 */}
      <div className="error-page__help">
        <p className="error-page__help-title">도움이 필요하신가요?</p>
        <div className="error-page__help-links">
          <a href="/board" className="error-page__help-link">
            <MessageCircle className="error-page__help-link-icon" />
            게시판에서 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
