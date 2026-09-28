import { getLocale } from "@/lib/i18n";

export default async function TermsContentSection() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
            {isBn ? "সর্বশেষ সংস্করণ: মে ২০২৪" : "Last Revised: May 2024"}
          </span>
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "১. শর্তাবলী গ্রহণ" : "1. Acceptance of Terms"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "সেইফ এলপিজি প্ল্যাটফর্মে প্রবেশ, ব্রাউজ করা বা যেকোনো কোর্সে নথিভুক্ত করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলী, বিস্ফোরক আইন ১৮৮৪, গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ (সংশোধিত ২০০৪) এবং বিইআরসি সংবিধিবদ্ধ বিজ্ঞপ্তির দ্বারা আইনত বাধ্য হতে সম্মত হচ্ছেন। আপনি কোনো বিধানের সাথে সম্মত না হলে অবিলম্বে প্ল্যাটফর্ম ব্যবহার বন্ধ করতে হবে।"
              : "By accessing, browsing, or enrolling in any course provided on the Safe LPG platform, you agree to be legally bound by these Terms of Service, the Explosives Act 1884, Gas Cylinder Rules 1991 (amended 2004), and BERC statutory notifications. If you do not agree with any provision, you must discontinue platform use immediately."}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "২. সনদের বৈধতা ও নৈতিক আচরণ" : "2. Certificate Validity & Ethical Conduct"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "কোর্স সমাপ্তির সনদ কঠোরভাবে প্রতিটি শিক্ষার্থীর নিজস্ব অংশগ্রহণ এবং অফিসিয়াল মূল্যায়ন কুইজে ন্যূনতম ৮০% নম্বর অর্জনের ভিত্তিতে প্রদান করা হয়। নিম্নলিখিত আচরণগুলো সনদপত্র তাৎক্ষণিক বাতিল এবং নিয়ন্ত্রক কর্তৃপক্ষের কাছে প্রেরণের কারণ হিসেবে বিবেচিত হবে:"
              : "Certificates of completion are issued strictly based on individual learner engagement and successful attainment of an 80% threshold in official assessment quizzes. The following behaviors constitute grounds for immediate certificate revocation and referral to regulatory authorities:"}
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              {isBn
                ? "নিবন্ধনের সময় মিথ্যা বা জাল পরিচয় নথি জমা দেওয়া।"
                : "Submitting fraudulent identity documents during registration."}
            </li>
            <li>
              {isBn
                ? "ডিজিটাল যাচাইকরণ কিউআর কোড জালিয়াতি, পরিবর্তন বা অনুলিপি করার অপচেষ্টা।"
                : "Attempting to forge, falsify, or replicate digital verification QR codes."}
            </li>
            <li>
              {isBn
                ? "এলএমএস লেকচার ভিডিও এবং প্রযুক্তিগত নির্দেশিকা অননুমোদিত বাণিজ্যিক পুনঃবিতরণ বা বিক্রয়।"
                : "Unauthorized commercial redistribution or resale of LMS lecture videos and technical safety guides."}
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "৩. পরিচালন নিরাপত্তা ও জরুরি অস্বীকৃতি" : "3. Operational Safety & Emergency Disclaimer"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "আমাদের নির্দেশিকাসমূহ বর্তমান প্রকৌশল নীতি ও জাতীয় মান অনুসরণ করে তৈরি হলেও, এই প্রশিক্ষণ বিস্ফোরক অধিদপ্তর (DoE) বা ফায়ার সার্ভিস ও সিভিল ডিফেন্সের সংবিধিবদ্ধ পরিদর্শন বা লাইসেন্সের বিকল্প নয়। সক্রিয় গ্যাস লিকেজ বা অগ্নিকাণ্ডে সর্বদা মানুষের জীবন রক্ষাকে অগ্রাধিকার দিয়ে অবিলম্বে নিরাপদ স্থানে সরে যান এবং জাতীয় জরুরি হেল্পলাইন ১৬১৩৭-এ কল করুন।"
              : "While our guidelines reflect current best practices and national engineering codes, training completion does not substitute for on-site statutory inspections conducted by the Department of Explosives (DoE) or Fire Service & Civil Defense. In active gas leak emergencies, prioritize human life, evacuate immediately, and dial emergency telephone 16137."}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "৪. সাবস্ক্রিপশন বিলিং ও রিফান্ড নীতি" : "4. Subscription Billing & Refunds"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "বাণিজ্যিক ডিলার পোর্টাল বা প্রিমিয়াম সাবস্ক্রিপশনের পেমেন্ট অগ্রিম মাসিক বা বার্ষিক ভিত্তিতে গৃহীত হয়। কোনো প্রাতিষ্ঠানিক সনদ ইস্যু না হয়ে থাকলে প্রাথমিক ক্রয়ের ৭ দিনের মধ্যে রিফান্ডের আবেদন করা যাবে।"
              : "Subscriptions for commercial dealer portals or household plus features are billed in advance on a monthly or annual recurring basis. Unused periods are refundable within 7 days of initial purchase provided no formal certification has been generated or issued."}
          </p>
        </div>
      </div>
    </section>
  );
}
