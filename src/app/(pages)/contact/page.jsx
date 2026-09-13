// src/app/(pages)/contact/page.jsx
import GlobalHeroSection from "@/_components/GlobalHeroSection";
import { Phone, Mail } from "lucide-react";
import ContactFormSection from "./_components/ContactFormSection";
import ContactLocationSection from "./_components/ContactLocationSection";

export const metadata = {
  title: "Contact Us | 24/7 Citizen & Industry LPG Support Bangladesh",
  description:
    "Get in touch with Safe LPG safety advisory officers, training coordinators, and emergency helpline officers across Bangladesh.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <GlobalHeroSection
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
        title="CONTACT"
        accent="US."
        description="We are here to assist with safety protocols, regulatory compliance inquiries, institutional LMS training, and technical advisory services across Bangladesh."
        extraContent={
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-bold text-white">Hotline: 16137</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md">
              <Mail className="h-4 w-4 text-primary" />
              <span>support@safelpg-bd.com</span>
            </div>
          </div>
        }
        imageSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
        imageAlt="Customer Support Helpdesk"
      />

      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <ContactFormSection />
            <ContactLocationSection />
          </div>
        </div>
      </section>
    </main>
  );
}
