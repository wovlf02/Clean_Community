/**
 * 감정분석 결과 타입
 */
export interface SentimentResult {
  text: string;
  isHarmful: boolean;
  detectedCategories: string[];
  confidence: number;
  predictions: {
    femaleFamily: number; // 여성/가족
    male: number; // 남성
    lgbtq: number; // 성소수자
    raceNationality: number; // 인종/국적
    age: number; // 연령
    region: number; // 지역
    religion: number; // 종교
    otherHate: number; // 기타 혐오
    insult: number; // 악플/욕설
  };
}

export type SentimentLabel = 'safe' | 'caution' | 'warning' | 'danger';

/**
 * 안전 점수 (0-100)
 * 100 = 완전히 안전, 0 = 매우 유해
 */
export interface SafetyScore {
  score: number; // 0-100
  label: SentimentLabel;
  emoji: string;
  text: string;
  color: string;
}

/**
 * 예측 점수들에서 안전 점수 계산
 * @param predictions 각 카테고리별 예측 확률 (0-1)
 * @returns 안전 점수 객체
 */
export function calculateSafetyScore(
  predictions: Record<string, number> | undefined
): SafetyScore {
  if (!predictions || Object.keys(predictions).length === 0) {
    return {
      score: 100,
      label: 'safe',
      emoji: '😊',
      text: '매우 좋음',
      color: 'safe',
    };
  }

  // 모든 예측 확률 중 최대값 추출
  const maxHarmfulScore = Math.max(...Object.values(predictions));

  // 안전 점수 = 100 - (최대 유해 확률 × 100)
  const safetyScore = Math.round((1 - maxHarmfulScore) * 100);

  // 점수 범위별 분류 (80-100: 안전, 50-79: 주의, 20-49: 경고, 0-19: 위험)
  if (safetyScore >= 80) {
    return {
      score: safetyScore,
      label: 'safe',
      emoji: '😊',
      text: '매우 좋음',
      color: 'safe',
    };
  } else if (safetyScore >= 50) {
    return {
      score: safetyScore,
      label: 'caution',
      emoji: '😐',
      text: '보통',
      color: 'caution',
    };
  } else if (safetyScore >= 20) {
    return {
      score: safetyScore,
      label: 'warning',
      emoji: '😟',
      text: '주의 필요',
      color: 'warning',
    };
  } else {
    return {
      score: safetyScore,
      label: 'danger',
      emoji: '😠',
      text: '위험',
      color: 'danger',
    };
  }
}

/**
 * 분석 결과에서 감정 라벨 추출 (레거시 호환)
 */
export function getSentimentLabel(result: SentimentResult): SentimentLabel {
  const safetyScore = calculateSafetyScore(result.predictions as unknown as Record<string, number>);
  return safetyScore.label;
}

/**
 * 카테고리 라벨 한글 매핑
 */
export const categoryLabels: Record<string, string> = {
  femaleFamily: '여성/가족',
  male: '남성',
  lgbtq: '성소수자',
  raceNationality: '인종/국적',
  age: '연령',
  region: '지역',
  religion: '종교',
  otherHate: '기타 혐오',
  insult: '악플/욕설',
  female_family: '여성/가족',
  race_nationality: '인종/국적',
  other_hate: '기타 혐오',
  '여성/가족': '여성/가족',
  '남성': '남성',
  '성소수자': '성소수자',
  '인종/국적': '인종/국적',
  '연령': '연령',
  '지역': '지역',
  '종교': '종교',
  '기타 혐오': '기타 혐오',
  '악플/욕설': '악플/욕설',
};

/**
 * AI 서버 응답 카테고리를 한글로 변환
 */
export function translateCategory(category: string): string {
  return categoryLabels[category] || category;
}
