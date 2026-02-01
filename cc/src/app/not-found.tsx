'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Home,
  Search,
  FileQuestion,
  MessageSquare,
  Users,
  Settings,
} from 'lucide-react';
import './not-found.css';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/board?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const suggestions = [
    { href: '/', label: '홈', icon: Home },
    { href: '/board', label: '게시판', icon: MessageSquare },
    { href: '/chat', label: '채팅', icon: MessageSquare },
    { href: '/friends', label: '친구', icon: Users },
    { href: '/settings', label: '설정', icon: Settings },
  ];

  return (
    <div className="not-found-page">
      {/* 애니메이션 404 */}
      <div className="not-found-page__illustration">
        <span className="not-found-page__number">404</span>
        <FileQuestion className="not-found-page__icon" />
      </div>

      {/* 콘텐츠 */}
      <div className="not-found-page__content">
        <h1 className="not-found-page__title">페이지를 찾을 수 없습니다</h1>
        <p className="not-found-page__description">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
          <br />
          주소를 다시 확인하시거나, 아래에서 원하는 페이지를 찾아보세요.
        </p>
      </div>

      {/* 검색 */}
      <div className="not-found-page__search">
        <form onSubmit={handleSearch} className="not-found-page__search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="게시글 검색..."
            className="not-found-page__search-input"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            검색
          </Button>
        </form>
      </div>

      {/* 액션 버튼 */}
      <div className="not-found-page__actions">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            홈으로 이동
          </Link>
        </Button>
        <Button variant="outline" size="lg" onClick={() => router.back()}>
          이전 페이지로
        </Button>
      </div>

      {/* 추천 페이지 */}
      <div className="not-found-page__suggestions">
        <p className="not-found-page__suggestions-title">이 페이지는 어떠세요?</p>
        <div className="not-found-page__suggestions-list">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion.href}
              href={suggestion.href}
              className="not-found-page__suggestion-link"
            >
              <suggestion.icon className="not-found-page__suggestion-icon" />
              {suggestion.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
