// src/app/(pages)/about/_components/AboutHeroSection.jsx
"use client";

import { LinkButton } from "@/components/ui/LinkButton";
import { ArrowRight } from "lucide-react";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import { useDictionary } from "@/context/DictionaryContext";

export default function AboutHeroSection() {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const common = dict?.common || {};
  const about = dict?.about || {};

  return (
    <VisualHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        { label: dict?.navbar?.navLinks?.about || (isBn ? "আমাদের সম্পর্কে" : "About Us") },
      ]}
      badge={about.badge || (isBn ? "জাতীয় এলপিজি নিরাপত্তা মিশন" : "NATIONAL LPG SAFETY MISSION")}
      title={about.title || (isBn ? "আমাদের" : "ABOUT")}
      accent={about.accent || (isBn ? "সম্পর্কে।" : "US.")}
      description={
        about.description ||
        (isBn
          ? "সারা বাংলাদেশে নিরাপত্তা সংস্কৃতি প্রতিষ্ঠা, জনসচেতনতা বৃদ্ধি এবং জ্ঞান ও কারিগরি প্রশিক্ষণের মাধ্যমে এলপিজি খাতকে শক্তিশালী করতে আমরা নিবেদিত।"
          : "Dedicated to promoting nationwide safety, building public awareness, and strengthening Bangladesh’s LPG sector through knowledge, technical training, and institutional collaboration.")
      }
      buttons={
        <>
          <LinkButton href="/courses" variant="primary" size="default">
            <span>{isBn ? "প্রশিক্ষণ কোর্স দেখুন" : "Explore Training Courses"}</span>
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/contact" variant="frosted" size="default">
            <span>{isBn ? "আমাদের সাথে যোগাযোগ করুন" : "Contact Our Team"}</span>
          </LinkButton>
        </>
      }
      imageSrc="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
      imageAlt="LPG Storage and Cylinders"
    />
  );
}
