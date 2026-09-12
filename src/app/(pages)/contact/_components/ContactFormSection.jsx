// src/app/(pages)/contact/_components/ContactFormSection.jsx
import SectionHeader from "@/components/ui/SectionHeader";
import ContactForm from "../_client/ContactForm";

export default function ContactFormSection() {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
      <SectionHeader
        tag="DIRECT INQUIRY"
        title="GET IN"
        accent="TOUCH."
        subtitle="Send us a message and our safety coordination officers will follow up promptly."
      />
      <ContactForm />
    </div>
  );
}
