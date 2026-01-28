export interface TransferInfo {
  hasTransfer: boolean;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  transferType: 'انتقال دائم' | 'إعارة' | 'انتقال حر' | 'تجديد عقد';
  transferFee: string;
  contractLength: string;
  transferDate: string;
  details: string;
  source: string;
  importance: 'عاجل' | 'مهم' | 'عادي';
  currentStatus: string;
}

export async function searchPlayerTransfers(playerOrTeamName: string, type: 'player' | 'team'): Promise<TransferInfo> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set');
  }

  const prompt = type === 'player'
    ? `ابحث عن آخر أخبار انتقالات اللاعب: "${playerOrTeamName}"

       هل هناك أخبار انتقال جديدة أو شائعات انتقال قوية (خلال آخر 7 أيام) حول هذا اللاعب؟

       أبحث عن:
       - انتقال دائم إلى نادي جديد
       - إعارة إلى نادي آخر
       - انتقال حر (Free Transfer)
       - تجديد عقد مع النادي الحالي
       - شائعات انتقال قوية من مصادر موثوقة

       أعطني المعلومات التالية بدقة:
       - اسم اللاعب
       - الفريق المنتقل منه (إن وجد)
       - الفريق المنتقل إليه
       - نوع الانتقال (انتقال دائم، إعارة، انتقال حر، تجديد عقد)
       - قيمة الصفقة (بالمليون يورو أو مجاني)
       - مدة العقد (مثال: 4 سنوات)
       - تاريخ الانتقال أو تاريخ الإعلان
       - تفاصيل إضافية مهمة
       - المصدر (إن وجد)
       - مستوى الأهمية (عاجل/مهم/عادي)
       - الحالة الحالية (تم رسمياً، قيد التفاوض، شائعة قوية)

       أجب بصيغة JSON فقط بهذا الشكل:
       {
         "hasTransfer": true/false,
         "playerName": "اسم اللاعب",
         "fromTeam": "الفريق المنتقل منه",
         "toTeam": "الفريق المنتقل إليه",
         "transferType": "انتقال دائم أو إعارة أو انتقال حر أو تجديد عقد",
         "transferFee": "قيمة الصفقة",
         "contractLength": "مدة العقد",
         "transferDate": "تاريخ الانتقال",
         "details": "التفاصيل الإضافية",
         "source": "المصدر",
         "importance": "عاجل أو مهم أو عادي",
         "currentStatus": "الحالة الحالية"
       }`
    : `ابحث عن آخر انتقالات نادي: "${playerOrTeamName}"

       هل هناك انتقالات جديدة (قادمة أو مغادرة) خلال آخر 7 أيام لهذا النادي؟

       أعطني المعلومات بصيغة JSON:
       {
         "hasTransfer": true/false,
         "playerName": "اسم اللاعب",
         "fromTeam": "الفريق المنتقل منه",
         "toTeam": "الفريق المنتقل إليه",
         "transferType": "انتقال دائم أو إعارة أو انتقال حر أو تجديد عقد",
         "transferFee": "قيمة الصفقة",
         "contractLength": "مدة العقد",
         "transferDate": "تاريخ الانتقال",
         "details": "التفاصيل الإضافية",
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

    const result: TransferInfo = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('AI search error:', error);
    return {
      hasTransfer: false,
      playerName: playerOrTeamName,
      fromTeam: '',
      toTeam: '',
      transferType: 'انتقال دائم',
      transferFee: '',
      contractLength: '',
      transferDate: '',
      details: '',
      source: '',
      importance: 'عادي',
      currentStatus: 'خطأ في البحث - سيتم المحاولة مرة أخرى لاحقاً',
    };
  }
}
