'use client';

import { use, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/board/post-editor';
import { posts } from '@/mocks/posts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: PageProps) {
  const { id } = use(params);

  const post = useMemo(() => {
    return posts.find((p) => p.id === id);
  }, [id]);

  if (!post) {
    notFound();
  }

  return (
    <PostEditor
      isEdit
      defaultValues={{
        title: post.title,
        content: post.content,
        category: post.category,
      }}
    />
  );
}
