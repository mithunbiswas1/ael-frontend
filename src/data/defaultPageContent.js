// src/data/defaultPageContent.js

export const DEFAULT_PAGE_CONTENT = {
  terms: {
    contentHtml: `
      <div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Revised: May 2024</p>
        <h3 class="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h3>
        <p class="mb-6 leading-relaxed">By accessing, browsing, or enrolling in any course provided on the Safe LPG platform, you agree to be legally bound by these Terms of Service, the Explosives Act 1884, Gas Cylinder Rules 1991 (amended 2004), and BERC statutory notifications. If you do not agree with any provision, you must discontinue platform use immediately.</p>

        <h3 class="text-lg font-bold text-slate-900 mb-2">2. Certificate Validity & Ethical Conduct</h3>
        <p class="mb-3 leading-relaxed">Certificates of completion are issued strictly based on individual learner engagement and successful attainment of an 80% threshold in official assessment quizzes. The following behaviors constitute grounds for immediate certificate revocation and referral to regulatory authorities:</p>
        <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
          <li>Submitting fraudulent identity documents during registration.</li>
          <li>Attempting to forge, falsify, or replicate digital verification QR codes.</li>
          <li>Unauthorized commercial redistribution or resale of LMS lecture videos and technical safety guides.</li>
        </ul>

        <h3 class="text-lg font-bold text-slate-900 mb-2">3. Operational Safety & Emergency Disclaimer</h3>
        <p class="mb-6 leading-relaxed">While our guidelines reflect current best practices and national engineering codes, training completion does not substitute for on-site statutory inspections conducted by the Department of Explosives (DoE) or Fire Service & Civil Defense. In active gas leak emergencies, prioritize human life, evacuate immediately, and dial emergency telephone 16137.</p>

        <h3 class="text-lg font-bold text-slate-900 mb-2">4. Subscription Billing & Refunds</h3>
        <p class="leading-relaxed">Subscriptions for commercial dealer portals or household plus features are billed in advance on a monthly or annual recurring basis. Unused periods are refundable within 7 days of initial purchase provided no formal certification has been generated or issued.</p>
      </div>
    `.trim(),
    contentHtmlBn: `
      <div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">সর্বশেষ সংস্করণ: মে ২০২৪</p>
        <h3 class="text-lg font-bold text-slate-900 mb-2">১. শর্তাবলী গ্রহণ</h3>
        <p class="mb-6 leading-relaxed">সেইফ এলপিজি প্ল্যাটফর্মে প্রবেশ, ব্রাউজ করা বা যেকোনো কোর্সে নথিভুক্ত করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলী, বিস্ফোরক আইন ১৮৮৪, গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ (সংশোধিত ২০০৪) এবং বিইআরসি সংবিধিবদ্ধ বিজ্ঞপ্তির দ্বারা আইনত বাধ্য হতে সম্মত হচ্ছেন। আপনি কোনো বিধানের সাথে সম্মত না হলে অবিলম্বে প্ল্যাটফর্ম ব্যবহার বন্ধ করতে হবে।</p>

        <h3 class="text-lg font-bold text-slate-900 mb-2">২. সনদের বৈধতা ও নৈতিক আচরণ</h3>
        <p class="mb-3 leading-relaxed">কোর্স সমাপ্তির সনদ কঠোরভাবে প্রতিটি শিক্ষার্থীর নিজস্ব অংশগ্রহণ এবং অফিসিয়াল মূল্যায়ন কুইজে ন্যূনতম ৮০% নম্বর অর্জনের ভিত্তিতে প্রদান করা হয়। নিম্নলিখিত আচরণগুলো সনদপত্র তাৎক্ষণিক বাতিল এবং নিয়ন্ত্রক কর্তৃপক্ষের কাছে প্রেরণের কারণ হিসেবে বিবেচিত হবে:</p>
        <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
          <li>নিবন্ধনের সময় মিথ্যা বা জাল পরিচয় নথি জমা দেওয়া।</li>
          <li>ডিজিটাল যাচাইকরণ কিউআর কোড জালিয়াতি, পরিবর্তন বা অনুলিপি করার অপচেষ্টা।</li>
          <li>এলএমএস লেকচার ভিডিও এবং প্রযুক্তিগত নির্দেশিকা অননুমোদিত বাণিজ্যিক পুনঃবিতরণ বা বিক্রয়।</li>
        </ul>

        <h3 class="text-lg font-bold text-slate-900 mb-2">৩. পরিচালন নিরাপত্তা ও জরুরি অস্বীকৃতি</h3>
        <p class="mb-6 leading-relaxed">আমাদের নির্দেশিকাসমূহ বর্তমান প্রকৌশল নীতি ও জাতীয় মান অনুসরণ করে তৈরি হলেও, এই প্রশিক্ষণ বিস্ফোরক অধিদপ্তর (DoE) বা ফায়ার সার্ভিস ও সিভিল ডিফেন্সের সংবিধিবদ্ধ পরিদর্শন বা লাইসেন্সের বিকল্প নয়। সক্রিয় গ্যাস লিকেজ বা অগ্নিকাণ্ডে সর্বদা মানুষের জীবন রক্ষাকে অগ্রাধিকার দিয়ে অবিলম্বে নিরাপদ স্থানে সরে যান এবং জাতীয় জরুরি হেল্পলাইন ১৬১৩৭-এ কল করুন।</p>

        <h3 class="text-lg font-bold text-slate-900 mb-2">৪. সাবস্ক্রিপশন বিলিং ও রিফান্ড নীতি</h3>
        <p class="leading-relaxed">বাণিজ্যিক ডিলার পোর্টাল বা প্রিমিয়াম সাবস্ক্রিপশনের পেমেন্ট অগ্রিম মাসিক বা বার্ষিক ভিত্তিতে গৃহীত হয়। কোনো প্রাতিষ্ঠানিক সনদ ইস্যু না হয়ে থাকলে প্রাথমিক ক্রয়ের ৭ দিনের মধ্যে রিফান্ডের আবেদন করা যাবে।</p>
      </div>
    `.trim(),
  },

  privacy: {
    contentHtml: `
      <div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Effective Date: May 1, 2024</p>
        <h3 class="text-lg font-bold text-slate-900 mb-2">1. Information We Collect</h3>
        <p class="mb-3 leading-relaxed">We collect information to facilitate certified LPG safety education, maintain national incident registries, and authenticate regulatory dealer licenses:</p>
        <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
          <li><strong>Learner Account Information:</strong> Full name, national identity/passport reference, mobile number, email address, and institutional or dealership affiliation.</li>
          <li><strong>Academic & Assessment Records:</strong> Video lesson completion timestamps, quiz scores, certificate verification hashes, and badge issuances.</li>
          <li><strong>Incident & Technical Inquiries:</strong> Geographical coordinates, eyewitness reports, media attachments, and emergency logs submitted to the national incident registry.</li>
        </ul>

        <h3 class="text-lg font-bold text-slate-900 mb-2">2. How We Use Collected Data</h3>
        <p class="mb-3 leading-relaxed">Data collected is strictly utilized for educational verification and statutory safety monitoring:</p>
        <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
          <li>Issuing verifiable QR-coded certificates recognized by DoE and LOAB.</li>
          <li>Transmitting emergency safety bulletins and BERC price adjustment SMS notifications.</li>
          <li>Conducting anonymized epidemiological safety research to reduce cylinder-related fire incidents.</li>
          <li>We never sell or rent personal contact details to third-party commercial advertisers.</li>
        </ul>

        <h3 class="text-lg font-bold text-slate-900 mb-2">3. Data Security & Encryption</h3>
        <p class="mb-6 leading-relaxed">All interactions between your browser and our servers are encrypted via Transport Layer Security (TLS 1.3 / 256-bit SSL). Payment gateway interactions through bKash, Nagad, and partner acquiring banks are processed through PCI-DSS Level 1 compliant secure tokenization.</p>

        <h3 class="text-lg font-bold text-slate-900 mb-2">4. Contact the Data Protection Officer</h3>
        <p class="mb-3 leading-relaxed">For questions regarding privacy, deletion of account data, or regulatory data sharing requests, contact:</p>
        <div class="rounded-lg bg-slate-50 p-4 border border-slate-200/70 text-xs">
          <strong>Data Privacy & Compliance Cell</strong><br />
          Safe LPG Platform, House # 13, Road # 13, Sector # 03, Uttara, Dhaka-1230<br />
          Email: <span class="text-primary font-medium">privacy@lpgsafety.org.bd</span> | Phone: +880 1812-345678
        </div>
      </div>
    `.trim(),
    contentHtmlBn: `
      <div>
        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">কার্যকর তারিখ: ১ মে, ২০২৪</p>
        <h3 class="text-lg font-bold text-slate-900 mb-2">১. যেসকল তথ্য আমরা সংগ্রহ করি</h3>
        <p class="mb-3 leading-relaxed">প্রত্যয়িত এলপিজি নিরাপত্তা শিক্ষা প্রদান, জাতীয় দুর্ঘটনা রেজিস্ট্রি সংরক্ষণ এবং সংবিধিবদ্ধ ডিলার লাইসেন্স যাচাইকরণের সুবিধার্থে আমরা প্রয়োজনীয় তথ্য সংগ্রহ করি:</p>
        <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
          <li><strong>শিক্ষার্থীর অ্যাকাউন্ট তথ্য:</strong> পূর্ণ নাম, জাতীয় পরিচয়পত্র/পাসপোর্ট রেফারেন্স, মোবাইল নম্বর, ইমেইল ঠিকানা এবং প্রাতিষ্ঠানিক বা ডিলারশিপের নাম।</li>
          <li><strong>একাডেমিক ও মূল্যায়ন রেকর্ড:</strong> ভিডিও পাঠ সমাপ্তির টাইমস্ট্যাম্প, কুইজ স্কোর, ডিজিটাল সার্টিফিকেট যাচাইকরণ হ্যাশ এবং ব্যাজ ইস্যু তথ্য।</li>
          <li><strong>দুর্ঘটনা ও কারিগরি তদন্ত তথ্য:</strong> ভৌগোলিক স্থানাঙ্ক, প্রত্যক্ষদর্শীর বিবরণ, ছবি/ভিডিও সংযুক্তি এবং জাতীয় দুর্ঘটনা রেজিস্ট্রিতে প্রেরিত জরুরি লগ।</li>
        </ul>

        <h3 class="text-lg font-bold text-slate-900 mb-2">২. সংগৃহীত তথ্যের ব্যবহার</h3>
        <p class="mb-3 leading-relaxed">সংগৃহীত তথ্য কঠোরভাবে শিক্ষামূলক যাচাইকরণ এবং সংবিধিবদ্ধ জাতীয় নিরাপত্তা পর্যবেক্ষণের জন্য ব্যবহৃত হয়:</p>
        <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
          <li>বিস্ফোরক অধিদপ্তর (DoE) ও এলওএবি স্বীকৃত কিউআর-কোডযুক্ত যাচাইযোগ্য ডিজিটাল সার্টিফিকেট ইস্যু করা।</li>
          <li>জরুরি নিরাপত্তা বুলেটিন এবং বিইআরসি মাসিক মূল্য সমন্বয়ের এসএমএস নোটিফিকেশন প্রদান করা।</li>
          <li>সিলিন্ডারজনিত অগ্নিকাণ্ড হ্রাসে গবেষণামূলক পরিসংখ্যান পরিচালনা করা।</li>
          <li>আমরা কখনোই কোনো বাণিজ্যিক বিজ্ঞাপনদাতার কাছে ব্যবহারকারীর ব্যক্তিগত যোগাযোগের তথ্য বিক্রয় বা ভাড়া দেই না।</li>
        </ul>

        <h3 class="text-lg font-bold text-slate-900 mb-2">৩. তথ্য নিরাপত্তা ও এনক্রিপশন</h3>
        <p class="mb-6 leading-relaxed">আপনার ব্রাউজার এবং আমাদের সার্ভারের মধ্যকার সমস্ত যোগাযোগ ট্রান্সপোর্ট লেয়ার সিকিউরিটি (TLS 1.3 / ২৫৬-বিট এসএসএল) দ্বারা এনক্রিপ্ট করা। বিকাশ, নগদ এবং অংশীদার ব্যাংকের পেমেন্ট গেটওয়েগুলো পিসিআই-ডিএসএস লেভেল ১ কমপ্লায়েন্ট নিরাপদ টোকেনাইজেশনের মাধ্যমে পরিচালিত হয়।</p>

        <h3 class="text-lg font-bold text-slate-900 mb-2">৪. ডেটা সুরক্ষা কর্মকর্তার সাথে যোগাযোগ</h3>
        <p class="mb-3 leading-relaxed">গোপনীয়তা, অ্যাকাউন্ট তথ্য মুছে ফেলা বা নিয়ন্ত্রক সংস্থা সংক্রান্ত অনুসন্ধানের জন্য যোগাযোগ করুন:</p>
        <div class="rounded-lg bg-slate-50 p-4 border border-slate-200/70 text-xs">
          <strong>তথ্য গোপনীয়তা ও কমপ্লায়েন্স সেল</strong><br />
          সেইফ এলপিজি প্ল্যাটফর্ম, বাড়ি # ১৩, রোড # ১৩, সেক্টর # ০৩, উত্তরা, ঢাকা-১২৩০<br />
          Email: <span class="text-primary font-medium">privacy@lpgsafety.org.bd</span> | Phone: +880 1812-345678
        </div>
      </div>
    `.trim(),
  },

  "acts-and-rules": {
    contentHtml: `
      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Statutory Legal Framework Governing LPG Operations in Bangladesh</h3>
        <p class="mb-4 leading-relaxed">The downstream Liquefied Petroleum Gas (LPG) industry in Bangladesh is governed by a robust framework of parliamentary acts, ministerial statutory regulatory orders (SROs), and standards established by the <strong>Department of Explosives (DoE)</strong>, <strong>Bangladesh Energy Regulatory Commission (BERC)</strong>, and the <strong>Bangladesh Fire Service and Civil Defence (BFSCD)</strong>.</p>
        <p class="leading-relaxed">Key legislation mandates that every operator—from international import terminals to regional distributors and retail point-of-sale shopkeepers—maintains verified licensing, calibrated pressure testing certificates, and standard operating procedures (SOPs) compliant with the <em>LPG (Operational) Rules 2004</em> and the <em>Petroleum Act 2016</em>.</p>
      </div>
    `.trim(),
    contentHtmlBn: `
      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">বাংলাদেশে এলপিজি পরিচালনা সংক্রান্ত সংবিধিবদ্ধ আইনি কাঠামো</h3>
        <p class="mb-4 leading-relaxed">বাংলাদেশে তরলীকৃত পেট্রোলিয়াম গ্যাস (এলপিজি) ডাউনস্ট্রিম খাত পরিচালিত হয় জাতীয় সংসদীয় আইন, মন্ত্রণালয়ের এসআরও এবং <strong>বিস্ফোরক পরিদপ্তর (ডিওই)</strong>, <strong>বিইআরসি</strong> এবং <strong>ফায়ার সার্ভিস ও সিভিল ডিফেন্স</strong> কর্তৃক প্রণীত বিধিমালার মাধ্যমে।</p>
        <p class="leading-relaxed">সকল আমদানিকারক, প্ল্যান্ট অপারেটর ও ডিলারকে <em>এলপিজি (পরিচালন) বিধিমালা ২০০৪</em> এবং <em>পেট্রোলিয়াম আইন ২০১৬</em> অনুসারে বৈধ লাইসেন্স ও নিরাপত্তা সরঞ্জাম নিশ্চিত করতে হবে।</p>
      </div>
    `.trim(),
  },
};
