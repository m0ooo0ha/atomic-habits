'use client';

import { useState } from 'react';

interface Subscription {
  id: string;
  type: 'player' | 'team';
  name: string;
  lastStatus: string;
  lastChecked: string;
  createdAt: string;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onDelete: () => void;
}

export default function SubscriptionList({ subscriptions, onDelete }: SubscriptionListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المتابعة؟')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/subscriptions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscription');
      }

      onDelete();
    } catch (error) {
      alert('خطأ في الحذف. حاول مرة أخرى.');
      console.error('Error deleting subscription:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <p>لا توجد متابعات حالياً</p>
        <p className="hint">أضف لاعباً أو نادياً للبدء في متابعة الانتقالات</p>
      </div>
    );
  }

  return (
    <div className="subscription-list">
      <h2>متابعاتك ({subscriptions.length})</h2>
      <div className="list">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="subscription-card">
            <div className="card-header">
              <div className="name-section">
                <span className={`badge ${sub.type}`}>
                  {sub.type === 'player' ? '👤 لاعب' : '⚽ نادي'}
                </span>
                <h3>{sub.name}</h3>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(sub.id)}
                disabled={deleting === sub.id}
              >
                {deleting === sub.id ? '...' : '🗑️'}
              </button>
            </div>

            <div className="card-body">
              <div className="info-row">
                <span className="label">آخر حالة:</span>
                <span className="value">{sub.lastStatus}</span>
              </div>
              <div className="info-row">
                <span className="label">آخر فحص:</span>
                <span className="value">{formatDate(sub.lastChecked)}</span>
              </div>
              <div className="info-row">
                <span className="label">تاريخ الإضافة:</span>
                <span className="value">{formatDate(sub.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
