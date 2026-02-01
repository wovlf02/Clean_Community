'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button/button';
import { AlertTriangle } from 'lucide-react';
import './sentiment-warning-modal.css';

interface SentimentWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onEdit: () => void;
  onProceed: () => void;
  isLoading?: boolean;
}

export function SentimentWarningModal({
  open,
  onOpenChange,
  categories,
  onEdit,
  onProceed,
  isLoading,
}: SentimentWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal-content sm:max-w-md">
        <DialogHeader className="modal-header">
          <div className="modal-header__icon modal-header__icon--warning">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="modal-header__title">
            유해 표현 감지
          </DialogTitle>
          <DialogDescription className="modal-header__description">
            작성하신 내용에서 아래 카테고리의 유해 표현이 감지되었습니다.
          </DialogDescription>
        </DialogHeader>

        <div
          className="sentiment-modal__categories"
          role="list"
          aria-label="감지된 유해 표현 카테고리"
        >
          {categories.map((category) => (
            <span
              key={category}
              className="sentiment-modal__category"
              role="listitem"
            >
              {category}
            </span>
          ))}
        </div>

        <DialogFooter className="modal-footer">
          <Button variant="outline" onClick={onEdit} className="w-full sm:w-auto">
            수정하기
          </Button>
          <Button
            variant="secondary"
            onClick={onProceed}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            그대로 등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
