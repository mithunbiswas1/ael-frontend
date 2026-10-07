"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { getMediaUrl } from "@/utils/mediaUrl";

export default function HeroSection({ locale = "en", banner = {} }) {
  const isBn = locale === "bn";
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx) => emblaApi?.scrollTo(idx), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateIndex = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    updateIndex();
    emblaApi.on("select", updateIndex);
    emblaApi.on("reInit", updateIndex);
    return () => {
      emblaApi.off("select", updateIndex);
      emblaApi.off("reInit", updateIndex);
    };
  }, [emblaApi]);

  const title = (isBn ? banner?.titleBn : banner?.title) || banner?.title || "";
  const accent = (isBn ? banner?.accentBn : banner?.accent) || banner?.accent || "";
  const description = (isBn ? banner?.descriptionBn : banner?.description) || banner?.description || "";
  const primaryText = (isBn ? banner?.btnPrimaryTextBn : banner?.btnPrimaryText) || banner?.btnPrimaryText || "";
  const secondaryText = (isBn ? banner?.btnSecondaryTextBn : banner?.btnSecondaryText) || banner?.btnSecondaryText || "";
  const slides = banner?.slides || [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary pb-20 pt-10 md:pb-24 md:pt-14 border-b border-primary/20">
      <AmbientGlow color="primary" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1D4E91_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]"
      />

      <div className="site-container relative z-10">
        <div className={`grid grid-cols-1 items-center gap-8 ${slides.length > 0 ? "lg:grid-cols-12 lg:gap-6" : "max-w-3xl"}`}>
          {/* Left Text & CTA */}
          <div className={`flex flex-col items-start ${slides.length > 0 ? "lg:col-span-7" : "w-full"}`}>
            {(title || accent) && (
              <H1 color="white">
                {title && <span>{title}</span>}
                {title && accent && <br />}
                {accent && <span className="text-secondary">{accent}</span>}
              </H1>
            )}

            {description && (
              <P color="light" className="mt-5 max-w-xl text-slate-300">
                {description}
              </P>
            )}

            {(primaryText || secondaryText) && (
              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {primaryText && (
                  <LinkButton
                    href={banner?.btnPrimaryHref || "/"}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-md shadow-primary/25"
                  >
                    <span>{primaryText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                )}

                {secondaryText && (
                  <LinkButton
                    href={banner?.btnSecondaryHref || "/"}
                    variant="frosted"
                    size="lg"
                    className="w-full sm:w-auto hover:border-primary/50"
                  >
                    <span>{secondaryText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                )}
              </div>
            )}
          </div>

          {/* Right Visual Carousel */}
          {slides.length > 0 && (
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-tertiary/80 shadow-2xl backdrop-blur-sm">
                <div className="h-full w-full overflow-hidden" ref={emblaRef}>
                  <div className="flex h-full touch-pan-y">
                    {slides.map((slide, index) => (
                      <div
                        key={slide._id || index}
                        className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden"
                      >
                        <Image
                          src={getMediaUrl(slide.image, "/default_image.jpg")}
                          alt={(isBn ? slide.altBn : slide.alt) || slide.alt || ""}
                          fill
                          priority={index === 0}
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover object-center transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.currentTarget.src = "/default_image.jpg";
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10" />
                      </div>
                    ))}
                  </div>
                </div>

                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={scrollPrev}
                      aria-label="Previous slide"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-900/90 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={scrollNext}
                      aria-label="Next slide"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-900/90 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => scrollTo(index)}
                          aria-label={`Go to slide ${index + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${selectedIndex === index
                            ? "w-5 bg-secondary"
                            : "w-1.5 bg-white/40 hover:bg-white/70"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
