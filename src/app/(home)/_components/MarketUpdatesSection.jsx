// src/app/(home)/_components/MarketUpdatesSection.jsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketUpdateCard from "@/components/shared/MarketUpdateCard";
import SectionHeader from "@/components/ui/SectionHeader";

const marketUpdates = [
  {
    id: 1,
    category: "incident",
    badgeText: "Incident Report",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    title: "LPG Cylinder Explosion Incident in Chattogram",
    date: "May 20, 2024",
    href: "/market-updates/1",
  },
  {
    id: 2,
    category: "berc",
    badgeText: "BERC Message",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    title: "Important Message from BERC Regarding Safety",
    date: "May 18, 2024",
    href: "/market-updates/2",
  },
  {
    id: 3,
    category: "stakeholder",
    badgeText: "Stakeholder Update",
    imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=600&auto=format&fit=crop",
    title: "LOAB Meeting on LPG Safety Standards",
    date: "May 15, 2024",
    href: "/market-updates/3",
  },
];

export default function MarketUpdatesSection() {
  return (
    <div className="mb-10">
      {/* Header */}
      <SectionHeader
        level="h3"
        tag="INDUSTRY INTELLIGENCE"
        title="LPG MARKET"
        accent="UPDATES."
        subtitle="Real-time market insights, regulatory circulars, and sector reports"
        className="mb-5"
        action={
          <Link
            href="/market-updates"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-md transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {marketUpdates.map((item) => (
          <MarketUpdateCard
            key={item.id}
            category={item.category}
            badgeText={item.badgeText}
            imageUrl={item.imageUrl}
            title={item.title}
            date={item.date}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
}
