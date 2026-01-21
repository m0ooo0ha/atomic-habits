'use client';

import { useState } from 'react';

interface SubscriptionFormProps {
  onSubscribe: () => void;
}

export default function SubscriptionForm({ onSubscribe }: SubscriptionFormProps) {
  const [type, setType] = useState<'player' | 'team'>('player');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to add subscription');
      }

      setMessage('✓ تمت الإضافة بنجاح!');
      setName('');
      onSubscribe();
    } catch (error) {
      setMessage('✗ خطأ في الإضافة. حاول مرة أخرى.');
      console.error('Error adding subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-form">
      <h2>إضافة متابعة جديدة</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>نوع المتابعة:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="player"
                checked={type === 'player'}
                onChange={(e) => setType(e.target.value as 'player')}
              />
              لاعب
            </label>
            <label>
              <input
                type="radio"
                value="team"
                checked={type === 'team'}
                onChange={(e) => setType(e.target.value as 'team')}
              />
              نادي
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            {type === 'player' ? 'اسم اللاعب:' : 'اسم النادي:'}
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'player' ? 'مثال: كريستيانو رونالدو' : 'مثال: ريال مدريد'}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading || !name.trim()}>
          {loading ? 'جاري الإضافة...' : 'إضافة متابعة'}
        </button>

        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
