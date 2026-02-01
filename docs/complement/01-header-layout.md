# 01. 헤더 레이아웃 개선

## 현재 문제
1. "감성 커뮤니티" 타이틀이 중앙에 위치
2. 플랫폼 대표 아이콘이 없음

## 개선 방안
1. 타이틀을 좌측 끝으로 이동
2. 타이틀 좌측에 아이콘 배치 공간 마련
3. `public/logo.png` 또는 `public/logo.jpg` 파일만 넣으면 자동 적용

## 구현 내용

### 파일 수정
- `cc/src/components/layout/header/Header.tsx`
- `cc/src/components/layout/header/header.css`

### 변경사항
```tsx
// 로고 영역에 이미지 + 텍스트 구조로 변경
<Link href="/" className="header__logo">
  <Image src="/logo.png" alt="Logo" width={32} height={32} />
  <span>감성 커뮤니티</span>
</Link>
```

### CSS 변경
- `.header__logo` justify-self: start 적용
- `.header__container` grid layout으로 변경
- 우측 액션 영역 flex-end 적용

## 상태
- [x] 분석 완료
- [x] 구현 완료
