'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Search, Settings, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/user-avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import { useTheme } from 'next-themes';
import './header.css';

const navItems = [
  { href: '/dashboard', label: '홈' },
  { href: '/board', label: '게시판' },
  { href: '/chat', label: '채팅' },
  { href: '/friends', label: '친구' },
];

// 목업 알림 데이터
const mockNotifications = [
  { id: '1', message: '홍길동님이 좋아요를 눌렀습니다', time: '2분 전', isRead: false },
  { id: '2', message: '새 댓글이 달렸습니다', time: '5분 전', isRead: false },
  { id: '3', message: '친구 요청이 도착했습니다', time: '1시간 전', isRead: true },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // TODO: 실제 사용자 데이터로 교체
  const user = {
    name: '홍길동',
    email: 'user@example.com',
    image: null,
    isOnline: true,
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isDarkMode = resolvedTheme === 'dark';

  // Hydration 문제 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/board?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // 알림 읽음 처리
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast.success('알림', '모든 알림을 읽음 처리했습니다.');
  };

  // 다크 모드 토글
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    showToast.success('테마 변경', isDarkMode ? '라이트 모드로 변경되었습니다.' : '다크 모드로 변경되었습니다.');
  };

  // 로그아웃
  const handleLogout = () => {
    showToast.success('로그아웃', '로그아웃되었습니다.');
    router.push('/auth/login');
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* 좌측: 로고 + 네비게이션 */}
        <div className="header__left">

          {/* 로고 */}
          <Link href="/" className="header__logo">
            <div className="header__logo-icon">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span>감성 커뮤니티</span>
          </Link>

          {/* 네비게이션 */}
          <nav className="header__nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'header__nav-item',
                  pathname === item.href && 'header__nav-item--active'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 우측 액션 영역 */}
        <div className="header__actions">

          {/* 검색 */}
          <div className="header__search-wrapper" ref={searchRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="검색"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {showSearch && (
              <div className="header__search-dropdown">
                <form onSubmit={handleSearch} className="header__search-form">
                  <Input
                    placeholder="게시글 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="header__search-input"
                  />
                  <Button type="submit" size="sm">검색</Button>
                </form>
              </div>
            )}
          </div>

          {/* 알림 */}
          <div className="header__notification" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="알림"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
            </Button>
            {unreadCount > 0 && (
              <span className="header__notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}

            {showNotifications && (
              <div className="header__notification-dropdown">
                <div className="header__notification-header">
                  <span>알림</span>
                  <button
                    className="header__notification-mark-read"
                    onClick={handleMarkAllRead}
                  >
                    모두 읽음
                  </button>
                </div>
                <div className="header__notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          'header__notification-item',
                          !notif.isRead && 'header__notification-item--unread'
                        )}
                      >
                        <span className="header__notification-message">{notif.message}</span>
                        <span className="header__notification-time">{notif.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="header__notification-empty">알림이 없습니다</div>
                  )}
                </div>
                <Link href="/settings/notifications" className="header__notification-footer">
                  모든 알림 보기
                </Link>
              </div>
            )}
          </div>

          {/* 프로필 */}
          <div className="header__profile" ref={profileRef} onClick={() => setShowProfile(!showProfile)}>
            <UserAvatar
              src={user.image}
              name={user.name}
              size="sm"
              isOnline={user.isOnline}
            />
            <span className="header__profile-name">{user.name}</span>

            {showProfile && (
              <div className="header__profile-dropdown">
                <div className="header__profile-info">
                  <UserAvatar src={user.image} name={user.name} size="md" />
                  <div className="header__profile-details">
                    <span className="header__profile-detail-name">{user.name}</span>
                    <span className="header__profile-email">{user.email}</span>
                  </div>
                </div>
                <div className="header__profile-divider" />
                <Link href="/profile" className="header__profile-item">
                  <User className="h-4 w-4" />
                  <span>내 프로필</span>
                </Link>
                <Link href="/settings" className="header__profile-item">
                  <Settings className="h-4 w-4" />
                  <span>설정</span>
                </Link>
                <Link href="/admin" className="header__profile-item header__profile-item--admin">
                  <Shield className="h-4 w-4" />
                  <span>관리자</span>
                </Link>
                <div className="header__profile-divider" />
                <button className="header__profile-item header__profile-item--logout" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
