// src/app/(home)/_components/MarketUpdatesSection.jsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketUpdateCard from "@/components/shared/MarketUpdateCard";
import SectionHeader from "@/components/ui/SectionHeader";

const DEFAULT_UPDATES = [
  {
    id: "update-1",
    category: "incident",
    badgeText: "Incident Report",
    badgeTextBn: "ঘটনা রিপোর্ট",
    imageUrl:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    title: "LPG Cylinder Explosion Incident in Chattogram",
    titleBn: "চট্টগ্রামে এলপিজি সিলিন্ডার বিস্ফোরণের ঘটনা ও পর্যালোচনা",
    date: "May 20, 2024",
    dateBn: "২০ মে, ২০২৪",
    href: "/market-updates",
  },
  {
    id: "update-2",
    category: "berc",
    badgeText: "BERC Message",
    badgeTextBn: "বিইআরসি বার্তা",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    title: "Important Message from BERC Regarding Safety",
    titleBn: "নিরাপত্তা ও মূল্য সংক্রান্ত বিইআরসি-এর গুরুত্বপূর্ণ বার্তা",
    date: "May 18, 2024",
    dateBn: "১৮ মে, ২০২৪",
    href: "/market-updates",
  },
];

export default function MarketUpdatesSection({ dict = {}, locale = "en" }) {
  const isBn = locale === "bn";

  const items = DEFAULT_UPDATES.map((update, idx) => {
    const dictItem = dict?.items?.[idx];
    return {
      id: update.id,
      category: update.category,
      badgeText: dictItem?.badge || (isBn ? update.badgeTextBn : update.badgeText),
      imageUrl: update.imageUrl,
      title: dictItem?.title || (isBn ? update.titleBn : update.title),
      date: dictItem?.date || (isBn ? update.dateBn : update.date),
      href: update.href,
    };
  });

  return (
    <div className="mb-10">
      {/* Header */}
      <SectionHeader
        level="h3"
        tag={dict?.tag || "INDUSTRY INTELLIGENCE"}
        title={dict?.title || "LPG MARKET"}
        accent={dict?.accent || "UPDATES."}
        subtitle={
          dict?.subtitle ||
          "Real-time market insights, regulatory circulars, and sector reports"
        }
        className="mb-5"
        action={
          <Link
            href="/market-updates"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-md transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
          >
            <span>{dict?.viewAll || "View All"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-2">
        {items.map((item) => (
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
