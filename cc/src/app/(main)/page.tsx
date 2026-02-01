import { redirect } from 'next/navigation';

export default function MainPage() {
  // 메인 페이지는 게시판으로 리다이렉트
  redirect('/board');
}
