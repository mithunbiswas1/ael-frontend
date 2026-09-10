// src/app/(pages)/contact/page.jsx
import ContactHeroSection from "./_components/ContactHeroSection";
import ContactFormSection from "./_components/ContactFormSection";
import ContactLocationSection from "./_components/ContactLocationSection";

export const metadata = {
  title: "Contact Us | 24/7 Citizen & Industry LPG Support Bangladesh",
  description:
    "Get in touch with AEL LPG safety advisory officers, training coordinators, and emergency helpline officers across Bangladesh.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <ContactHeroSection />

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
