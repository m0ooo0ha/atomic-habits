export interface TransferInfo {
  hasTransfer: boolean;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  transferDate: string;
  details: string;
  currentStatus: string;
}

export async function searchTransferNews(name: string, type: 'player' | 'team'): Promise<TransferInfo> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set');
  }

  const prompt = type === 'player'
    ? `ابحث عن آخر أخبار انتقالات اللاعب "${name}".
       هل تم انتقال هذا اللاعب مؤخراً (خلال آخر 7 أيام)؟
       إذا كان هناك انتقال، أعطني التفاصيل التالية بدقة:
       - اسم اللاعب
       - النادي السابق
       - النادي الجديد
       - تاريخ الانتقال
       - تفاصيل الصفقة (مبلغ الانتقال، مدة العقد، إلخ)

       إذا لم يكن هناك انتقال حديث، قل "لا يوجد انتقال" واذكر الحالة الحالية للاعب.

       أجب بصيغة JSON فقط بهذا الشكل:
       {
         "hasTransfer": true/false,
         "playerName": "اسم اللاعب",
         "fromTeam": "النادي السابق",
         "toTeam": "النادي الجديد",
         "transferDate": "تاريخ الانتقال",
         "details": "تفاصيل الصفقة",
         "currentStatus": "الحالة الحالية"
       }`
    : `ابحث عن آخر أخبار انتقالات نادي "${name}".
       هل قام النادي بضم أو بيع لاعبين مؤخراً (خلال آخر 7 أيام)؟
       إذا كان هناك انتقالات، أعطني تفاصيل أحدث انتقال:
       - اسم اللاعب
       - هل هو قادم للنادي أم مغادر
       - النادي الآخر المعني
       - تاريخ الانتقال
       - تفاصيل الصفقة

       إذا لم يكن هناك انتقالات حديثة، قل "لا يوجد انتقالات" واذكر آخر الأخبار عن النادي.

       أجب بصيغة JSON فقط بهذا الشكل:
       {
         "hasTransfer": true/false,
         "playerName": "اسم اللاعب",
         "fromTeam": "النادي السابق",
         "toTeam": "النادي الجديد",
         "transferDate": "تاريخ الانتقال",
         "details": "تفاصيل الصفقة",
         "currentStatus": "الحالة الحالية للنادي"
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

    const result: TransferInfo = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('AI search error:', error);
    return {
      hasTransfer: false,
      playerName: name,
      fromTeam: '',
      toTeam: '',
      transferDate: '',
      details: '',
      currentStatus: 'خطأ في البحث - سيتم المحاولة مرة أخرى',
    };
  }
}
