# ⚽ متابع انتقالات اللاعبين بالذكاء الاصطناعي

نظام متكامل لتتبع انتقالات اللاعبين والأندية باستخدام الذكاء الاصطناعي من DeepSeek.

## ✨ المميزات

- 🔍 **بحث ذكي**: يستخدم DeepSeek AI للبحث عن آخر أخبار الانتقالات
- ⏰ **فحص تلقائي**: يتم فحص الانتقالات تلقائياً كل 30 دقيقة
- 🔔 **إشعارات فورية**: تلقي إشعارات فقط عند حدوث انتقالات جديدة
- 👤 **متابعة اللاعبين**: تابع لاعبيك المفضلين
- ⚽ **متابعة الأندية**: تابع انتقالات ناديك المفضل
- 📱 **واجهة عربية**: تصميم عصري وسهل الاستخدام باللغة العربية

## 🚀 البدء السريع

### 1. المتطلبات

- Node.js 18 أو أحدث
- مفتاح API من DeepSeek
- حساب Vercel مع Vercel KV (للنشر)

### 2. التثبيت

```bash
# تثبيت المكتبات
npm install

# إنشاء ملف المتغيرات البيئية
cp .env.example .env.local
```

### 3. إعداد المتغيرات البيئية

افتح ملف `.env.local` وأضف المفاتيح التالية:

```env
# مفتاح DeepSeek API
# احصل عليه من: https://platform.deepseek.com/
DEEPSEEK_API_KEY=your_api_key_here

# مفتاح سري لحماية endpoint الفحص التلقائي
CRON_SECRET=your_random_secret_here

# Vercel KV (للنشر على Vercel فقط)
KV_REST_API_TOKEN=your_kv_token
KV_REST_API_URL=your_kv_url
```

### 4. تشغيل المشروع

```bash
# وضع التطوير
npm run dev

# البناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

## 📖 كيفية الاستخدام

### إضافة متابعة جديدة

1. اختر نوع المتابعة (لاعب أو نادي)
2. أدخل اسم اللاعب أو النادي
3. اضغط على "إضافة متابعة"

### تفعيل الإشعارات

اضغط على زر "تفعيل الإشعارات" في أعلى الصفحة للحصول على إشعارات المتصفح عند حدوث انتقالات.

### الفحص التلقائي

النظام يفحص تلقائياً كل 30 دقيقة. يمكنك أيضاً فحص يدوياً عن طريق:

```bash
curl -X POST http://localhost:3000/api/check-transfers \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🌐 النشر على Vercel

### 1. رفع المشروع على GitHub

```bash
git add .
git commit -m "Initial commit: Player transfer tracker"
git push origin main
```

### 2. النشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. استورد المشروع من GitHub
3. أضف قاعدة بيانات Vercel KV
4. أضف المتغيرات البيئية:
   - `DEEPSEEK_API_KEY`
   - `CRON_SECRET`
   - `KV_REST_API_TOKEN` (تلقائي من Vercel KV)
   - `KV_REST_API_URL` (تلقائي من Vercel KV)
5. انشر المشروع

الـ Cron Job سيعمل تلقائياً على Vercel كل 30 دقيقة!

## 🔧 البنية التقنية

```
atomic-habits/
├── app/
│   ├── api/
│   │   ├── subscriptions/      # إدارة المتابعات
│   │   ├── check-transfers/    # فحص الانتقالات (Cron)
│   │   └── notifications/      # جلب الإشعارات
│   ├── components/
│   │   ├── SubscriptionForm.tsx     # نموذج إضافة متابعة
│   │   ├── SubscriptionList.tsx     # قائمة المتابعات
│   │   └── NotificationBanner.tsx   # عرض الإشعارات
│   ├── globals.css              # التنسيقات
│   ├── layout.tsx               # القالب الرئيسي
│   └── page.tsx                 # الصفحة الرئيسية
├── lib/
│   ├── storage.ts               # نظام تخزين البيانات (Vercel KV)
│   └── ai-search.ts             # البحث بالذكاء الاصطناعي (DeepSeek)
├── public/
│   ├── manifest.json            # PWA Manifest
│   ├── sw.js                    # Service Worker
│   └── icon-*.png               # أيقونات PWA
├── vercel.json                  # إعدادات Vercel Cron
└── package.json
```

## 🤖 كيف يعمل النظام؟

1. **الإضافة**: تضيف لاعباً أو نادياً للمتابعة
2. **الفحص التلقائي**: كل 30 دقيقة:
   - يستخدم DeepSeek AI للبحث عن أخبار الانتقالات
   - يقارن النتائج الجديدة بالحالة السابقة
   - يسجل الانتقالات الجديدة في Vercel KV
3. **الإشعارات**: عند وجود انتقال جديد:
   - يظهر banner في الموقع
   - يرسل إشعار متصفح (إذا كان مفعلاً)

## 📝 ملاحظات مهمة

- النظام يتحقق من الانتقالات خلال آخر 7 أيام فقط
- تحتاج إلى رصيد كافٍ في حساب DeepSeek API
- الإشعارات تعمل فقط في المتصفحات التي تدعمها
- البيانات تُخزن في Vercel KV (سحابياً)

## 🔐 الأمان

- استخدم `CRON_SECRET` قوي لحماية endpoint الفحص
- لا تشارك مفتاح `DEEPSEEK_API_KEY`
- أضف `.env.local` إلى `.gitignore`

## 🆘 المساعدة والدعم

إذا واجهت أي مشاكل:

1. تأكد من صحة مفتاح DeepSeek API
2. تأكد من تثبيت جميع المكتبات
3. تأكد من إعداد Vercel KV بشكل صحيح
4. راجع console للأخطاء

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الحر.

---

صُنع بـ ❤️ باستخدام Next.js و DeepSeek AI
