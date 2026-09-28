import { getLocale } from "@/lib/i18n";

export default async function PrivacyContentSection() {
  const locale = await getLocale();
  const isBn = locale === "bn";

  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
            {isBn ? "কার্যকর তারিখ: ১ মে, ২০২৪" : "Effective Date: May 1, 2024"}
          </span>
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "১. যেসকল তথ্য আমরা সংগ্রহ করি" : "1. Information We Collect"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "প্রত্যয়িত এলপিজি নিরাপত্তা শিক্ষা প্রদান, জাতীয় দুর্ঘটনা রেজিস্ট্রি সংরক্ষণ এবং সংবিধিবদ্ধ ডিলার লাইসেন্স যাচাইকরণের সুবিধার্থে আমরা প্রয়োজনীয় তথ্য সংগ্রহ করি:"
              : "We collect information to facilitate certified LPG safety education, maintain national incident registries, and authenticate regulatory dealer licenses:"}
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              <strong>{isBn ? "শিক্ষার্থীর অ্যাকাউন্ট তথ্য:" : "Learner Account Information:"}</strong>{" "}
              {isBn
                ? "পূর্ণ নাম, জাতীয় পরিচয়পত্র/পাসপোর্ট রেফারেন্স, মোবাইল নম্বর, ইমেইল ঠিকানা এবং প্রাতিষ্ঠানিক বা ডিলারশিপের নাম।"
                : "Full name, national identity/passport reference, mobile number, email address, and institutional or dealership affiliation."}
            </li>
            <li>
              <strong>{isBn ? "একাডেমিক ও মূল্যায়ন রেকর্ড:" : "Academic & Assessment Records:"}</strong>{" "}
              {isBn
                ? "ভিডিও পাঠ সমাপ্তির টাইমস্ট্যাম্প, কুইজ স্কোর, ডিজিটাল সার্টিফিকেট যাচাইকরণ হ্যাশ এবং ব্যাজ ইস্যু তথ্য।"
                : "Video lesson completion timestamps, quiz scores, certificate verification hashes, and badge issuances."}
            </li>
            <li>
              <strong>{isBn ? "দুর্ঘটনা ও কারিগরি তদন্ত তথ্য:" : "Incident & Technical Inquiries:"}</strong>{" "}
              {isBn
                ? "ভৌগোলিক স্থানাঙ্ক, প্রত্যক্ষদর্শীর বিবরণ, ছবি/ভিডিও সংযুক্তি এবং জাতীয় দুর্ঘটনা রেজিস্ট্রিতে প্রেরিত জরুরি লগ।"
                : "Geographical coordinates, eyewitness reports, media attachments, and emergency logs submitted to the national incident registry."}
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "২. সংগৃহীত তথ্যের ব্যবহার" : "2. How We Use Collected Data"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "সংগৃহীত তথ্য কঠোরভাবে শিক্ষামূলক যাচাইকরণ এবং সংবিধিবদ্ধ জাতীয় নিরাপত্তা পর্যবেক্ষণের জন্য ব্যবহৃত হয়:"
              : "Data collected is strictly utilized for educational verification and statutory safety monitoring:"}
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1.5 text-slate-700">
            <li>
              {isBn
                ? "বিস্ফোরক অধিদপ্তর (DoE) ও এলওএবি স্বীকৃত কিউআর-কোডযুক্ত যাচাইযোগ্য ডিজিটাল সার্টিফিকেট ইস্যু করা।"
                : "Issuing verifiable QR-coded certificates recognized by DoE and LOAB."}
            </li>
            <li>
              {isBn
                ? "জরুরি নিরাপত্তা বুলেটিন এবং বিইআরসি মাসিক মূল্য সমন্বয়ের এসএমএস নোটিফিকেশন প্রদান করা।"
                : "Transmitting emergency safety bulletins and BERC price adjustment SMS notifications."}
            </li>
            <li>
              {isBn
                ? "সিলিন্ডারজনিত অগ্নিকাণ্ড হ্রাসে গবেষণামূলক পরিসংখ্যান পরিচালনা করা।"
                : "Conducting anonymized epidemiological safety research to reduce cylinder-related fire incidents."}
            </li>
            <li>
              {isBn
                ? "আমরা কখনোই কোনো বাণিজ্যিক বিজ্ঞাপনদাতার কাছে ব্যবহারকারীর ব্যক্তিগত যোগাযোগের তথ্য বিক্রয় বা ভাড়া দেই না।"
                : "We never sell or rent personal contact details to third-party commercial advertisers."}
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "৩. তথ্য নিরাপত্তা ও এনক্রিপশন" : "3. Data Security & Encryption"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "আপনার ব্রাউজার এবং আমাদের সার্ভারের মধ্যকার সমস্ত যোগাযোগ ট্রান্সপোর্ট লেয়ার সিকিউরিটি (TLS 1.3 / ২৫৬-বিট এসএসএল) দ্বারা এনক্রিপ্ট করা। বিকাশ, নগদ এবং অংশীদার ব্যাংকের পেমেন্ট গেটওয়েগুলো পিসিআই-ডিএসএস লেভেল ১ কমপ্লায়েন্ট নিরাপদ টোকেনাইজেশনের মাধ্যমে পরিচালিত হয়।"
              : "All interactions between your browser and our servers are encrypted via Transport Layer Security (TLS 1.3 / 256-bit SSL). Payment gateway interactions through bKash, Nagad, and partner acquiring banks are processed through PCI-DSS Level 1 compliant secure tokenization."}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900">
            {isBn ? "৪. ডেটা সুরক্ষা কর্মকর্তার সাথে যোগাযোগ" : "4. Contact the Data Protection Officer"}
          </h2>
          <p className="mt-2">
            {isBn
              ? "গোপনীয়তা, অ্যাকাউন্ট তথ্য মুছে ফেলা বা নিয়ন্ত্রক সংস্থা সংক্রান্ত অনুসন্ধানের জন্য যোগাযোগ করুন:"
              : "For questions regarding privacy, deletion of account data, or regulatory data sharing requests, contact:"}
          </p>
          <div className="mt-3 rounded-lg bg-slate-50 p-4 border border-slate-200/70 text-xs">
            <strong>{isBn ? "তথ্য গোপনীয়তা ও কমপ্লায়েন্স সেল" : "Data Privacy & Compliance Cell"}</strong>
            <br />
            {isBn
              ? "সেইফ এলপিজি প্ল্যাটফর্ম, বাড়ি # ১৩, রোড # ১৩, সেক্টর # ০৩, উত্তরা, ঢাকা-১২৩০"
              : "Safe LPG Platform, House # 13, Road # 13, Sector # 03, Uttara, Dhaka-1230"}
            <br />
            Email: <span className="text-primary font-medium">privacy@lpgsafety.org.bd</span> | Phone: +880 1812-345678
          </div>
        </div>
      </div>
    </section>
  );
}
