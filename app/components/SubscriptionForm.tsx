'use client';

import { useState } from 'react';

interface SubscriptionFormProps {
  onSubscribe: () => void;
}

export default function SubscriptionForm({ onSubscribe }: SubscriptionFormProps) {
  const [type, setType] = useState<'player' | 'team'>('player');
  const [name, setName] = useState('');
  const [league, setLeague] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
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
        body: JSON.stringify({ type, name, league, position, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to add subscription');
      }

      setMessage('✓ تمت الإضافة بنجاح!');
      setName('');
      setLeague('');
      setPosition('');
      setDescription('');
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
      <h2>⚽ تتبع انتقالات اللاعبين</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">
            نوع المتابعة: *
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'player' | 'team')}
            dir="rtl"
          >
            <option value="player">⚽ لاعب</option>
            <option value="team">🏆 فريق</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            {type === 'player' ? 'اسم اللاعب:' : 'اسم الفريق:'} *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'player' ? 'مثال: محمد صلاح، كريستيانو رونالدو' : 'مثال: ريال مدريد، مانشستر يونايتد'}
            required
            dir="rtl"
          />
        </div>

        <div className="form-group">
          <label htmlFor="league">
            الدوري (اختياري):
          </label>
          <input
            type="text"
            id="league"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            placeholder="مثال: الدوري الإنجليزي، الدوري الإسباني"
            dir="rtl"
          />
        </div>

        {type === 'player' && (
          <div className="form-group">
            <label htmlFor="position">
              المركز (اختياري):
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="مثال: مهاجم، وسط، مدافع، حارس"
              dir="rtl"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">
            ملاحظات (اختياري):
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: أريد معرفة أخبار انتقاله إلى الدوري السعودي"
            rows={3}
            dir="rtl"
          />
        </div>

        <button type="submit" disabled={loading || !name.trim()}>
          {loading ? 'جاري الإضافة...' : '➕ إضافة للمتابعة'}
        </button>

        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>

      <div className="examples-box">
        <h3>أمثلة على اللاعبين والفرق:</h3>
        <ul>
          <li>⚽ لاعبين: محمد صلاح، كريستيانو رونالدو، نيمار، مبابي</li>
          <li>🏆 فرق: ريال مدريد، برشلونة، الأهلي، النصر، الهلال</li>
          <li>🌍 دوريات: الدوري الإنجليزي، الدوري السعودي، دوري أبطال أوروبا</li>
        </ul>
      </div>
    </div>
  );
}
