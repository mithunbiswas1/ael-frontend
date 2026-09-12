// src/app/(pages)/safety-guidelines/_components/SafetyGuidelinesContent.jsx
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import SafetyGuidelinesInteractive from "../_client/SafetyGuidelinesInteractive";

export default function SafetyGuidelinesContent() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="main"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Safety Guidelines" },
        ]}
        title="SAFETY"
        accent="GUIDELINES."
        description="Guidelines for safe handling, storage and use of LPG across all sectors. Compliant with BERC, Department of Explosives (DoE), and Fire Service regulations."
        imageSrc="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
        imageAlt="LPG Storage Tanks and Cylinders"
      />
      <SafetyGuidelinesInteractive />
    </main>
  );
}
