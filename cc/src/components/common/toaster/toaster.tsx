'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import './toaster.css';

export function Toaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SonnerToaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'bg-card border-border shadow-lg',
          title: 'text-foreground font-medium text-sm',
          description: 'text-muted-foreground text-xs',
          closeButton: 'bg-card border-border hover:bg-muted',
        },
      }}
    />
  );
}
