'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import type { User } from '@/types/user';
import './video-call.css';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participants: User[];
  currentUserId: string;
}

export function VideoCall({ isOpen, onClose, participants, currentUserId }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // 통화 시간 카운터
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // 미디어 스트림 초기화
  useEffect(() => {
    if (!isOpen) return;

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('미디어 접근 오류:', error);
      }
    };

    initMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentUser = participants.find((p) => p.id === currentUserId);
  const otherParticipants = participants.filter((p) => p.id !== currentUserId);

  return (
    <div className="video-call">
      {/* 비디오 그리드 */}
      <div className="video-call__grid">
        {/* 내 비디오 */}
        <div className="video-call__participant">
          {isVideoOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="video-call__video"
            />
          ) : (
            <div className="video-call__video-off">
              <UserAvatar
                src={currentUser?.image}
                name={currentUser?.nickname || '나'}
                size="lg"
              />
              <span>{currentUser?.nickname || '나'}</span>
            </div>
          )}
          <span className="video-call__label">나</span>
        </div>

        {/* 다른 참여자들 */}
        {otherParticipants.map((participant) => (
          <div key={participant.id} className="video-call__participant">
            <div className="video-call__video-off">
              <UserAvatar
                src={participant.image}
                name={participant.nickname}
                size="lg"
              />
              <span>{participant.nickname}</span>
            </div>
            <span className="video-call__label">{participant.nickname}</span>
          </div>
        ))}
      </div>

      {/* 하단 컨트롤 바 */}
      <div className="video-call__controls">
        {/* 참여자 목록 (좌측) */}
        <div className="video-call__participants-section">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="video-call__participants-btn"
          >
            <Users className="h-4 w-4 mr-1" />
            {participants.length}명
            {showParticipants ? (
              <ChevronDown className="h-3 w-3 ml-1" />
            ) : (
              <ChevronUp className="h-3 w-3 ml-1" />
            )}
          </Button>

          {showParticipants && (
            <div className="video-call__participants-list">
              {participants.map((p) => (
                <div key={p.id} className="video-call__participant-item">
                  <UserAvatar src={p.image} name={p.nickname} size="sm" />
                  <span>{p.nickname}</span>
                  {p.id === currentUserId && <span className="video-call__me">(나)</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 통화 시간 (중앙) */}
        <div className="video-call__duration">
          {formatDuration(callDuration)}
        </div>

        {/* 컨트롤 버튼들 (우측) */}
        <div className="video-call__buttons">
          <Button
            variant={isMuted ? 'destructive' : 'outline'}
            size="icon"
            onClick={handleMuteToggle}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant={!isVideoOn ? 'destructive' : 'outline'}
            size="icon"
            onClick={handleVideoToggle}
          >
            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
