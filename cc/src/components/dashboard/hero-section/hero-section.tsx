'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users,
  MessageCircle,
  Heart,
  TrendingUp,
  Bot,
  Globe,
  Lock,
  ChevronRight,
  Play,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import './hero-section.css';

const features = [
  {
    icon: Bot,
    title: 'AI 감정 분석',
    description: '게시글의 감정을 실시간으로 분석하여 건강한 대화를 유도합니다.',
    color: 'hsl(262, 83%, 58%)',
  },
  {
    icon: Shield,
    title: '안전한 커뮤니티',
    description: '유해 콘텐츠를 자동으로 감지하고 필터링하여 안전한 공간을 제공합니다.',
    color: 'hsl(142, 76%, 36%)',
  },
  {
    icon: Zap,
    title: '실시간 소통',
    description: '친구들과 실시간 채팅, 음성/영상 통화로 즉각적인 소통이 가능합니다.',
    color: 'hsl(37, 91%, 55%)',
  },
  {
    icon: Users,
    title: '친구 네트워크',
    description: '관심사가 비슷한 사람들과 연결하고 의미 있는 관계를 형성하세요.',
    color: 'hsl(217, 91%, 60%)',
  },
];

const stats = [
  { label: '활성 사용자', value: '10K+', icon: Users },
  { label: '일일 게시글', value: '5K+', icon: MessageCircle },
  { label: '긍정적 대화', value: '95%', icon: Heart },
  { label: '실시간 채팅', value: '24/7', icon: Globe },
];

const testimonials = [
  {
    name: '김민수',
    role: '대학생',
    content: 'AI가 감정을 분석해주니 대화가 훨씬 부드러워졌어요. 다른 커뮤니티와는 차원이 다릅니다.',
    avatar: '/avatars/user1.png',
    rating: 5,
  },
  {
    name: '이서연',
    role: '직장인',
    content: '유해 댓글 걱정 없이 마음 편하게 글을 올릴 수 있어서 좋아요!',
    avatar: '/avatars/user2.png',
    rating: 5,
  },
  {
    name: '박지훈',
    role: '프리랜서',
    content: '친구들과 실시간으로 소통하기 좋고, 인터페이스도 깔끔해서 만족합니다.',
    avatar: '/avatars/user3.png',
    rating: 5,
  },
];

