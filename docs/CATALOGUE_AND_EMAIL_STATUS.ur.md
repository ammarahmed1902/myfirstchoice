> 14 نومبر 2026: فارم اب Formspree (`myewknly`) کو براہ راست submit کرتا ہے۔ نیچے Resend/SMTP کی پرانی وضاحت تاریخی ہے۔ موجودہ طریقے اور وصول کنندہ کی تصدیق کے لیے `EMAIL_SETUP.md` دیکھیں۔

# کیٹلاگ اور ای میل کی موجودہ صورتِ حال

13 نومبر 2026

## پروڈکٹس

ہوم پیج اور `/shop` ایک ہی `approvedProducts` فہرست (`lib/homepage-content.ts`) اور ایک ہی `ProductShowcaseCard` استعمال کرتے ہیں۔ پرانے `components/catalogue.tsx` کو بھی اسی مشترکہ کیٹلاگ کا alias بنا دیا گیا ہے؛ اس میں اب الگ، پرانی پروڈکٹ فہرست یا خریداری کے فلٹرز نہیں ہیں۔

دونوں صفحات پر یہی چار پروڈکٹس ہیں:

- 4-in-1 Nylon-Braided Cable
- USB-C to Lightning Cable — White · 2 metre
- Compact Car Charger
- Aluminium RFID Card Holder

USB-C to USB-C کی منظور شدہ تصویر موجود نہیں، اس لیے اسے کسی بھی پروڈکٹ گرڈ میں شامل نہیں کیا گیا۔ دستیاب وضاحت اور variation کی معلومات دونوں جگہ ایک ہی ڈیٹا سے آتی ہیں۔

Cloud environment شائع کرنا، Git میں تبدیلیاں commit/push کرنا، اور Vercel کی ویب سائٹ deploy کرنا الگ مراحل ہیں۔ اس کام میں Vercel deployment نہیں کی گئی۔ لائیو سائٹ تک درخواست کو cloud proxy نے 403 سے روکا، اس لیے لائیو ورژن پر پرانی مصنوعات موجود ہونے کی تصدیق یا تردید نہیں کی جا سکتی۔ لائیو فرق برقرار ہو تو درست Vercel project/branch کے تازہ deployment کی جانچ ضروری ہے۔

## انکوائری ای میل

`the verified Formspree notification recipient` بیک اینڈ کا مقررہ وصول کنندہ ہے۔ لیکن صرف وصول کنندہ لکھنا ای میل بھیجنے کے لیے کافی نہیں۔ موجودہ endpoint Resend اور shared rate limiting کے لیے Upstash استعمال کرنے کے لیے تیار ہے؛ متعلقہ چار environment variables اس cloud process میں موجود نہیں۔ کوئی حقیقی میل یا inbox receipt اس کام میں ثابت نہیں ہوئی۔

### بغیر email API کے آپشن

Gmail SMTP کے ذریعے server-side میل بھیجی جا سکتی ہے۔ اس میں email API key کی بجائے SMTP authentication درکار ہوتی ہے۔ اہل Google account میں 2-Step Verification اور App Password درکار ہو سکتے ہیں؛ بعض organisation/security settings میں App Passwords دستیاب نہیں ہوتے۔ Gmail کی sending limits اور anti-abuse قواعد لاگو ہوتے ہیں۔ عام Gmail password کو کوڈ یا چیٹ میں نہ دیں۔ یہ SMTP راستہ ابھی اس کوڈ میں نافذ نہیں، اور موجودہ Resend endpoint خود بخود SMTP استعمال نہیں کرے گا۔

### مفت سروس کا آپشن

مفت allowance رکھنے والی transactional email یا hosted-form سروس استعمال ہو سکتی ہے۔ موجودہ Resend integration دوبارہ استعمال کرنے کے لیے اس کے موجودہ مفت plan، sending limits اور verified sender/domain کی شرائط چیک کرنا ہوں گی۔ کسی موجودہ plan کی مقدار یا قیمت اس کام میں verify نہیں کی گئی۔ Hosted-form طریقے میں سروس کی email verification اور privacy review بھی ضروری ہے۔

### مکمل credentials کے بغیر

`mailto:` رابطہ پہلے سے دستیاب ہے۔ یہ صارف کی email application کھولتا ہے؛ فارم جمع ہونے کے بعد خودکار server-side delivery نہیں کرتا اور inbox receipt کی ضمانت نہیں دیتا۔ خودکار میل کے لیے کسی SMTP account یا email/form service کی ترتیب ضروری ہے۔

موجودہ فارم کو کسی نئی سروس پر منتقل نہیں کیا گیا۔ Resend کی تیاری، fixed recipient، validation اور spam/duplicate controls برقرار ہیں۔ نئی credentials صرف محفوظ environment settings میں درج کی جائیں؛ چیٹ یا repository میں نہیں۔
