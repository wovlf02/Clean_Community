'use client';

import { useState } from 'react';
import { Search, UserPlus, Users, Mail, Loader2, Sparkles, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { showToast } from '@/lib/toast';
import './add-friend-modal.css';

// 목업 검색 결과
const mockSearchResults = [
  { id: 'user-search-1', nickname: '김개발', email: 'kim@example.com', image: null, status: '함께 성장하는 개발자입니다', isOnline: true },
  { id: 'user-search-2', nickname: '이코딩', email: 'lee@example.com', image: null, status: 'React & TypeScript', isOnline: false },
  { id: 'user-search-3', nickname: '박디자인', email: 'park@example.com', image: null, status: 'UI/UX 디자이너', isOnline: true },
];

// 추천 친구
const suggestedFriends = [
  { id: 'suggest-1', nickname: '최프론트', email: 'choi@example.com', image: null, status: 'Frontend Developer', isOnline: true, mutualFriends: 3 },
  { id: 'suggest-2', nickname: '정백엔드', email: 'jung@example.com', image: null, status: 'Node.js & Python', isOnline: false, mutualFriends: 2 },
];

interface AddFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFriendModal({ open, onOpenChange }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'suggestions'>('search');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast.error('검색어 입력', '닉네임 또는 이메일을 입력해주세요.');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // 목업: 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results = mockSearchResults.filter(
      (user) =>
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSendRequest = async (userId: string, nickname: string) => {
    // 목업: 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSentRequests((prev) => [...prev, userId]);
    showToast.success('친구 요청 전송', `${nickname}님에게 친구 요청을 보냈습니다.`);
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setActiveTab('search');
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSearch();
    }
  };

  const renderUserCard = (user: typeof mockSearchResults[0] & { mutualFriends?: number }) => {
    const isRequested = sentRequests.includes(user.id);
    return (
      <div key={user.id} className="add-friend-modal__user">
        <div className={`add-friend-modal__user-avatar ${!user.isOnline ? 'add-friend-modal__user-avatar--offline' : ''}`}>
          <UserAvatar src={user.image} name={user.nickname} size="md" />
        </div>
        <div className="add-friend-modal__user-info">
          <span className="add-friend-modal__user-name">
            {user.nickname}
            {user.mutualFriends && (
              <span className="add-friend-modal__user-badge">
                친구 {user.mutualFriends}명
              </span>
            )}
          </span>
          <span className="add-friend-modal__user-email">
            <Mail className="h-3 w-3" />
            {user.email}
          </span>
          {user.status && (
            <span className="add-friend-modal__user-status">{user.status}</span>
          )}
        </div>
        <Button
          size="sm"
          variant={isRequested ? 'secondary' : 'default'}
          disabled={isRequested}
          onClick={(e) => {
            e.stopPropagation();
            handleSendRequest(user.id, user.nickname);
          }}
          className={`add-friend-modal__add-btn ${isRequested ? 'add-friend-modal__add-btn--requested' : ''}`}
        >
          {isRequested ? (
            '요청됨 ✓'
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              추가
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="add-friend-modal" showClose={false}>
        {/* 우측 상단 닫기 버튼 */}
        <button
          className="add-friend-modal__close-btn"
          onClick={handleClose}
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="add-friend-modal__header">
          <div className="add-friend-modal__icon">
            <Users className="h-6 w-6" />
          </div>
          <DialogTitle className="add-friend-modal__title">친구 추가</DialogTitle>
          <DialogDescription className="add-friend-modal__desc">
            닉네임이나 이메일로 친구를 검색하거나,<br />추천 친구를 확인해보세요.
          </DialogDescription>
        </DialogHeader>

        {/* 탭 네비게이션 */}
        <div className="add-friend-modal__tabs">
          <button
            type="button"
            className={`add-friend-modal__tab ${activeTab === 'search' ? 'add-friend-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Search className="h-4 w-4" />
            친구 검색
          </button>
          <button
            type="button"
            className={`add-friend-modal__tab ${activeTab === 'suggestions' ? 'add-friend-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <Sparkles className="h-4 w-4" />
            추천 친구
          </button>
        </div>

        {activeTab === 'search' ? (
          <>
            {/* 검색 입력 */}
            <div className="add-friend-modal__search">
              <div className="add-friend-modal__search-input-wrapper">
                <Search className="add-friend-modal__search-icon" />
                <input
                  type="text"
                  className="add-friend-modal__search-input"
                  placeholder="닉네임 또는 이메일 입력..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="add-friend-modal__search-btn"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  '검색'
                )}
              </Button>
            </div>

            {/* 검색 결과 헤더 */}
            {hasSearched && !isSearching && searchResults.length > 0 && (
              <div className="add-friend-modal__results-header">
                <span className="add-friend-modal__results-count">
                  검색 결과 <strong>{searchResults.length}</strong>명
                </span>
              </div>
            )}

            {/* 검색 결과 */}
            <div className="add-friend-modal__results">
              {isSearching ? (
                <div className="add-friend-modal__loading">
                  <div className="add-friend-modal__loading-spinner" />
                  <p>검색 중...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="add-friend-modal__list">
                  {searchResults.map(renderUserCard)}
                </div>
              ) : hasSearched ? (
                <div className="add-friend-modal__empty">
                  <div className="add-friend-modal__empty-icon">
                    <Search className="h-8 w-8" />
                  </div>
                  <p className="add-friend-modal__empty-title">검색 결과가 없습니다</p>
                  <p className="add-friend-modal__empty-desc">
                    다른 닉네임이나 이메일로 검색해보세요. 정확한 이메일 주소를 입력하면 더 정확한 결과를 얻을 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="add-friend-modal__placeholder">
                  <div className="add-friend-modal__placeholder-icon">
                    <Users className="h-8 w-8" />
                  </div>
                  <p className="add-friend-modal__placeholder-title">친구를 검색해보세요</p>
                  <p className="add-friend-modal__placeholder-desc">
                    닉네임이나 이메일을 입력하고 검색 버튼을 눌러주세요. 함께할 친구를 찾아보세요!
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* 추천 친구 탭 */
          <div className="add-friend-modal__results">
            <div className="add-friend-modal__suggestions">
              <p className="add-friend-modal__suggestions-title">
                <Sparkles className="h-4 w-4" />
                알 수도 있는 친구
              </p>
              <div className="add-friend-modal__list">
                {suggestedFriends.map(renderUserCard)}
              </div>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <div className="add-friend-modal__footer">
          <Shield className="h-3.5 w-3.5" />
          <span>친구 요청은 상대방이 수락해야 연결됩니다</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
