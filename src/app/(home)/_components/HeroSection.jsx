"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";

const SLIDES = [
  {
    id: 1,
    src: "/lpg-hero.jpg",
    alt: "LPG Safety Storage Plant & Facilities",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    alt: "Industrial LPG Pipeline & Valve Safety Inspection",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    alt: "LPG Energy Infrastructure and Quality Compliance",
  },
];

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary pb-20 pt-10 md:pb-24 md:pt-14 border-b border-primary/20">
      {/* Reusable Subtle Background Glow */}
      <AmbientGlow color="primary" />

      {/* Subtle Radial grid pattern matching brand primary */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1D4E91_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]"
      />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Left Text & CTA (7 cols) */}
          <div className="flex flex-col items-start lg:col-span-7">
            <H1 color="white">
              <span>SAFETY FIRST.</span>
              <br />
              <span className="text-secondary">AWARENESS ALWAYS.</span>
            </H1>

            <P color="light" className="mt-5 max-w-xl text-slate-300">
              Promoting nationwide LPG safety awareness across Bangladesh for consumers,
              dealers, and industries — ensuring a safer today and sustainable tomorrow.
            </P>

            {/* CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <LinkButton
                href="/safety-guidelines"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-md shadow-primary/25"
              >
                <span>Explore Safety Guidelines</span>
                <ArrowRight className="h-4 w-4" />
              </LinkButton>

              <LinkButton
                href="/courses"
                variant="frosted"
                size="lg"
                className="w-full sm:w-auto hover:border-primary/50"
              >
                <span>Start Training &amp; Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>

          {/* Right Visual (5 cols) Carousel */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-tertiary/80 shadow-2xl backdrop-blur-sm">
              {/* Embla Viewport */}
              <div className="h-full w-full overflow-hidden" ref={emblaRef}>
                <div className="flex h-full touch-pan-y">
                  {SLIDES.map((slide, index) => (
                    <div
                      key={slide.id}
                      className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden"
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover object-center transition-transform duration-700 ease-out"
                      />

                      {/* Subtle Bottom Gradient */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-900/90 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-900/90 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${selectedIndex === index
                      ? "w-5 bg-secondary"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

