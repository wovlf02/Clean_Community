'use client';

import { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { REPORT_REASONS, type ReportReason, type ReportTargetType } from '@/types/report';
import { showToast } from '@/lib/toast';
import './report-modal.css';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel?: string;
}

const TARGET_LABELS: Record<ReportTargetType, string> = {
  post: '게시글',
  comment: '댓글',
  reply: '답글',
  chat_room: '채팅방',
  chat_message: '메시지',
  user: '사용자',
};

export function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetLabel,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      showToast.error('신고 실패', '신고 사유를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast.success(
        '신고 완료',
        `${TARGET_LABELS[targetType]}이(가) 신고되었습니다. 검토 후 조치하겠습니다.`
      );

      handleClose();
    } catch (error) {
      showToast.error('오류', '신고 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="report-modal">
        <DialogHeader className="report-modal__header">
          <div className="report-modal__icon">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="report-modal__title">
            {TARGET_LABELS[targetType]} 신고하기
          </DialogTitle>
          <DialogDescription className="report-modal__description">
            {targetLabel
              ? `"${targetLabel}"을(를) 신고합니다.`
              : '부적절한 콘텐츠를 신고해주세요.'}
            <br />
            허위 신고 시 제재를 받을 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="report-modal__content">
          {/* 신고 사유 선택 */}
          <div className="report-modal__section">
            <h4 className="report-modal__section-title">
              신고 사유 <span className="report-modal__required">*</span>
            </h4>
            <RadioGroup
              value={selectedReason || ''}
              onValueChange={(value) => setSelectedReason(value as ReportReason)}
              className="report-modal__reasons"
            >
              {REPORT_REASONS.map((reason) => (
                <div key={reason.value} className="report-modal__reason-item">
                  <RadioGroupItem
                    value={reason.value}
                    id={`reason-${reason.value}`}
                    className="report-modal__reason-radio"
                  />
                  <Label
                    htmlFor={`reason-${reason.value}`}
                    className="report-modal__reason-label"
                  >
                    <span className="report-modal__reason-name">{reason.label}</span>
                    <span className="report-modal__reason-desc">{reason.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 상세 설명 (선택) */}
          <div className="report-modal__section">
            <h4 className="report-modal__section-title">
              상세 설명 <span className="report-modal__optional">(선택)</span>
            </h4>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="추가로 설명하고 싶은 내용이 있다면 작성해주세요..."
              className="report-modal__textarea"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="report-modal__footer">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="report-modal__cancel-btn"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="report-modal__submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="report-modal__spinner" />
                처리 중...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                신고하기
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
