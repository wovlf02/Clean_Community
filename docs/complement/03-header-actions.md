# 03. 헤더 우측 기능 구현

## 현재 문제
1. 검색, 알림, 프로필 버튼이 기능하지 않음
2. 페이지 이동도 없고 동작 자체가 없음

## 개선 방안
1. 검색 버튼: 검색 모달 또는 검색 페이지 이동
2. 알림 버튼: 알림 드롭다운 표시
3. 프로필 버튼: 프로필 드롭다운 메뉴

## 구현 내용

### 파일 수정
- `cc/src/components/layout/header/Header.tsx`
- `cc/src/components/common/search-modal/` (신규)
- `cc/src/components/common/notification-dropdown/` (신규)
- `cc/src/components/common/profile-dropdown/` (신규)

### 기능
1. **검색**: 전역 검색 모달 (Command + K 또는 클릭)
2. **알림**: 드롭다운에 최근 알림 표시, 읽음 처리
3. **프로필**: 내 프로필, 설정, 다크모드, 로그아웃

## CSS 변경
- `.header__actions` margin-left: auto 적용하여 우측 끝 정렬

## 상태
- [x] 분석 완료
- [x] 구현 완료
