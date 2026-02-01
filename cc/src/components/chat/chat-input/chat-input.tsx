'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Smile, Paperclip, X } from 'lucide-react';
import { showToast } from '@/lib/toast';
import './chat-input.css';

// 간단한 이모지 목록
const EMOJI_LIST = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '😢', '😮', '🤔', '👏', '💪', '🙏', '✨', '🌟', '💯'];

interface ChatInputProps {
  onSend: (content: string) => void;
  onSendFile?: (file: File) => void;
  onSendImage?: (file: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onSendFile, onSendImage, disabled }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // 텍스트 영역 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  // 외부 클릭 시 이모지 피커 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 파일 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSend = () => {
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        onSendImage?.(selectedFile);
        showToast.success('전송', '이미지가 전송되었습니다.');
      } else {
        onSendFile?.(selectedFile);
        showToast.success('전송', '파일이 전송되었습니다.');
      }
      setSelectedFile(null);
      setPreviewUrl(null);
    }

    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // IME 입력 중(한글 조합 중)에는 Enter 무시
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast.error('파일 크기 초과', '파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }

    e.target.value = '';
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="chat-input-wrapper">
      {/* 파일 미리보기 */}
      {selectedFile && (
        <div className="chat-input__preview">
          {previewUrl ? (
            <div className="chat-input__preview-image">
              <img src={previewUrl} alt="미리보기" />
              <button
                className="chat-input__preview-remove"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="chat-input__preview-file">
              <Paperclip className="h-5 w-5" />
              <div className="chat-input__preview-file-info">
                <span className="chat-input__preview-file-name">{selectedFile.name}</span>
                <span className="chat-input__preview-file-size">{formatFileSize(selectedFile.size)}</span>
              </div>
              <button
                className="chat-input__preview-remove"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="chat-input">
        {/* 이모지 버튼 */}
        <div className="chat-input__emoji-wrapper" ref={emojiPickerRef}>
          <button
            type="button"
            className="chat-input__action-btn"
            aria-label="이모지"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </button>

          {showEmojiPicker && (
            <div className="chat-input__emoji-picker">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="chat-input__emoji-btn"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 파일 첨부 */}
        <button
          type="button"
          className="chat-input__action-btn"
          aria-label="파일 첨부"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="chat-input__file-input"
          onChange={(e) => handleFileChange(e, 'file')}
          accept="*/*"
        />

        {/* 이미지 첨부 */}
        <button
          type="button"
          className="chat-input__action-btn"
          aria-label="이미지 첨부"
          onClick={() => imageInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <input
          ref={imageInputRef}
          type="file"
          className="chat-input__file-input"
          onChange={(e) => handleFileChange(e, 'image')}
          accept="image/*"
        />

        <textarea
          ref={textareaRef}
          className="chat-input__textarea"
          placeholder="메시지를 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />

        <button
          type="button"
          className="chat-input__send-btn"
          onClick={handleSend}
          disabled={(!content.trim() && !selectedFile) || disabled}
          aria-label="전송"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
