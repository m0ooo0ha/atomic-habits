export interface NewsInfo {
  hasNews: boolean;
  topic: string;
  newsTitle: string;
  newsDate: string;
  summary: string;
  details: string;
  source: string;
  importance: 'عاجل' | 'مهم' | 'عادي';
  currentStatus: string;
}

export async function searchNewsUpdates(topic: string): Promise<NewsInfo> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set');
  }

  const prompt = `ابحث عن آخر الأخبار والتطورات حول الموضوع التالي: "${topic}"

       هل هناك أخبار جديدة أو تطورات حديثة (خلال آخر 48 ساعة) حول هذا الموضوع؟

       أمثلة للمواضيع:
       - أحداث سياسية (مثل: الصراعات، الاتفاقيات)
       - اكتشافات طبية (مثل: علاجات جديدة، لقاحات)
       - معايير دولية جديدة
       - أحداث اقتصادية مهمة
       - أي موضوع آخر

       أعطني المعلومات التالية:
       - عنوان الخبر
       - تاريخ الخبر
       - ملخص قصير
       - تفاصيل كاملة
       - المصدر (إن وجد)
       - مستوى الأهمية (عاجل/مهم/عادي)
       - الحالة الحالية للموضوع

       أجب بصيغة JSON فقط بهذا الشكل:
       {
         "hasNews": true/false,
         "topic": "الموضوع",
         "newsTitle": "عنوان الخبر",
         "newsDate": "تاريخ الخبر",
         "summary": "ملخص قصير",
         "details": "التفاصيل الكاملة",
         "source": "المصدر",
         "importance": "عاجل أو مهم أو عادي",
         "currentStatus": "الحالة الحالية"
       }`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const result: NewsInfo = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('AI search error:', error);
    return {
      hasNews: false,
      topic: topic,
      newsTitle: '',
      newsDate: '',
      summary: '',
      details: '',
      source: '',
      importance: 'عادي',
      currentStatus: 'خطأ في البحث - سيتم المحاولة مرة أخرى لاحقاً',
    };
  }
}
