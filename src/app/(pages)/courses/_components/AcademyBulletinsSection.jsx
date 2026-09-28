// src/app/(pages)/courses/_components/AcademyBulletinsSection.jsx
"use client";

import Input from "@/components/ui/Input";
import { useDictionary } from "@/context/DictionaryContext";

export default function AcademyBulletinsSection({
  newsletterEmail,
  setNewsletterEmail,
  handleNewsletter,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  return (
    <section className="py-8 bg-white border-t border-slate-200/80">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Newsletter */}
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {isBn ? "একাডেমি বুলেটিন" : "ACADEMY BULLETINS"}
            </span>
            <p className="text-xs text-slate-500">
              {isBn
                ? "নতুন প্রশিক্ষণ মডিউল ও নিরাপত্তা প্রোটোকলের আপডেট পেতে সাবস্ক্রাইব করুন।"
                : "Subscribe to receive fresh training modules & safety protocols."}
            </p>
            <form onSubmit={handleNewsletter} className="mt-2 flex max-w-md gap-2">
              <Input
                type="email"
                placeholder={isBn ? "আপনার ইমেইল লিখুন" : "Enter your email"}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
              >
                {isBn ? "সাবস্ক্রাইব" : "Subscribe"}
              </button>
            </form>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
            <div>
              <div className="text-xl font-black text-slate-900">
                {isBn ? "১,২৫০+" : "1,250+"}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                {isBn ? "অনুষ্ঠিত প্রশিক্ষণ" : "Trainings Held"}
              </div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">
                {isBn ? "২৫,৩৪০+" : "25,340+"}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                {isBn ? "প্রশিক্ষণার্থী" : "Learners"}
              </div>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">
                {isBn ? "৯৮%" : "98%"}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500">
                {isBn ? "পাসের হার" : "Pass Rate"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
