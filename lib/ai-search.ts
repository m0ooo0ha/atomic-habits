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
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

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
