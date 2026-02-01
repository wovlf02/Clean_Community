'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Search, MessageCircle, ArrowLeft, MoreVertical, Phone, Video, Flag, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatRoomItem } from '@/components/chat/chat-room-item';
import { MessageBubble } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { UserAvatar } from '@/components/common/user-avatar';
import { VoiceCall } from '@/components/chat/voice-call';
import { VideoCall } from '@/components/chat/video-call';
import { NewChatModal } from '@/components/chat/new-chat-modal';
import { ReportModal } from '@/components/common/report-modal';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { chatRooms } from '@/mocks/chat-rooms';
import { messages } from '@/mocks/messages';
import { currentUser } from '@/mocks/users';
import type { Message } from '@/types/chat';
import { formatDate } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import './chat-list.css';

export default function ChatListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomIdFromUrl = searchParams.get('roomId');

  const [search, setSearch] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(roomIdFromUrl);
  const [roomMessages, setRoomMessages] = useState<Message[]>([]);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showNewMessageBanner, setShowNewMessageBanner] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const SCROLL_THRESHOLD = 100; // 스크롤이 하단에서 이 값 이내면 자동 스크롤

  // URL 파라미터로 채팅방 선택
  useEffect(() => {
    if (roomIdFromUrl) {
      setSelectedRoomId(roomIdFromUrl);
    }
  }, [roomIdFromUrl]);

  // 선택된 채팅방의 메시지 로드
  useEffect(() => {
    if (selectedRoomId) {
      const initialMessages = messages.filter((m) => m.roomId === selectedRoomId);
      setRoomMessages(initialMessages);
      setIsAtBottom(true);
      setShowNewMessageBanner(false);
    }
  }, [selectedRoomId]);

  // 스크롤 위치 체크
  const checkScrollPosition = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distanceFromBottom < SCROLL_THRESHOLD);

    // 하단에 도착하면 새 메시지 배너 숨기기
    if (distanceFromBottom < SCROLL_THRESHOLD) {
      setShowNewMessageBanner(false);
    }
  }, []);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, [checkScrollPosition]);

  // 메시지 추가 시 스크롤 처리
  useEffect(() => {
    if (roomMessages.length === 0) return;

    const lastMessage = roomMessages[roomMessages.length - 1];

    if (isAtBottom) {
      // 하단에 있으면 자동 스크롤
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (lastMessage.senderId !== currentUser.id) {
      // 위에 있고, 상대방 메시지면 배너 표시
      setShowNewMessageBanner(true);
      setNewMessageContent(lastMessage.content);
    }
  }, [roomMessages, isAtBottom]);

  // 하단으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowNewMessageBanner(false);
  };

  const filteredRooms = useMemo(() => {
    if (!search) return chatRooms;

    const searchLower = search.toLowerCase();
    return chatRooms.filter((room) => {
      if (room.type === 'group' && room.name) {
        return room.name.toLowerCase().includes(searchLower);
      }
      const otherUser = room.participants.find((p) => p.id !== currentUser.id);
      return otherUser?.nickname.toLowerCase().includes(searchLower);
    });
  }, [search]);

  // 선택된 채팅방 정보
  const selectedRoom = useMemo(() => {
    return chatRooms.find((r) => r.id === selectedRoomId);
  }, [selectedRoomId]);

  const otherParticipants = selectedRoom?.participants.filter(
    (p) => p.id !== currentUser.id
  ) || [];

  const displayName =
    selectedRoom?.type === 'group'
      ? selectedRoom?.name
      : otherParticipants[0]?.nickname || '알 수 없음';

  const isOnline =
    selectedRoom?.type === 'direct' ? otherParticipants[0]?.isOnline : undefined;

  // 날짜별 메시지 그룹화
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = [];

    roomMessages.forEach((message) => {
      const date = formatDate(message.createdAt);
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.date === date) {
        lastGroup.messages.push(message);
      } else {
        groups.push({ date, messages: [message] });
      }
    });

    return groups;
  }, [roomMessages]);

  const handleSend = (content: string) => {
    if (!selectedRoomId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      roomId: selectedRoomId,
      senderId: currentUser.id,
      sender: currentUser,
      content,
      type: 'text',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setRoomMessages((prev) => [...prev, newMessage]);
    setIsAtBottom(true); // 본인 메시지 전송 시 하단으로
    showToast.success('전송 완료', '메시지가 전송되었습니다.');
  };

  const handleLeaveRoom = () => {
    showToast.success('채팅방 나가기', '채팅방에서 나갔습니다.');
    setShowLeaveDialog(false);
    setSelectedRoomId(null);
    window.history.pushState(null, '', '/chat');
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    window.history.pushState(null, '', `/chat?roomId=${roomId}`);
  };

  const handleBackToList = () => {
    setSelectedRoomId(null);
    window.history.pushState(null, '', '/chat');
  };

  const handleCreateChat = (participantIds: string[], isGroup: boolean, groupName?: string) => {
    if (isGroup) {
      showToast.success('그룹 채팅 생성', `"${groupName}" 그룹이 생성되었습니다.`);
    } else {
      showToast.success('채팅 시작', '새로운 채팅방이 생성되었습니다.');
    }
    // 실제로는 API를 통해 채팅방 생성 후 해당 채팅방으로 이동
    // 임시로 첫 번째 채팅방 선택
    if (chatRooms.length > 0) {
      handleRoomSelect(chatRooms[0].id);
    }
  };

  return (
    <div className="chat-page">
      {/* 채팅방 목록 (좌측) */}
      <div className={`chat-page__sidebar ${selectedRoomId ? 'chat-page__sidebar--hidden-mobile' : ''}`}>
        <div className="chat-list-page">
          {/* 헤더 */}
          <div className="chat-list-page__header">
            <h1 className="chat-list-page__title">채팅</h1>
            <Button size="icon" aria-label="새 채팅" onClick={() => setIsNewChatModalOpen(true)}>
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* 검색 */}
          <Input
            className="chat-list-page__search"
            placeholder="채팅방 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />

          {/* 채팅방 목록 */}
          {filteredRooms.length > 0 ? (
            <div className="chat-list-page__rooms">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomSelect(room.id)}
                  className={`chat-room-wrapper ${room.id === selectedRoomId ? 'chat-room-wrapper--selected' : ''}`}
                >
                  <ChatRoomItem
                    room={room}
                    currentUserId={currentUser.id}
                    isSelected={room.id === selectedRoomId}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="chat-list-page__empty">
              <MessageCircle className="chat-list-page__empty-icon" />
              <h3 className="chat-list-page__empty-title">채팅방이 없습니다</h3>
              <p className="chat-list-page__empty-desc">
                친구와 새로운 대화를 시작해보세요!
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                새 채팅 시작
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 채팅방 상세 (우측) */}
      <div className={`chat-page__main ${!selectedRoomId ? 'chat-page__main--hidden-mobile' : ''}`}>
        {selectedRoom ? (
          <div className="chat-room">
            {/* 채팅방 헤더 */}
            <div className="chat-room__header">
              <Button
                variant="ghost"
                size="icon"
                className="chat-room__back"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              {selectedRoom.type === 'direct' ? (
                <UserAvatar
                  src={otherParticipants[0]?.image}
                  name={otherParticipants[0]?.nickname || '?'}
                  isOnline={isOnline}
                />
              ) : (
                <UserAvatar name={selectedRoom.name || '그룹'} />
              )}

              <div className="chat-room__info">
                <h2 className="chat-room__name">{displayName}</h2>
                {selectedRoom.type === 'direct' && (
                  <span
                    className={`chat-room__status ${
                      isOnline ? 'chat-room__status--online' : ''
                    }`}
                  >
                    {isOnline ? '온라인' : '오프라인'}
                  </span>
                )}
                {selectedRoom.type === 'group' && (
                  <span className="chat-room__status">
                    참여자 {selectedRoom.participants.length}명
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsVoiceCallActive(true);
                  showToast.success('음성 통화', '통화를 시작합니다...');
                }}
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsVideoCallActive(true);
                  showToast.success('화상 통화', '화상 통화를 시작합니다...');
                }}
              >
                <Video className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="chat-room__dropdown">
                  <DropdownMenuItem
                    onClick={() => setShowReportModal(true)}
                    className="chat-room__dropdown-item chat-room__dropdown-item--warning"
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    신고하기
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowLeaveDialog(true)}
                    className="chat-room__dropdown-item chat-room__dropdown-item--danger"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    채팅방 나가기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 메시지 영역 */}
            <div className="chat-room__messages" ref={messagesContainerRef}>
              {groupedMessages.map((group) => (
                <div key={group.date}>
                  <div className="chat-room__date-divider">
                    <div className="chat-room__date-line" />
                    <span className="chat-room__date-text">{group.date}</span>
                    <div className="chat-room__date-line" />
                  </div>

                  {group.messages.map((message, index) => {
                    const isOwn = message.senderId === currentUser.id;
                    const prevMessage = group.messages[index - 1];
                    const showAvatar =
                      !prevMessage || prevMessage.senderId !== message.senderId;

                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                        showSender={selectedRoom.type === 'group' && !isOwn && showAvatar}
                        participantCount={selectedRoom.participants.length}
                        currentUserId={currentUser.id}
                      />
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />

              {/* 새 메시지 배너 */}
              {showNewMessageBanner && (
                <button
                  className="chat-room__new-message-banner"
                  onClick={scrollToBottom}
                >
                  <ChevronDown className="h-4 w-4" />
                  <span>
                    {newMessageContent.length > 30
                      ? newMessageContent.slice(0, 30) + '...'
                      : newMessageContent}
                  </span>
                </button>
              )}
            </div>

            {/* 입력 영역 */}
            <ChatInput onSend={handleSend} />

            {/* 음성 통화 오버레이 */}
            {isVoiceCallActive && otherParticipants[0] && (
              <VoiceCall
                isOpen={isVoiceCallActive}
                onClose={() => setIsVoiceCallActive(false)}
                participant={otherParticipants[0]}
              />
            )}

            {/* 화상 통화 */}
            {isVideoCallActive && selectedRoom && (
              <VideoCall
                isOpen={isVideoCallActive}
                onClose={() => setIsVideoCallActive(false)}
                participants={selectedRoom.participants}
                currentUserId={currentUser.id}
              />
            )}
          </div>
        ) : (
          <div className="chat-page__empty">
            <MessageCircle className="chat-page__empty-icon" />
            <h3 className="chat-page__empty-title">채팅방을 선택해주세요</h3>
            <p className="chat-page__empty-desc">
              친구 목록에서 채팅을 시작하거나<br />
              기존 채팅방을 선택하세요
            </p>
            <Button>새 채팅 시작하기</Button>
          </div>
        )}
      </div>

      {/* 새 채팅 모달 */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />

      {/* 채팅방 신고 모달 */}
      {selectedRoom && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          targetType="chat_room"
          targetId={selectedRoom.id}
          targetLabel={displayName}
        />
      )}

      {/* 채팅방 나가기 다이얼로그 */}
      <ConfirmDialog
        open={showLeaveDialog}
        onOpenChange={setShowLeaveDialog}
        title="채팅방 나가기"
        description={`"${displayName}" 채팅방에서 나가시겠습니까? 대화 내용이 삭제됩니다.`}
        confirmText="나가기"
        variant="destructive"
        onConfirm={handleLeaveRoom}
      />
    </div>
  );
}
