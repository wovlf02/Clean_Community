import Image from 'next/image';
import './loading.css';

const tips = [
  '💡 게시글 작성 시 AI가 내용을 분석해드려요',
  '💬 친구와 실시간으로 채팅할 수 있어요',
  '❤️ 좋아요를 눌러 마음을 표현해보세요',
  '🔍 게시판에서 다양한 글을 찾아보세요',
];

export default function Loading() {
  // 서버 컴포넌트에서는 Math.random() 사용 가능
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="loading-page">
      {/* 애니메이션 로더 */}
      <div className="loading-page__logo-container">
        <div className="loading-page__ring loading-page__ring--outer" />
        <div className="loading-page__ring loading-page__ring--middle" />
        <div className="loading-page__ring loading-page__ring--inner" />
        <Image
          src="/logo.png"
          alt="감성 커뮤니티"
          width={48}
          height={48}
          className="loading-page__logo"
          priority
        />
      </div>

      {/* 텍스트 */}
      <div className="loading-page__text">
        <h2 className="loading-page__title">감성 커뮤니티</h2>
        <p className="loading-page__status">
          로딩 중
          <span className="loading-page__dots">
            <span className="loading-page__dot" />
            <span className="loading-page__dot" />
            <span className="loading-page__dot" />
          </span>
        </p>
      </div>

      {/* 프로그레스 바 */}
      <div className="loading-page__progress">
        <div className="loading-page__progress-bar" />
      </div>

      {/* 팁 */}
      <div className="loading-page__tips">
        <p className="loading-page__tip">{randomTip}</p>
      </div>
    </div>
  );
}
