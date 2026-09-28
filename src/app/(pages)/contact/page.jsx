// src/app/(pages)/contact/page.jsx

import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import { Phone, Mail } from "lucide-react";
import ContactFormSection from "./_components/ContactFormSection";
import ContactLocationSection from "./_components/ContactLocationSection";
import { getLocale, getDict } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "যোগাযোগ করুন | ২৪/৭ এলপিজি হেল্পলাইন ও সাপোর্ট বাংলাদেশ",
      description:
        "সারাদেশে এলপিজি নিরাপত্তা পরামর্শক, প্রশিক্ষণ সমন্বয়কারী এবং জরুরি হেল্পলাইন কর্মকর্তাদের সাথে যোগাযোগ করুন।",
    };
  }
  return {
    title: "Contact Us | 24/7 Citizen & Industry LPG Support Bangladesh",
    description:
      "Get in touch with Safe LPG safety advisory officers, training coordinators, and emergency helpline officers across Bangladesh.",
  };
}

export default async function ContactPage() {
  const [locale, dict, cmsData] = await Promise.all([
    getLocale(),
    getDict(),
    getPageContent("contact"),
  ]);
  const commonDict = dict?.common || {};
  const isBn = locale === "bn";
  const banner = cmsData.banner;
  const contactInfo = cmsData?.sections?.contactInfo;

  return (
    <main className="min-h-screen bg-slate-50">
      <VisualHeroBanner
        data={banner}
        extraContent={
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-bold text-white">
                {commonDict?.hotlineLabel || (isBn ? "হটলাইন" : "Hotline")}:{" "}
                {contactInfo?.hotline || commonDict?.hotlineNumber || "16137"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md">
              <Mail className="h-4 w-4 text-primary" />
              <span>{contactInfo?.email || "support@safelpg-bd.com"}</span>
            </div>
          </div>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <ContactFormSection />
            <ContactLocationSection contactInfo={contactInfo} />
          </div>
        </div>
      </section>
    </main>
  );
}
