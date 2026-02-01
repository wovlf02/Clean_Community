'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button/button';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import './confirm-dialog.css';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  onConfirm: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const iconMap = {
  default: CheckCircle,
  destructive: Trash2,
  warning: AlertTriangle,
};

const iconClassMap = {
  default: 'modal-header__icon--success',
  destructive: 'modal-header__icon--danger',
  warning: 'modal-header__icon--warning',
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  onConfirm,
  isLoading,
  disabled,
}: ConfirmDialogProps) {
  const Icon = iconMap[variant];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="modal-content">
        <AlertDialogHeader className="modal-header">
          <div className={`modal-header__icon ${iconClassMap[variant]}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="modal-header__title">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="modal-header__description">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="modal-footer">
          <AlertDialogCancel asChild>
            <Button variant="outline">{cancelText}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={onConfirm}
              isLoading={isLoading}
              disabled={disabled || isLoading}
            >
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
