'use client';

import { useState, useCallback } from 'react';
import { SentimentResult } from '@/types/sentiment';

interface UseSentimentAnalysisOptions {
  onWarning?: (categories: string[]) => void;
  onError?: (error: Error) => void;
}

interface AnalyzeApiResponse {
  isHarmful: boolean;
  detectedCategories: string[];
  confidence: number;
  predictions: Record<string, number>;
}

export function useSentimentAnalysis(options?: UseSentimentAnalysisOptions) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(
    async (text: string): Promise<SentimentResult | null> => {
      if (!text.trim()) return null;

      setIsAnalyzing(true);
      setError(null);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error('분석 요청 실패');
        }

        const data: AnalyzeApiResponse = await response.json();

        const sentimentResult: SentimentResult = {
          text,
          isHarmful: data.isHarmful,
          detectedCategories: data.detectedCategories,
          confidence: data.confidence,
          predictions: {
            femaleFamily: data.predictions?.female_family || 0,
            male: data.predictions?.male || 0,
            lgbtq: data.predictions?.lgbtq || 0,
            raceNationality: data.predictions?.race_nationality || 0,
            age: data.predictions?.age || 0,
            region: data.predictions?.region || 0,
            religion: data.predictions?.religion || 0,
            otherHate: data.predictions?.other_hate || 0,
            insult: data.predictions?.insult || 0,
          },
        };

        setResult(sentimentResult);

        if (sentimentResult.isHarmful && options?.onWarning) {
          options.onWarning(sentimentResult.detectedCategories);
        }

        return sentimentResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('분석 중 오류 발생');
        setError(error);
        options?.onError?.(error);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    analyze,
    isAnalyzing,
    result,
    error,
    reset,
  };
}
