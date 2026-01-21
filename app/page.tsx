'use client';

import { useEffect, useState } from 'react';
import SubscriptionForm from './components/SubscriptionForm';
import SubscriptionList from './components/SubscriptionList';
import NotificationBanner from './components/NotificationBanner';

interface Subscription {
  id: string;
  type: 'player' | 'team';
  name: string;
  lastStatus: string;
  lastChecked: string;
  createdAt: string;
}

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();

    // Check if notifications are supported and enabled
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1>⚽ متابع انتقالات اللاعبين</h1>
        <p className="subtitle">
          تتبع انتقالات لاعبيك وأنديتك المفضلة بالذكاء الاصطناعي
        </p>
        <div className="info-box">
          <p>
            🤖 يتم الفحص تلقائياً كل 30 دقيقة
          </p>
          <p>
            🔔 ستتلقى إشعاراً فقط عند حدوث انتقال جديد
          </p>
        </div>

        {!notificationsEnabled && (
          <button
            className="notification-request-btn"
            onClick={requestNotificationPermission}
          >
            🔔 تفعيل الإشعارات
          </button>
        )}
      </header>

      <NotificationBanner />

      <div className="content">
        <SubscriptionForm onSubscribe={fetchSubscriptions} />

        {loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : (
          <SubscriptionList
            subscriptions={subscriptions}
            onDelete={fetchSubscriptions}
          />
        )}
      </div>

      <footer className="footer">
        <p>
          مدعوم بالذكاء الاصطناعي Claude API
        </p>
      </footer>
    </main>
  );
}
