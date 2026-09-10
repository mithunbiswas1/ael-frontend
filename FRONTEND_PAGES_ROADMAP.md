# LPG Safety & Awareness Platform — Frontend Pages Roadmap & Checklist

> এই ডকুমেন্টে প্রজেক্টের **কোর ফ্রন্ট প্যানেল (Public & Learner Facing)** এর সমস্ত পেজের বর্তমান স্ট্যাটাস, রুট (Routes), এবং ফিচারসমূহ হালনাগাদ করা হলো।

---

## ১. সম্পূর্ণ বাস্তবায়িত পেজসমূহ (All 17 Completed Pages ✅)

নিচের সমস্ত পেজ হোম পেজ আর্কিটেকচার, ডিজাইন টোকেন (`rounded-xl` কার্ড, `rounded-lg` ইনপুট/বাটন, `rounded-full` ব্যাজ) ও মডুলার কম্পোনেন্ট (`AmbientGlow`, `Breadcrumb`, `Input`, `Select`, `SectionHeader`) বজায় রেখে সম্পূর্ণ প্রস্তুত করা হয়েছে:

| # | Page Name | Route | Status | Key Features |
| :-: | :--- | :--- | :-: | :--- |
| 1 | **Home Page** | `/` | ✅ Done | Hero Banner, Metrics Bar, Stakeholder Guidelines, Market Updates, Blog Feed, Featured Training, Newsletter, Emergency Hotline Bar |
| 2 | **About Us** | `/about` | ✅ Done | Hero Banner with AmbientGlow & Breadcrumb, Who We Are, Core Mission & Vision, 5 Expert Trainers (Consultant Pool), Impact Stats |
| 3 | **Safety Guidelines** | `/safety-guidelines` | ✅ Done | ৫টি স্টেকহোল্ডার ট্যাব (Dealers, Distributors, Auto Gas, Industrial, Regular Consumers), Global Standards, Regulatory Agency কার্ডস, Downloads টেবিল |
| 4 | **LPG Market Updates** | `/market-updates` | ✅ Done | Incident Reports রিয়েল-টাইম ফিল্টার ও টেবিল, Inquiry Reports, BERC প্রাইস সার্কুলার কার্ড, Stakeholder ৪টি মিনি-ট্যাব ও Global Price Feed |
| 5 | **Incident Detail Page** | `/market-updates/[slug]` | ✅ Done | নির্দিষ্ট ঘটনার ফরেনসিক রিপোর্ট, ক্ষয়ক্ষতি নিরূপণ, অনুসন্ধান ডসিয়ার ও প্রতিরোধমূলক নির্দেশিকা (CAPA) |
| 6 | **Training & Quiz Catalog** | `/courses` | ✅ Done | ক্যাটাগরি ফিল্টার, সার্চ বার, কোর্স কার্ডস (Enroll/Buy Now লিঙ্কড), How It Works, অ্যাক্টিভ লার্নিং প্রগ্রেস বার |
| 7 | **Course Details & Curriculum** | `/courses/[id]` | ✅ Done | কোর্সের ওভারভিউ, লার্নিং আউটকামস, মডিউল সিলেবাস, ইন্সট্রাক্টর প্রোফাইল, স্টিকি এনরোলমেন্ট অ্যাকশন কার্ড |
| 8 | **Learning Classroom Player** | `/courses/learn/[courseId]` | ✅ Done | ফুল স্ক্রিন ভিডিও প্লেয়ার, ডানপাশে লেসন প্লেলিস্ট, লেকচার নোটস, ডাউনলোডযোগ্য পিডিএফ এবং কুইজ গেটওয়ে |
| 9 | **Interactive Quiz Engine** | `/courses/[id]/quiz` | ✅ Done | ১০ মিনিটের কাউন্টডাউন টাইমার, ৫টি র্যান্ডমাইজড এমসিকিউ, ইনস্ট্যান্ট স্কোরিং (৮০% পাস মার্ক), বিস্তারিত উত্তর বিশ্লেষণ |
| 10 | **Certificate Verification** | `/verify-certificate` | ✅ Done | কেন্দ্রীয় ডিজিটাল ভেরিফিকেশন পোর্টাল, সার্টিফিকেট আইডি সার্চ, অফিশিয়াল ক্রেডেনশিয়াল কার্ড ও সার্টিফাইড পিডিএফ |
| 11 | **Pricing & Subscription** | `/pricing` & `/subscription` | ✅ Done | ৪টি টায়ার প্ল্যান কার্ড (Public Free, Household Plus, Licensed Dealer Pro, Industrial Enterprise), মান্থলি/অ্যানুয়াল ২০% ডিসকাউন্ট টগল |
| 12 | **Secure Checkout Gateway** | `/checkout` | ✅ Done | অর্ডার সামারি, ভ্যাট ক্যালকুলেশন, bKash/Nagad/Cards পেমেন্ট মেথড, টার্মস এগ্রিমেন্ট এবং ইনস্ট্যান্ট এক্টিভেশন |
| 13 | **Related Acts & Rules** | `/acts-and-rules` | ✅ Done | বিস্ফোরক আইন ১৮৮৪, গ্যাস সিলিন্ডার রুলস ১৯৯১/২০০৪, BERC আইন, ফায়ার সার্ভিস বিধিমালা ও গেজেট পিডিএফ ডাউনলোড |
| 14 | **FAQ & Help Center** | `/faq` | ✅ Done | ক্যাটাগরি অনুযায়ী কলাপসিবল অ্যাকর্ডিয়ান, সার্চ বার, গ্যাস লিকেজ সেফটি প্রটোকল ও হেল্পলাইন গাইড |
| 15 | **Privacy Policy** | `/privacy` | ✅ Done | ডাটা প্রটেকশন প্রিন্সিপালস, লার্নার কনফিডেনশিয়ালিটি, এনক্রিপশন ও কমপ্লায়েন্স সেল পরিচিতি |
| 16 | **Terms of Service** | `/terms` | ✅ Done | প্ল্যাটফর্ম ব্যবহারের শর্তাবলী, সার্টিফিকেট ইস্যুর নৈতিক আচরণবিধি ও রিফান্ড নীতিমালা |
| 17 | **Blog Feed & Single** | `/blogs` & `/blogs/[slug]` | ✅ Done | ৩-কলাম ব্লগ গ্রিড, ক্যাটাগরি ও সর্ট ফিল্টার, সিঙ্গেল ব্লগে ভিডিও মডাল, কমেন্টস ও রিলেটেড আর্টিকেলস |
| 18 | **Contact Us** | `/contact` | ✅ Done | ডিরেক্ট ইনকোয়ারি ফর্ম, গুগল ম্যাপস এম্বেড, ২৪/৭ হটলাইন ১৬১৩৭ ব্যাজ ও সোশ্যাল মিডিয়া লিঙ্কস |
| 19 | **Authentication Flow** | `/login`, `/registration`, `/otp-verify` | ✅ Done | সাইন ইন, রেজিস্ট্রেশন ও ৪ ডিজিটের ওটিপি ভেরিফিকেশন স্ক্রিন |

---

## ২. ডিজাইন নির্দেশিকা ও মানদণ্ড (Design Standards Compliance)

- **Border Radius:**
  - কার্ড, কন্টেইনার, মডাল, টেবিল: `rounded-xl`
  - বাটন, ইনপুট, সিলেক্ট, সার্চ ড্রপডাউন: `rounded-lg`
  - স্ট্যাটাস ব্যাজ, পিল ট্যাগ: `rounded-full`
- **Standard Components:**
  - `<AmbientGlow />`
  - `<Breadcrumb />`
  - `<SectionHeader />`
  - `<Input />`, `<Select />`, `<Textarea />`
- **Typography & Styling:**
  - `<H1>`, `<H2>`, `<H3>`, `<H4>`, `<P>`
  - নো `translate-y` বা অপ্রয়োজনীয় ইমেজ স্কেলিং।
  - সব পেজে সম্পূর্ণ রেসপনসিভ গ্রিড ও অপ্টিমাইজড ভিউ।
