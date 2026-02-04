'use client';

import { SentimentLabel, SafetyScore, calculateSafetyScore } from '@/types/sentiment';
import { cn } from '@/lib/utils';
import './sentiment-badge.css';

interface SentimentBadgeProps {
  /** 직접 라벨 지정 (레거시 호환) */
  label?: SentimentLabel;
  /** 예측 점수들로부터 자동 계산 */
  predictions?: Record<string, number>;
  /** 점수 표시 여부 */
  showScore?: boolean;
  /** 텍스트 표시 여부 */
  showText?: boolean;
  /** 컴팩트 모드 (아이콘만 또는 작은 크기) */
  compact?: boolean;
  /** 사이즈: sm, md, lg */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 클래스명 */
  className?: string;
}

const labelConfig: Record<SentimentLabel, { emoji: string; text: string }> = {
  safe: { emoji: '😊', text: '매우 좋음' },
  caution: { emoji: '😐', text: '보통' },
  warning: { emoji: '😟', text: '주의 필요' },
  danger: { emoji: '😠', text: '위험' },
};

export function SentimentBadge({
  label,
  predictions,
  showScore = false,
  showText = true,
  compact = false,
  size = 'sm',
  className,
}: SentimentBadgeProps) {
  // predictions에서 SafetyScore 계산하거나 label에서 기본값 생성
  const safetyScore: SafetyScore = predictions
    ? calculateSafetyScore(predictions)
    : {
        score: label === 'safe' ? 100 : label === 'caution' ? 65 : label === 'warning' ? 35 : 10,
        label: label || 'safe',
        emoji: labelConfig[label || 'safe'].emoji,
        text: labelConfig[label || 'safe'].text,
        color: label || 'safe',
      };

  return (
    <span
      className={cn(
        'sentiment-badge',
        `sentiment-badge--${safetyScore.label}`,
        `sentiment-badge--${size}`,
        compact && 'sentiment-badge--compact',
        className
      )}
      title={`안전 점수: ${safetyScore.score}/100`}
    >
      <span className="sentiment-badge__icon">{safetyScore.emoji}</span>
      {showScore && <span className="sentiment-badge__score">{safetyScore.score}</span>}
      {showText && !compact && <span className="sentiment-badge__text">{safetyScore.text}</span>}
    </span>
  );
}
