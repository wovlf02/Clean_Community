import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net', // Kakao OAuth
      },
      {
        protocol: 'https',
        hostname: 'phinf.pstatic.net', // Naver OAuth
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Mock 이미지
      },
    ],
  },
};

export default nextConfig;
