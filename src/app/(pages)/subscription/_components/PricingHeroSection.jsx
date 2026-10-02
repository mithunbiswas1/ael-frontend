import { H1, P } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useDictionary } from "@/context/DictionaryContext";

export default function PricingHeroSection({ banner, isAnnual, setIsAnnual }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";

  const pricing = dict?.pricing || {};
  const common = dict?.common || {};

  const title = (isBn ? banner?.titleBn : banner?.title) || pricing.title || "FLEXIBLE SAFETY";
  const accent = (isBn ? banner?.accentBn : banner?.accent) || pricing.accent || "PLANS.";
  const description =
    (isBn ? banner?.descriptionBn : banner?.description) ||
    pricing.description ||
    "Choose the safety, training, and regulatory compliance package tailored for your home, retail outlet, auto gas station, or manufacturing facility.";

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
        <Breadcrumb
          dark
          items={[
            { label: common.home || "Home", href: "/" },
            { label: title ? `${title} ${accent || ""}` : "Pricing & Plans" },
          ]}
          className="justify-center mb-3"
        />

        <H1 color="white">
          <span>{title}</span>{" "}
          <span className="text-primary">{accent}</span>
        </H1>

        <P color="light" className="mt-3 max-w-xl mx-auto">
          {description}
        </P>

        {/* Trust Highlight Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isBn ? "তাত্ক্ষণিক সাবস্ক্রিপশন অ্যাক্টিভেশন" : "Instant Activation via bKash / Cards"}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 backdrop-blur-md">
            <span>🎓</span>
            <span>{isBn ? "সকল পেইড কোর্সে উন্মুক্ত প্রবেশ" : "All Premium Courses Included"}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 backdrop-blur-md">
            <span>📜</span>
            <span>{isBn ? "যাচাইযোগ্য ডিজিটাল সনদ" : "Verifiable QR-Coded Certificates"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
