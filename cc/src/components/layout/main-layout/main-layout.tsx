'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomTabBar } from '@/components/layout/bottom-tab-bar';
import './main-layout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      <Header />
      <div className="main-layout">
        {!isAdminPage && <Sidebar />}
        <main className={`main-layout__content ${isAdminPage ? 'main-layout__content--admin' : ''}`}>
          {children}
        </main>
      </div>
      {!isAdminPage && <BottomTabBar />}
    </>
  );
}
