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

export type SentimentLabel = 'safe' | 'warning' | 'danger';

/**
 * 분석 결과에서 감정 라벨 추출
 */
export function getSentimentLabel(result: SentimentResult): SentimentLabel {
  if (!result.isHarmful) return 'safe';
  if (result.confidence > 0.8) return 'danger';
  return 'warning';
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
};

/**
 * AI 서버 응답 카테고리를 한글로 변환
 */
export function translateCategory(category: string): string {
  return categoryLabels[category] || category;
}
