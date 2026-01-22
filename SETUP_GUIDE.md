# 🚀 دليل الإعداد السريع

## الخطوة 1: الحصول على مفتاح Claude API

1. اذهب إلى [console.anthropic.com](https://console.anthropic.com/)
2. قم بالتسجيل أو تسجيل الدخول
3. اذهب إلى "API Keys"
4. انقر على "Create Key"
5. انسخ المفتاح (سيظهر مرة واحدة فقط!)

## الخطوة 2: إعداد ملف البيئة

قم بإنشاء ملف `.env.local` في جذر المشروع:

```bash
cp .env.example .env.local
```

ثم افتح `.env.local` وأضف:

```env
ANTHROPIC_API_KEY=sk-ant-xxxx...  # المفتاح من الخطوة 1
CRON_SECRET=my_super_secret_key_123  # أي نص عشوائي للحماية
```

## الخطوة 3: التشغيل المحلي

```bash
# تثبيت المكتبات (مرة واحدة فقط)
npm install

# تشغيل المشروع
npm run dev
```

افتح المتصفح على: http://localhost:3000

## الخطوة 4: الاختبار

### اختبار إضافة متابعة:
1. افتح الموقع
2. اختر "لاعب"
3. أدخل اسم لاعب مشهور (مثل: "محمد صلاح")
4. اضغط "إضافة متابعة"

### اختبار الفحص اليدوي:
```bash
# في terminal جديد
curl -X POST http://localhost:3000/api/check-transfers \
  -H "Authorization: Bearer my_super_secret_key_123"
```

يجب أن ترى نتيجة JSON تحتوي على حالة الفحص.

## الخطوة 5: النشر على Vercel

### إعداد GitHub
```bash
git init
git add .
git commit -m "Initial commit: Player transfer tracker"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### النشر
1. اذهب إلى [vercel.com](https://vercel.com)
2. قم بتسجيل الدخول بحساب GitHub
3. انقر "New Project"
4. اختر repository الخاص بك
5. في صفحة الإعدادات:
   - أضف Environment Variables:
     - `ANTHROPIC_API_KEY`: مفتاح Claude API
     - `CRON_SECRET`: نفس المفتاح السري
6. انقر "Deploy"

### بعد النشر
- الموقع سيكون متاحاً على رابط مثل: `your-app.vercel.app`
- الـ Cron Job سيعمل تلقائياً كل 30 دقيقة
- يمكنك فحص logs من Vercel Dashboard

## استكشاف الأخطاء

### خطأ: "ANTHROPIC_API_KEY is not set"
- تأكد من وجود ملف `.env.local`
- تأكد من نسخ المفتاح بشكل صحيح
- أعد تشغيل `npm run dev`

### خطأ: "Failed to fetch subscriptions"
- تأكد من وجود مجلد `data/` (سيتم إنشاؤه تلقائياً)
- تحقق من صلاحيات الكتابة

### خطأ: "API request failed"
- تأكد من صحة مفتاح API
- تأكد من وجود رصيد كافي في حساب Anthropic
- تحقق من الاتصال بالإنترنت

### الإشعارات لا تعمل
- اسمح للمتصفح بإرسال الإشعارات
- استخدم HTTPS (يعمل على localhost أو vercel)
- بعض المتصفحات تحظر الإشعارات افتراضياً

## نصائح مهمة

1. **استهلاك API**: كل فحص يستهلك من رصيد Claude API
   - مع 10 متابعات: ~10 طلبات كل 30 دقيقة
   - التكلفة التقريبية: ~$0.01-0.02 لكل 100 فحص

2. **تحسين التكاليف**:
   - تابع فقط اللاعبين/الأندية التي تهتم بها فعلاً
   - يمكنك تغيير مدة الفحص في `vercel.json`

3. **الأمان**:
   - لا تشارك `.env.local`
   - لا تنشر `ANTHROPIC_API_KEY` في GitHub
   - غيّر `CRON_SECRET` لمفتاح عشوائي قوي

## الدعم

إذا واجهت مشاكل، تحقق من:
- Console في متصفح الويب (F12)
- Terminal logs
- Vercel deployment logs

---

استمتع بتتبع انتقالات لاعبيك المفضلين! ⚽
