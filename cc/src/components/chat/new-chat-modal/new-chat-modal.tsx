'use client';

import { useState, useMemo } from 'react';
import { X, Search, Users, MessageCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/common/user-avatar';
import { friends } from '@/mocks/friends';
import { cn } from '@/lib/utils';
import './new-chat-modal.css';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (participantIds: string[], isGroup: boolean, groupName?: string) => void;
}

export function NewChatModal({ isOpen, onClose, onCreateChat }: NewChatModalProps) {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState('');

  const filteredFriends = useMemo(() => {
    if (!search) return friends;
    const searchLower = search.toLowerCase();
    return friends.filter((f) =>
      f.friend.nickname.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleSelect = (friendId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      }
      return [...prev, friendId];
    });
  };

  const handleCreate = () => {
    if (selectedIds.length === 0) return;

    const needsGroup = isGroupMode || selectedIds.length > 1;
    onCreateChat(selectedIds, needsGroup, needsGroup ? groupName : undefined);
    handleClose();
  };

  const handleClose = () => {
    setSearch('');
    setSelectedIds([]);
    setIsGroupMode(false);
    setGroupName('');
    onClose();
  };

  const selectedFriends = friends.filter((f) => selectedIds.includes(f.friend.id));

  if (!isOpen) return null;

  return (
    <div className="new-chat-modal__overlay" onClick={handleClose}>
      <div className="new-chat-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="new-chat-modal__header">
          <h2 className="new-chat-modal__title">새 채팅</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 채팅 타입 선택 */}
        <div className="new-chat-modal__type-selector">
          <button
            className={cn(
              'new-chat-modal__type-btn',
              !isGroupMode && 'new-chat-modal__type-btn--active'
            )}
            onClick={() => setIsGroupMode(false)}
          >
            <MessageCircle className="h-4 w-4" />
            1:1 채팅
          </button>
          <button
            className={cn(
              'new-chat-modal__type-btn',
              isGroupMode && 'new-chat-modal__type-btn--active'
            )}
            onClick={() => setIsGroupMode(true)}
          >
            <Users className="h-4 w-4" />
            그룹 채팅
          </button>
        </div>

        {/* 그룹 이름 입력 (그룹 모드일 때만) */}
        {isGroupMode && (
          <div className="new-chat-modal__group-name">
            <Input
              placeholder="그룹 이름 입력..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}

        {/* 검색 */}
        <div className="new-chat-modal__search">
          <Input
            placeholder="친구 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* 선택된 친구 표시 */}
        {selectedIds.length > 0 && (
          <div className="new-chat-modal__selected">
            <span className="new-chat-modal__selected-label">
              선택됨 ({selectedIds.length})
            </span>
            <div className="new-chat-modal__selected-list">
              {selectedFriends.map((f) => (
                <div
                  key={f.friend.id}
                  className="new-chat-modal__selected-item"
                  onClick={() => handleSelect(f.friend.id)}
                >
                  <UserAvatar
                    src={f.friend.image}
                    name={f.friend.nickname}
                    size="xs"
                  />
                  <span>{f.friend.nickname}</span>
                  <X className="h-3 w-3" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 친구 목록 */}
        <div className="new-chat-modal__friends">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => {
              const isSelected = selectedIds.includes(friend.friend.id);
              return (
                <div
                  key={friend.friend.id}
                  className={cn(
                    'new-chat-modal__friend-item',
                    isSelected && 'new-chat-modal__friend-item--selected'
                  )}
                  onClick={() => handleSelect(friend.friend.id)}
                >
                  <UserAvatar
                    src={friend.friend.image}
                    name={friend.friend.nickname}
                    size="sm"
                    isOnline={friend.friend.isOnline}
                  />
                  <div className="new-chat-modal__friend-info">
                    <span className="new-chat-modal__friend-name">
                      {friend.friend.nickname}
                    </span>
                    <span className="new-chat-modal__friend-status">
                      {friend.friend.isOnline ? '온라인' : '오프라인'}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'new-chat-modal__checkbox',
                      isSelected && 'new-chat-modal__checkbox--checked'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="new-chat-modal__empty">
              <p>검색 결과가 없습니다</p>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="new-chat-modal__footer">
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleCreate}
            disabled={selectedIds.length === 0 || (isGroupMode && !groupName.trim())}
          >
            {isGroupMode ? '그룹 만들기' : '채팅 시작'}
          </Button>
        </div>
      </div>
    </div>
  );
}
