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

        {/* Billing Cycle Toggle */}
        <div className="mt-8 inline-flex items-center gap-1.5 sm:gap-3 rounded-full border border-slate-700 bg-slate-900/80 p-1 sm:p-1.5 shadow-md max-w-full">
          <Button
            variant="unstyled"
            onClick={() => setIsAnnual(false)}
            className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              !isAnnual
                ? "bg-primary text-white shadow-2xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {pricing.monthly || "Monthly"}
          </Button>

          <Button
            variant="unstyled"
            onClick={() => setIsAnnual(true)}
            className={`flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              isAnnual
                ? "bg-primary text-white shadow-2xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>{pricing.annual || "Annual"}</span>
            <span className="rounded-full bg-emerald-500 px-1.5 sm:px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950">
              {pricing.save20 || "Save 20%"}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
