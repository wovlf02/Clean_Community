import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider, ThemeProvider } from "@/providers";
import { Toaster } from "@/components/common/toaster";
import "@/styles/fonts.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: '감성 커뮤니티',
    template: '%s | 감성 커뮤니티',
  },
  description: 'AI 기반 감정분석으로 건강한 소통 문화를 만드는 커뮤니티',
  keywords: ['커뮤니티', '소통', 'AI', '감정분석', '건강한 대화'],
  authors: [{ name: 'Emotion Community Team' }],
  creator: 'Emotion Community',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '감성 커뮤니티',
    title: '감성 커뮤니티',
    description: 'AI 기반 감정분석으로 건강한 소통 문화를 만드는 커뮤니티',
  },
  twitter: {
    card: 'summary_large_image',
    title: '감성 커뮤니티',
    description: 'AI 기반 감정분석으로 건강한 소통 문화를 만드는 커뮤니티',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
