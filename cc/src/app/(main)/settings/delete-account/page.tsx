'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/common/form-field';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { showToast } from '@/lib/toast';
import './delete-account.css';

const CONFIRM_CODE = '계정 삭제';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = password.length > 0 && confirmText === CONFIRM_CODE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showToast.success('계정 삭제 완료', '이용해주셔서 감사합니다.');
    setShowConfirmDialog(false);
    setIsLoading(false);
    router.push('/login');
  };

  return (
    <div className="delete-account-page">
      <Card>
        <CardHeader>
          <CardTitle>계정 탈퇴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="delete-account-page__warning">
            <AlertTriangle className="delete-account-page__warning-icon h-5 w-5" />
            <p className="delete-account-page__warning-text">
              계정을 삭제하면 모든 데이터(게시글, 댓글, 채팅 기록 등)가 영구적으로
              삭제되며 복구할 수 없습니다. 신중하게 결정해주세요.
            </p>
          </div>

          <form className="delete-account-page__form" onSubmit={handleSubmit}>
            <FormField label="비밀번호" required>
              <Input
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>

            <FormField label="확인 문구" required>
              <p className="delete-account-page__confirm-text">
                계정 삭제를 진행하려면{' '}
                <span className="delete-account-page__confirm-code">
                  {CONFIRM_CODE}
                </span>
                를 입력하세요.
              </p>
              <Input
                placeholder={CONFIRM_CODE}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </FormField>

            <Button type="submit" variant="destructive" disabled={!isValid}>
              계정 탈퇴
            </Button>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="정말 탈퇴하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다."
        confirmText="탈퇴하기"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
