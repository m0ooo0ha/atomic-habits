'use client';

import { useEffect, useState } from 'react';

interface Transfer {
  id: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  date: string;
  details: string;
}

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState<Transfer[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);

          // Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted' && data.length > 0) {
            data.forEach((transfer: Transfer) => {
              if (!dismissed.has(transfer.id)) {
                new Notification('⚽ انتقال جديد!', {
                  body: `${transfer.playerName}\n${transfer.fromTeam} ← ${transfer.toTeam}`,
                  icon: '/icon-192x192.svg',
                  badge: '/icon-96x96.svg',
                  tag: `transfer-${transfer.id}`,
                  requireInteraction: false,
                  silent: false,
                });
              }
            });
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Check for new notifications every 2 minutes
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const activeNotifications = notifications.filter(n => !dismissed.has(n.id));

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-banner">
      {activeNotifications.map((notification) => (
        <div key={notification.id} className="notification">
          <div className="notification-content">
            <div className="notification-title">
              🔔 انتقال جديد!
            </div>
            <div className="notification-body">
              <strong>{notification.playerName}</strong>
              <div className="transfer-info">
                <span className="from">{notification.fromTeam}</span>
                <span className="arrow">←</span>
                <span className="to">{notification.toTeam}</span>
              </div>
              {notification.details && (
                <div className="details">{notification.details}</div>
              )}
              {notification.date && (
                <div className="date">📅 {notification.date}</div>
              )}
            </div>
          </div>
          <button
            className="dismiss-btn"
            onClick={() => handleDismiss(notification.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
