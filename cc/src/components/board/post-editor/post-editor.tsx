'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  Eye,
  Sparkles,
  Film,
  Music,
  Archive,
  Code,
  Type,
  FileQuestion,
  Info,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/common/form-field';
import { SentimentWarningModal } from '@/components/common/sentiment-warning-modal';
import { showToast } from '@/lib/toast';
import {
  validateFiles,
  formatFileSize,
  getAcceptString,
  MAX_ATTACHMENTS,
  MAX_TOTAL_SIZE,
  FILE_CATEGORY_INFO,
  SUPPORTED_FILES_DESCRIPTION,
  type FileCategory,
} from '@/lib/file-upload';
import './post-editor.css';

const categories = [
  { value: 'general', label: '일반', description: '자유롭게 이야기하는 공간' },
  { value: 'qna', label: 'Q&A', description: '질문과 답변' },
  { value: 'info', label: '정보공유', description: '유용한 정보 공유' },
  { value: 'daily', label: '일상', description: '일상 이야기' },
];

const postSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다').max(100),
  content: z.string().min(10, '내용은 10자 이상이어야 합니다'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
});

type PostForm = z.infer<typeof postSchema>;

interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
  category: FileCategory;
}

interface PostEditorProps {
  defaultValues?: Partial<PostForm>;
  isEdit?: boolean;
}

