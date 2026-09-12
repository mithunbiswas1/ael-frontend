// src/app/(home)/_components/SafetyGuidelinesSection.jsx 

import { User, ShieldCheck, Truck, Fuel, Factory } from "lucide-react";
import SafetyGuidelineCard from "@/components/shared/SafetyGuidelineCard";
import SectionHeader from "@/components/ui/SectionHeader";

const guidelinesData = [
  {
    id: "Investors",
    icon: Factory,
    badgeText: "Industrial Customer",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
    description: "Safety for industrial LPG usage.",
    href: "/safety-guidelines?tab=industrial",
  },
  {
    id: "dealer",
    icon: ShieldCheck,
    badgeText: "Dealer",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
    description: "Safety practices for LPG dealers.",
    href: "/safety-guidelines?tab=dealer",
  },
  {
    id: "distributor",
    icon: Truck,
    badgeText: "Distributor",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=600&auto=format&fit=crop",
    description: "Safe distribution and transportation.",
    href: "/safety-guidelines?tab=distributor",
  },
  {
    id: "consumer",
    icon: User,
    badgeText: "Consumer",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
    description: "Safe usage tips for household customers.",
    href: "/safety-guidelines?tab=consumer",
  },
];

export default function SafetyGuidelinesSection() {
  return (
    <section className="pt-14 pb-8">
      <div className="site-container">
        {/* Section Header */}
        <SectionHeader
          align="center"
          title="SAFETY"
          accent="GUIDELINES."
          subtitle="Standard operating safety procedures and regulatory compliance guidelines tailored for each stakeholder."
        />

        {/* 5 Columns Grid matching mockup */}
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