export function HeroSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      {/* 배경 효과 */}
      <div className="hero-section__bg">
        <div className="hero-section__gradient" />
        <div className="hero-section__particles" />
      </div>

      {/* 히어로 콘텐츠 */}
      <div className="hero-section__content">
        {/* 로고 */}
        <div className="hero-section__logo">
          <Image
            src="/logo.png"
            alt="감성 커뮤니티"
            width={80}
            height={80}
            className="hero-section__logo-image"
            priority
          />
        </div>

        <div className="hero-section__badge">
          <Sparkles className="h-4 w-4" />
          <span>AI 기반 감성 커뮤니티</span>
        </div>

        <h1 className="hero-section__title">
          <span className="hero-section__title-line">더 따뜻하고,</span>
          <span className="hero-section__title-line hero-section__title-gradient">
            더 건강한 대화
          </span>
        </h1>

        <p className="hero-section__subtitle">
          인공지능이 감정을 분석하여 긍정적인 소통 문화를 만들어갑니다.
          <br />
          안전하고 따뜻한 커뮤니티에서 새로운 친구를 만나보세요.
        </p>

        <div className="hero-section__cta">
          <Button size="lg" className="hero-section__cta-primary" asChild>
            <Link href="/dashboard">
              커뮤니티 둘러보기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="hero-section__cta-secondary">
            <Play className="mr-2 h-4 w-4" />
            소개 영상 보기
          </Button>
        </div>

        {/* 실시간 통계 */}
        <div className="hero-section__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="hero-section__stat">
              <stat.icon className="h-5 w-5" />
              <span className="hero-section__stat-value">{stat.value}</span>
              <span className="hero-section__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 기능 하이라이트 */}
      <div className="hero-section__features">
        <h2 className="hero-section__features-title">
          <TrendingUp className="h-6 w-6" />
          왜 감성 커뮤니티인가요?
        </h2>
        <div className="hero-section__features-grid">
          {features.map((feature) => (
            <Card key={feature.title} className="hero-section__feature-card">
              <CardContent className="hero-section__feature-content">
                <div
                  className="hero-section__feature-icon"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="hero-section__feature-title">{feature.title}</h3>
                <p className="hero-section__feature-desc">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 사용자 후기 */}
      <div className="hero-section__testimonials">
        <h2 className="hero-section__testimonials-title">
          사용자들의 이야기
        </h2>
        <div className="hero-section__testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`hero-section__testimonial ${
                index === currentTestimonial ? 'hero-section__testimonial--active' : ''
              }`}
            >
              <div className="hero-section__testimonial-rating">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" />
                ))}
              </div>
              <p className="hero-section__testimonial-content">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="hero-section__testimonial-author">
                <div className="hero-section__testimonial-avatar">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="hero-section__testimonial-name">{testimonial.name}</p>
                  <p className="hero-section__testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="hero-section__testimonials-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`hero-section__testimonials-dot ${
                  index === currentTestimonial ? 'hero-section__testimonials-dot--active' : ''
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI 기능 소개 */}
      <div className="hero-section__ai-showcase">
        <div className="hero-section__ai-content">
          <div className="hero-section__ai-badge">
            <Bot className="h-4 w-4" />
            AI 감정 분석
          </div>
          <h2 className="hero-section__ai-title">
            당신의 감정을 이해하는
            <br />
            스마트한 커뮤니티
          </h2>
          <p className="hero-section__ai-desc">
            최첨단 자연어 처리(NLP) 기술을 활용하여 게시글과 댓글의 감정을 실시간으로 분석합니다.
            부정적인 감정이 감지되면 사전에 경고하여 건강한 대화를 유도합니다.
          </p>
          <ul className="hero-section__ai-features">
            <li>
              <ChevronRight className="h-4 w-4" />
              실시간 감정 분석 및 시각화
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
              유해 콘텐츠 자동 필터링
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
              개인화된 콘텐츠 추천
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
              대화 품질 리포트 제공
            </li>
          </ul>
        </div>
        <div className="hero-section__ai-visual">
          <div className="hero-section__ai-demo">
            <div className="hero-section__ai-demo-header">
              <span className="hero-section__ai-demo-dot" />
              <span className="hero-section__ai-demo-dot" />
              <span className="hero-section__ai-demo-dot" />
            </div>
            <div className="hero-section__ai-demo-content">
              <div className="hero-section__ai-demo-message">
                <span className="hero-section__ai-demo-label">입력</span>
                <p>&ldquo;오늘 정말 기분 좋은 하루였어요! 여러분도 좋은 하루 보내세요 😊&rdquo;</p>
              </div>
              <div className="hero-section__ai-demo-result">
                <span className="hero-section__ai-demo-label">AI 분석</span>
                <div className="hero-section__ai-demo-emotion">
                  <span className="hero-section__ai-demo-emotion-badge hero-section__ai-demo-emotion-badge--positive">
                    😊 긍정적
                  </span>
                  <span className="hero-section__ai-demo-confidence">신뢰도 98%</span>
                </div>
                <div className="hero-section__ai-demo-bar">
                  <div className="hero-section__ai-demo-bar-fill" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 보안 및 프라이버시 */}
      <div className="hero-section__security">
        <Lock className="h-8 w-8" />
        <div>
          <h3 className="hero-section__security-title">보안 및 프라이버시</h3>
          <p className="hero-section__security-desc">
            모든 데이터는 암호화되어 저장되며, 개인정보보호법을 철저히 준수합니다.
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/privacy">
            자세히 알아보기
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
