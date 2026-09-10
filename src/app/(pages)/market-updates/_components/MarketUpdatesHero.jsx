import Image from "next/image";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function MarketUpdatesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Info */}
          <div className="flex flex-col items-start lg:col-span-7">
            <Breadcrumb
              dark
              items={[
                { label: "Home", href: "/" },
                { label: "LPG Market Update" },
              ]}
              className="mb-3"
            />

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
              <span>OFFICIAL INDUSTRY REGISTRY & MARKET PULSE</span>
            </div>

            <H1 color="white" className="leading-[1.08] tracking-tight">
              <span>LPG MARKET</span>{" "}
              <span className="text-primary">UPDATE.</span>
            </H1>

            <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Stay informed with the latest incident reports, inquiries, stakeholder announcements,
              BERC price notifications, and global LPG market trends across Bangladesh.
            </P>
          </div>

          {/* Right Visual */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
              <Image
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
                alt="Industrial LPG Terminal and Storage Facility"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/75 p-3 text-white backdrop-blur-md">
                <div>
                  <div className="text-xs font-black tracking-wide text-white">
                    National Incident Registry
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Live Feed • Verified by DoE &amp; LOAB
                  </div>
                </div>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
