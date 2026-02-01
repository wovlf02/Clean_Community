'use client';

import { FileText, MessageCircle, Heart, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RelativeTime } from '@/components/common/relative-time';
import { recentActivities, type Activity } from '@/mocks/dashboard';
import './recent-activity.css';

const iconMap: Record<Activity['type'], { icon: typeof FileText; className: string }> = {
  post: { icon: FileText, className: 'recent-activity__icon--post' },
  comment: { icon: MessageCircle, className: 'recent-activity__icon--comment' },
  like: { icon: Heart, className: 'recent-activity__icon--like' },
  friend: { icon: Users, className: 'recent-activity__icon--friend' },
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          최근 활동
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="recent-activity__list">
          {recentActivities.map((activity) => {
            const { icon: Icon, className } = iconMap[activity.type];

            return (
              <div key={activity.id} className="recent-activity__item">
                <div className={`recent-activity__icon ${className}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="recent-activity__content">
                  <p className="recent-activity__title">{activity.title}</p>
                  <p className="recent-activity__desc">{activity.description}</p>
                </div>
                <RelativeTime date={activity.createdAt} className="recent-activity__time" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
