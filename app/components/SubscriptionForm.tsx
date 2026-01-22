'use client';

import { useState } from 'react';

interface SubscriptionFormProps {
  onSubscribe: () => void;
}

export default function SubscriptionForm({ onSubscribe }: SubscriptionFormProps) {
  const [topic, setTopic] = useState('');
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
        body: JSON.stringify({ topic, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to add subscription');
      }

      setMessage('✓ تمت الإضافة بنجاح!');
      setTopic('');
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
      <h2>أضف موضوع جديد للمتابعة</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">
            الموضوع المراد تتبعه: *
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثال: ضربة أمريكا لإيران، علاج الربو، معايير ISO الجديدة"
            required
            dir="rtl"
          />
          <small>أدخل أي موضوع تريد متابعته (سياسة، صحة، تقنية، اقتصاد، إلخ)</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            وصف اختياري:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: أريد معرفة آخر التطورات حول هذا الموضوع"
            rows={3}
            dir="rtl"
          />
        </div>

        <button type="submit" disabled={loading || !topic.trim()}>
          {loading ? 'جاري الإضافة...' : '➕ إضافة للمتابعة'}
        </button>

        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>

      <div className="examples-box">
        <h3>أمثلة على المواضيع:</h3>
        <ul>
          <li>🌍 أحداث سياسية: "التوترات بين أمريكا وإيران"</li>
          <li>💊 اكتشافات طبية: "علاج جديد للربو"</li>
          <li>📊 معايير دولية: "معايير ISO الجديدة 2024"</li>
          <li>📈 اقتصاد: "أسعار النفط العالمية"</li>
          <li>⚽ رياضة: "انتقالات ريال مدريد"</li>
          <li>💻 تقنية: "إطلاق ChatGPT-5"</li>
        </ul>
      </div>
    </div>
  );
}
