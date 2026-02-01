// types/report.ts

export type ReportTargetType = 'post' | 'comment' | 'reply' | 'chat_room' | 'chat_message' | 'user';

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'violence'
  | 'sexual_content'
  | 'misinformation'
  | 'impersonation'
  | 'copyright'
  | 'other';

export interface ReportReasonOption {
  value: ReportReason;
  label: string;
  description: string;
}

export const REPORT_REASONS: ReportReasonOption[] = [
  {
    value: 'spam',
    label: '스팸',
    description: '광고, 도배, 무의미한 콘텐츠',
  },
  {
    value: 'harassment',
    label: '괴롭힘 또는 따돌림',
    description: '특정 사용자를 대상으로 한 악의적 행동',
  },
  {
    value: 'hate_speech',
    label: '혐오 발언',
    description: '인종, 성별, 종교 등에 대한 혐오 표현',
  },
  {
    value: 'violence',
    label: '폭력적인 콘텐츠',
    description: '폭력을 조장하거나 묘사하는 콘텐츠',
  },
  {
    value: 'sexual_content',
    label: '성적인 콘텐츠',
    description: '부적절한 성적 콘텐츠',
  },
  {
    value: 'misinformation',
    label: '허위 정보',
    description: '거짓 또는 오해의 소지가 있는 정보',
  },
  {
    value: 'impersonation',
    label: '사칭',
    description: '타인을 사칭하거나 허위 신원 사용',
  },
  {
    value: 'copyright',
    label: '저작권 침해',
    description: '무단 저작권 사용',
  },
  {
    value: 'other',
    label: '기타',
    description: '위 항목에 해당하지 않는 신고 사유',
  },
];

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