export function PostEditor({ defaultValues, isEdit }: PostEditorProps) {
  const router = useRouter();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [detectedCategories, setDetectedCategories] = useState<string[]>([]);
  const [pendingData, setPendingData] = useState<PostForm | null>(null);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      category: '',
      ...defaultValues,
    },
  });

  const category = watch('category');
  const title = watch('title');
  const content = watch('content');

  // 현재 첨부파일 총 용량 계산
  const currentTotalSize = attachments.reduce((sum, att) => sum + att.file.size, 0);

  // 카테고리별 아이콘 매핑
  const getCategoryIcon = (cat: FileCategory) => {
    switch (cat) {
      case 'image': return ImageIcon;
      case 'video': return Film;
      case 'audio': return Music;
      case 'document': return FileText;
      case 'archive': return Archive;
      case 'code': return Code;
      case 'font': return Type;
      default: return FileQuestion;
    }
  };

  // 파일 첨부 핸들러
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const { validFiles, invalidFiles, errors } = validateFiles(
      Array.from(files),
      attachments.length,
      currentTotalSize
    );

    // 에러 메시지 표시
    errors.forEach(error => {
      showToast.error('파일 업로드 오류', error);
    });

    invalidFiles.forEach(({ file, error }) => {
      showToast.error('파일 업로드 실패', `${file.name}: ${error}`);
    });

    // 유효한 파일 추가
    const newAttachments: AttachmentFile[] = validFiles.map(({ file, category }) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      category,
      preview: category === 'image' || category === 'video'
        ? URL.createObjectURL(file)
        : undefined,
    }));

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
      if (newAttachments.length < files.length) {
        showToast.info('일부 파일 업로드됨', `${newAttachments.length}개 파일이 추가되었습니다.`);
      }
    }

    e.target.value = '';
  }, [attachments.length, currentTotalSize]);

  // 파일 삭제
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const { validFiles, invalidFiles, errors } = validateFiles(
      Array.from(files),
      attachments.length,
      currentTotalSize
    );

    errors.forEach(error => {
      showToast.error('파일 업로드 오류', error);
    });

    invalidFiles.forEach(({ file, error }) => {
      showToast.error('파일 업로드 실패', `${file.name}: ${error}`);
    });

    const newAttachments: AttachmentFile[] = validFiles.map(({ file, category }) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      category,
      preview: category === 'image' || category === 'video'
        ? URL.createObjectURL(file)
        : undefined,
    }));

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  }, [attachments.length, currentTotalSize]);

  const handleFormSubmit = async (data: PostForm) => {
    // Mock AI 감정분석 (30% 확률로 경고)
    const mockAnalysis = {
      hasWarning: Math.random() > 0.7,
      categories: ['부정적 표현 감지'],
    };

    if (mockAnalysis.hasWarning) {
      setDetectedCategories(mockAnalysis.categories);
      setPendingData(data);
      setShowWarningModal(true);
    } else {
      await submitPost(data);
    }
  };

  const submitPost = async (_data: PostForm) => {
    // Mock API 호출 - 첨부파일 포함
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showToast.success(
      isEdit ? '수정 완료' : '등록 완료',
      isEdit ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.'
    );
    router.push('/board');
  };

  const handleProceed = () => {
    if (pendingData) {
      submitPost(pendingData);
      setShowWarningModal(false);
    }
  };

  const selectedCategory = categories.find((c) => c.value === category);

  return (
    <>
      <div className="post-editor-container">
        <form className="post-editor" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* 헤더 */}
          <div className="post-editor__header">
            <div className="post-editor__header-left">
              <h1 className="post-editor__title">
                {isEdit ? '게시글 수정' : '게시글 작성'}
              </h1>
              <p className="post-editor__subtitle">
                커뮤니티에 글을 작성하고 의견을 나눠보세요
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {isPreviewMode ? '편집' : '미리보기'}
            </Button>
          </div>

          {isPreviewMode ? (
            /* 미리보기 모드 */
            <Card className="post-editor__preview">
              <div className="post-editor__preview-category">
                {selectedCategory?.label || '카테고리 없음'}
              </div>
              <h2 className="post-editor__preview-title">
                {title || '제목을 입력하세요'}
              </h2>
              <div className="post-editor__preview-content">
                {content || '내용을 입력하세요...'}
              </div>
              {attachments.length > 0 && (
                <div className="post-editor__preview-attachments">
                  {attachments.filter(a => a.category === 'image').map((att) => (
                    <img key={att.id} src={att.preview} alt="" className="post-editor__preview-image" />
                  ))}
                  {attachments.filter(a => a.category !== 'image').length > 0 && (
                    <div className="post-editor__preview-files">
                      {attachments.filter(a => a.category !== 'image').map((att) => {
                        const categoryInfo = FILE_CATEGORY_INFO[att.category];
                        return (
                          <span key={att.id} className="post-editor__preview-file">
                            {categoryInfo.icon} {att.file.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ) : (
            /* 편집 모드 */
            <>
              {/* 카테고리 선택 */}
              <div className="post-editor__category-section">
                <label className="post-editor__label">
                  카테고리 <span className="post-editor__required">*</span>
                </label>
                <div className="post-editor__category-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      className={`post-editor__category-card ${category === cat.value ? 'post-editor__category-card--active' : ''}`}
                      onClick={() => setValue('category', cat.value)}
                    >
                      <span className="post-editor__category-label">{cat.label}</span>
                      <span className="post-editor__category-desc">{cat.description}</span>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="post-editor__error">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* 제목 입력 */}
              <FormField label="제목" required error={errors.title?.message}>
                <Input
                  className="post-editor__title-input"
                  placeholder="제목을 입력하세요 (최대 100자)"
                  error={!!errors.title}
                  {...register('title')}
                />
                <div className="post-editor__char-count">
                  {title?.length || 0} / 100
                </div>
              </FormField>

              {/* 내용 입력 */}
              <FormField label="내용" required error={errors.content?.message}>
                <Textarea
                  className="post-editor__content-textarea"
                  placeholder="내용을 입력하세요. 커뮤니티 가이드라인을 준수해주세요."
                  rows={12}
                  {...register('content')}
                />
              </FormField>

              {/* AI 분석 힌트 */}
              <div className="post-editor__ai-hint">
                <Sparkles className="h-4 w-4" />
                <span>AI가 작성된 내용을 분석하여 건강한 소통을 도와드립니다</span>
              </div>

              {/* 첨부파일 영역 */}
              <div className="post-editor__attachments">
                <div className="post-editor__attachments-header">
                  <label className="post-editor__label">첨부파일</label>
                  <span className="post-editor__attachments-count">
                    {attachments.length} / {MAX_ATTACHMENTS}개 · {formatFileSize(currentTotalSize)} / {formatFileSize(MAX_TOTAL_SIZE)}
                  </span>
                </div>

                {/* 지원 파일 형식 안내 */}
                <div className="post-editor__file-types">
                  <Info className="h-4 w-4" />
                  <div className="post-editor__file-types-content">
                    <span>지원 형식: </span>
                    <span>{SUPPORTED_FILES_DESCRIPTION.image}, </span>
                    <span>{SUPPORTED_FILES_DESCRIPTION.video}, </span>
                    <span>{SUPPORTED_FILES_DESCRIPTION.document}, </span>
                    <span>{SUPPORTED_FILES_DESCRIPTION.archive}</span>
                  </div>
                </div>

                {/* 드래그 앤 드롭 영역 */}
                <div
                  className="post-editor__upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8" />
                  <p className="post-editor__upload-text">
                    파일을 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="post-editor__upload-hint">
                    이미지, 비디오, 오디오, 문서, 압축파일, 코드 등 다양한 형식 지원
                  </p>
                  <p className="post-editor__upload-limit">
                    파일당 최대 100MB · 총 {MAX_ATTACHMENTS}개 · 총 용량 {formatFileSize(MAX_TOTAL_SIZE)}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={getAcceptString()}
                  onChange={handleFileSelect}
                  className="post-editor__file-input"
                />

                {/* 첨부된 파일 목록 */}
                {attachments.length > 0 && (
                  <div className="post-editor__file-list">
                    {attachments.map((att) => {
                      const IconComponent = getCategoryIcon(att.category);
                      const categoryInfo = FILE_CATEGORY_INFO[att.category];

                      return (
                        <div key={att.id} className="post-editor__file-item">
                          {att.preview ? (
                            <div className="post-editor__file-preview">
                              {att.category === 'video' ? (
                                <video src={att.preview} />
                              ) : (
                                <img src={att.preview} alt="" />
                              )}
                            </div>
                          ) : (
                            <div
                              className="post-editor__file-icon"
                              style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                          )}
                          <div className="post-editor__file-info">
                            <span className="post-editor__file-name">{att.file.name}</span>
                            <span className="post-editor__file-meta">
                              <span
                                className="post-editor__file-category"
                                style={{ color: categoryInfo.color }}
                              >
                                {categoryInfo.icon} {categoryInfo.label}
                              </span>
                              <span className="post-editor__file-size">{formatFileSize(att.file.size)}</span>
                            </span>
                          </div>
                          <button
                            type="button"
                            className="post-editor__file-remove"
                            onClick={() => handleRemoveAttachment(att.id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* 액션 버튼 */}
          <div className="post-editor__actions">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEdit ? '수정하기' : '등록하기'}
            </Button>
          </div>
        </form>
      </div>

      {/* AI 감정분석 경고 모달 */}
      <SentimentWarningModal
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        categories={detectedCategories}
        onEdit={() => setShowWarningModal(false)}
        onProceed={handleProceed}
      />
    </>
  );
}
