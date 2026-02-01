# 대시보드 보완 작업 (Dashboard Complement)

**관련 문서**: 
- [기능 요구사항 - 대시보드](../../../02_requirements/functional.md#5-대시보드-fr-35--fr-39)
- [대시보드 화면 설계](../../../05_screens/05_dashboard/dashboard-page.md)
- [대시보드 페이지 구현 가이드](../../08-dashboard-pages.md)
- [API 명세서 - 대시보드](../../../12_api/README.md)

---

## 📋 현재 구현 상태

| 기능 요구사항 | 상태 | 구현 위치 |
|--------------|------|----------|
| FR-35: 사용자 활동 통계 | ⚠️ 부분 | `cc/src/app/api/dashboard/stats/` |
| FR-36: 인기 게시글 | ✅ 완료 | `cc/src/app/api/posts/popular/` |
| FR-37: 최근 활동 내역 | ✅ 완료 | `cc/src/app/api/dashboard/activity/` |
| FR-38: 알림 센터 | ✅ 완료 | `cc/src/app/api/notifications/` |
| FR-39: 커뮤니티 트렌드 | ⚠️ 부분 | 일부 데이터만 |

---

## ✅ 체크리스트

### 1. 활동 통계 차트 데이터 연동

**문서 설계 내용** (functional.md FR-35 참조):
- 작성 게시글 수, 댓글 수, 받은 좋아요, 채팅 참여도
- 기간별: 오늘, 이번 주, 이번 달, 전체
- 라인 차트, 바 차트 시각화

**현재 상태**:
- ActivityChart 컴포넌트 존재
- 목업 데이터 사용 중

**TODO**:
- [ ] 활동 통계 API 확장
  - `GET /api/dashboard/stats?period=week`
  - 기간별 일자별 데이터 반환
  ```typescript
  {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: {
      posts: [1, 0, 2, 1, 0, 3, 1],
      comments: [3, 5, 2, 8, 4, 1, 6],
      likes: [12, 8, 15, 23, 11, 18, 9]
    }
  }
  ```
- [ ] 기간 선택 탭 연동
  - 오늘, 이번 주, 이번 달 버튼
  - 선택 시 API 호출
- [ ] Recharts 라이브러리 연동
  - LineChart 또는 BarChart 컴포넌트
  - 반응형 차트 크기
- [ ] 로딩 상태 스켈레톤

**참고 파일**:
```
cc/src/components/dashboard/activity-chart/
cc/src/app/api/dashboard/stats/
cc/src/app/(main)/page.tsx
```

---

### 2. 커뮤니티 트렌드 API 구현

**문서 설계 내용** (functional.md FR-39 참조):
- 활성 사용자 수
- 오늘 게시글 수
- 인기 키워드

**현재 상태**:
- 일부 통계만 존재
- 인기 키워드 미구현

**TODO**:
- [ ] 커뮤니티 트렌드 API
  - `GET /api/dashboard/trends`
  ```typescript
  {
    activeUsers: 128,        // 24시간 내 활동 사용자
    todayPosts: 45,          // 오늘 작성된 게시글
    todayComments: 234,      // 오늘 작성된 댓글
    popularKeywords: [       // 인기 키워드 (최근 게시글 기반)
      { keyword: '개발', count: 23 },
      { keyword: 'React', count: 18 },
      { keyword: 'Next.js', count: 15 }
    ]
  }
  ```
- [ ] 인기 키워드 추출 로직
  - 최근 게시글 제목에서 키워드 추출
  - 또는 태그 기반 (향후)
- [ ] 트렌드 섹션 UI 구현
  - `cc/src/components/dashboard/community-trends/`
- [ ] 실시간 업데이트 (선택)
  - 5분마다 자동 갱신
  - 또는 Socket으로 실시간

**참고 파일**:
```
cc/src/app/api/dashboard/
cc/src/app/(main)/page.tsx
```

---

### 3. 통계 카드 실시간 데이터 연동

**문서 설계 내용** (dashboard-page.md 참조):
- 게시글 수, 댓글 수, 받은 좋아요, 친구 수
- 주간 증감 표시 (+3, +12 등)

**현재 상태**:
- StatCard 컴포넌트 존재
- 목업 데이터 사용 중

**TODO**:
- [ ] 사용자 통계 API 응답에 증감 데이터 추가
  ```typescript
  {
    postCount: 23,
    postChange: 3,        // 이번 주 증가량
    commentCount: 156,
    commentChange: 12,
    likeCount: 342,
    likeChange: 28,
    friendCount: 12,
    friendChange: 2
  }
  ```
- [ ] StatCard에 실제 데이터 연동
- [ ] 증감 표시 UI (양수: 초록색, 음수: 빨간색)

**참고 파일**:
```
cc/src/components/dashboard/stat-card/
cc/src/app/api/dashboard/stats/route.ts
```

---

### 4. 인기 게시글 섹션 개선

**문서 설계 내용** (dashboard-page.md 참조):
- 기간별 필터 (오늘, 이번 주, 이번 달)
- 순위 표시
- 감정분석 결과 아이콘

**현재 상태**:
- PopularPosts 컴포넌트 존재
- 기간 필터 미완성

**TODO**:
- [ ] 기간 필터 연동
  - `GET /api/posts/popular?period=week`
- [ ] 순위 번호 및 랭킹 변동 표시 (선택)
- [ ] 감정분석 결과 아이콘 표시
  - 😊 긍정, 😐 중립, 😟 주의

**참고 파일**:
```
cc/src/components/dashboard/popular-posts/
cc/src/app/api/posts/popular/
```

---

### 5. 최근 활동 타임라인 개선

**문서 설계 내용** (dashboard-page.md 참조):
- 작성한 게시글, 댓글, 좋아요 기록
- 타임라인 형태 표시

**현재 상태**:
- RecentActivity 컴포넌트 존재
- 기본 구현됨

**TODO**:
- [ ] 활동 타입별 아이콘
  - 📝 게시글 작성
  - 💬 댓글 작성
  - ❤️ 좋아요
  - 👥 친구 추가
- [ ] 클릭 시 해당 페이지 이동
- [ ] "더보기" 페이지네이션 또는 무한 스크롤
- [ ] 상대 시간 표시 (3분 전, 1시간 전)

**참고 파일**:
```
cc/src/components/dashboard/recent-activity/
cc/src/app/api/dashboard/activity/
```

---

### 6. 알림 섹션 개선

**문서 설계 내용** (dashboard-page.md 참조):
- 읽음/안읽음 구분
- 클릭 시 해당 페이지 이동

**현재 상태**:
- Notification API 존재
- 대시보드 내 알림 섹션 기본 구현

**TODO**:
- [ ] 안읽음 알림 시각적 강조 (●)
- [ ] 알림 클릭 시 읽음 처리 및 이동
- [ ] "모두 읽음" 버튼
- [ ] 알림 타입별 아이콘
  - ❤️ 좋아요
  - 💬 댓글
  - 👥 친구 요청
  - 💬 채팅

**참고 파일**:
```
cc/src/app/api/notifications/
cc/src/hooks/use-realtime-notifications.ts
```

---

## 📝 문서 보완 필요 사항

### dashboard-page.md 보완 필요
- [ ] 차트 라이브러리 명시 (Recharts)
- [ ] 데이터 로딩 상태 UI 명세
- [ ] 에러 상태 UI 명세

### API 문서 보완 필요
- [ ] `GET /api/dashboard/trends` 엔드포인트 추가
- [ ] `GET /api/dashboard/stats` 응답 스키마 상세화
- [ ] 기간별 필터 파라미터 명세

---

## 📌 구현 순서 권장

1. 통계 카드 실시간 데이터 연동 (빠르게 완성)
2. 활동 통계 차트 데이터 연동
3. 커뮤니티 트렌드 API
4. 인기 게시글 기간 필터
5. 최근 활동 타임라인 개선
6. 알림 섹션 개선

---

**이전 문서**: [친구 관리 보완 작업](./04-friends-complement.md)  
**다음 문서**: [AI 감정분석 보완 작업](./06-ai-complement.md)
