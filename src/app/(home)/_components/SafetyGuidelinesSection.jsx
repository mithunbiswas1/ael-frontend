// src/app/(home)/_components/SafetyGuidelinesSection.jsx

import { User, ShieldCheck, Truck, Factory } from "lucide-react";
import SafetyGuidelineCard from "@/components/shared/SafetyGuidelineCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function SafetyGuidelinesSection({ dict = {} }) {
  const guidelinesData = [
    {
      id: "investors",
      icon: Factory,
      badgeText: dict?.investors?.badge || "Investors",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
      description: dict?.investors?.desc || "Safety for industrial LPG usage.",
      href: "/safety-guidelines?tab=investors",
    },
    {
      id: "dealer",
      icon: ShieldCheck,
      badgeText: dict?.dealer?.badge || "Dealer",
      imageUrl:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
      description: dict?.dealer?.desc || "Safety practices for LPG dealers.",
      href: "/safety-guidelines?tab=dealer",
    },
    {
      id: "distributor",
      icon: Truck,
      badgeText: dict?.distributor?.badge || "Distributor",
      imageUrl:
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600&auto=format&fit=crop",
      description:
        dict?.distributor?.desc || "Safe distribution and transportation.",
      href: "/safety-guidelines?tab=distributor",
    },
    {
      id: "customer",
      icon: User,
      badgeText: dict?.customer?.badge || "Customer",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
      description:
        dict?.customer?.desc || "Safe usage tips for household Customer.",
      href: "/safety-guidelines?tab=customer",
    },
  ];

  return (
    <section className="pt-14 pb-8">
      <div className="site-container">
        {/* Section Header */}
        <SectionHeader
          align="center"
          title={dict?.title || "SAFETY"}
          accent={dict?.accent || "GUIDELINES."}
          subtitle={
            dict?.subtitle ||
            "Standard operating safety procedures and regulatory compliance guidelines tailored for each stakeholder."
          }
        />

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guidelinesData.map((item) => (
            <SafetyGuidelineCard
              key={item.id}
              id={item.id}
              icon={item.icon}
              badgeText={item.badgeText}
              imageUrl={item.imageUrl}
              description={item.description}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
