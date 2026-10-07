// src/components/shared/AdSlot.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  useGetActiveAdBySlotQuery,
  useTrackAdClickMutation,
} from "@/redux/api/advertisementApi";
import { getMediaUrl } from "@/utils/mediaUrl";

// Standard Google Ads dimension specifications for the 6 ad slots
const SLOT_SPECS = {
  header_banner: {
    aspectClass: "aspect-[970/90] sm:aspect-[728/90]",
    containerClass: "w-full max-w-[970px] mx-auto",
    maxHeight: "90px",
  },
  right_overlay: {
    // Footer Side Sticky Anchor Banner
    aspectClass: "aspect-[970/90] sm:aspect-[728/90]",
    containerClass: "w-full max-w-[970px] mx-auto",
    maxHeight: "90px",
  },
  mid_content: {
    aspectClass: "aspect-[970/250] sm:aspect-[970/250]",
    containerClass: "w-full max-w-[970px] mx-auto",
    maxHeight: "250px",
  },
  footer_banner: {
    aspectClass: "aspect-[970/90] sm:aspect-[728/90]",
    containerClass: "w-full max-w-[970px] mx-auto",
    maxHeight: "90px",
  },
  sidebar_ad: {
    aspectClass: "aspect-[300/250]",
    containerClass: "w-full max-w-[336px] mx-auto",
    maxHeight: "250px",
  },
  popup_ad: {
    aspectClass: "aspect-[16/10]",
    containerClass: "max-w-lg w-full",
    maxHeight: "400px",
  },
};

export default function AdSlot({ slot, className = "" }) {
  const { data: adResponse, isLoading } = useGetActiveAdBySlotQuery(slot, {
    skip: !slot,
  });
  const [trackClick] = useTrackAdClickMutation();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check sessionStorage on mount to persist dismissed ad state throughout user session
  useEffect(() => {
    setIsMounted(true);
    try {
      if (typeof window !== "undefined" && slot) {
        const dismissed = sessionStorage.getItem(`ad_dismissed_${slot}`);
        if (dismissed === "true") {
          setIsDismissed(true);
        }
      }
    } catch {
      // Ignore sessionStorage access errors
    }
  }, [slot]);

  // Load Google Ads script if needed
  useEffect(() => {
    const isGoogle = !adResponse?.data?.imageUrl && adResponse?.data?.type === "google_ads";
    if (isGoogle && typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ignore Google Ads push errors
      }
    }
  }, [adResponse]);

  const ad = adResponse?.data;
  const spec = SLOT_SPECS[slot] || SLOT_SPECS.header_banner;

  // Dismiss ad and persist to sessionStorage for the session
  const handleDismiss = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDismissed(true);
    try {
      if (typeof window !== "undefined" && slot) {
        sessionStorage.setItem(`ad_dismissed_${slot}`, "true");
      }
    } catch {
      // Ignore
    }
  };

  const handleClick = () => {
    if (ad?._id) {
      trackClick(ad._id);
    }
  };

  // Helper to safely format image URLs
  const resolveImageUrl = (src) => {
    return getMediaUrl(src, "/default_image.jpg");
  };

  // Hidden if dismissed or loading or not mounted
  if (!isMounted || isDismissed || isLoading) {
    return null;
  }

  const hasImage = Boolean(ad?.imageUrl && ad.imageUrl.trim());
  const isGoogleAd = !hasImage && ad?.type === "google_ads";

  // If neither image nor active Google Ad exists, render nothing
  if (!hasImage && !isGoogleAd && !ad) {
    return null;
  }

  // -------------------------------------------------------------
  // GOOGLE ADS MINIMAL RECTANGULAR CLOSE BUTTON ('X')
  // Standard non-rounded clean corner button
  // -------------------------------------------------------------
  const closeButton = (
    <button
      type="button"
      onClick={handleDismiss}
      className="absolute top-0 right-0 z-30 flex h-5 w-5 items-center justify-center bg-black/70 text-white hover:bg-black transition-colors cursor-pointer rounded-none border-b border-l border-white/20"
      title="Close ad"
      aria-label="Close ad"
    >
      <X className="h-3 w-3" />
    </button>
  );

  // -------------------------------------------------------------
  // 6. POP-UP MODAL AD (Center - Center) - Normal flat rectangular structure
  // -------------------------------------------------------------
  if (slot === "popup_ad") {
    return (
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={handleDismiss}
      >
        <div
          className="relative max-w-lg w-full overflow-hidden rounded-none bg-white shadow-2xl border border-slate-300 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top-Right Standard Close Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-0 right-0 z-30 flex h-7 w-7 items-center justify-center bg-black/80 text-white hover:bg-black transition-colors cursor-pointer rounded-none border-b border-l border-white/20"
            title="Close ad"
            aria-label="Close Pop-up Ad"
          >
            <X className="h-4 w-4" />
          </button>

          {hasImage ? (
            <a
              href={ad.clickUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="block relative aspect-16/10 w-full overflow-hidden bg-slate-100 rounded-none group"
            >
              <Image
                src={resolveImageUrl(ad.imageUrl)}
                alt={ad.title || "Advertisement"}
                fill
                unoptimized={ad.imageUrl.startsWith("http")}
                className="object-cover rounded-none"
                onError={(e) => {
                  e.currentTarget.src = "/default_image.jpg";
                }}
              />
            </a>
          ) : (
            <div className="relative p-2 flex items-center justify-center min-h-[300px] bg-white rounded-none">
              <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%", height: "300px" }}
                data-ad-client={ad?.googleAdClient || "ca-pub-0000000000000000"}
                data-ad-slot={ad?.googleAdSlot || "0000000000"}
                data-ad-format={ad?.googleAdFormat || "auto"}
                data-full-width-responsive="true"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. FOOTER SIDE AD / BOTTOM STICKY OVERLAY (Flat rectangular structure)
  // Standard Google anchor banner sticking to bottom edge of screen
  // -------------------------------------------------------------
  if (slot === "right_overlay") {
    return (
      <div className="fixed bottom-0 inset-x-0 z-[70] flex justify-center items-center py-1.5 px-3 bg-white/95 backdrop-blur-md border-t border-slate-300 shadow-2xl rounded-none animate-in slide-in-from-bottom duration-300">
        <div className="relative max-w-[970px] w-full flex justify-center rounded-none">
          {/* Subtle Close Button on Top Right */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute -top-6 right-0 sm:right-1 z-30 flex h-6 px-2 items-center gap-1 bg-slate-900/90 hover:bg-slate-950 text-white text-[10px] font-mono shadow-md transition-colors cursor-pointer rounded-none border border-slate-700"
            title="Close ad"
            aria-label="Close footer ad"
          >
            <span>Close</span>
            <X className="h-3 w-3" />
          </button>

          {hasImage ? (
            <a
              href={ad.clickUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="block relative w-full overflow-hidden rounded-none border border-slate-200 group"
            >
              <div
                className={cn("relative w-full overflow-hidden bg-slate-100 rounded-none", spec.aspectClass)}
                style={{ maxHeight: spec.maxHeight }}
              >
                <Image
                  src={resolveImageUrl(ad.imageUrl)}
                  alt={ad.title || "Advertisement"}
                  fill
                  unoptimized={ad.imageUrl.startsWith("http")}
                  className="object-cover rounded-none"
                  onError={(e) => {
                    e.currentTarget.src = "/default_image.jpg";
                  }}
                />
              </div>
            </a>
          ) : (
            <div
              className={cn("w-full relative flex items-center justify-center rounded-none border border-slate-200 bg-white", spec.aspectClass)}
              style={{ maxHeight: spec.maxHeight }}
            >
              <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%", height: "90px" }}
                data-ad-client={ad?.googleAdClient || "ca-pub-0000000000000000"}
                data-ad-slot={ad?.googleAdSlot || "0000000000"}
                data-ad-format={ad?.googleAdFormat || "horizontal"}
                data-full-width-responsive="true"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 1. HEADER BANNER (Between Topbar and Navbar) - Normal rectangular structure
  // -------------------------------------------------------------
  if (slot === "header_banner") {
    return (
      <div className="w-full bg-slate-50/80 border-b border-slate-200/70 py-1 hidden sm:block rounded-none transition-all">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 flex justify-center rounded-none">
          <div className={cn("relative overflow-hidden rounded-none border border-slate-200 bg-white group w-full", spec.containerClass, className)}>
            {closeButton}

            {hasImage ? (
              <a
                href={ad.clickUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="block relative w-full overflow-hidden rounded-none group"
              >
                <div
                  className={cn("relative w-full overflow-hidden bg-slate-100 rounded-none", spec.aspectClass)}
                  style={{ maxHeight: spec.maxHeight }}
                >
                  <Image
                    src={resolveImageUrl(ad.imageUrl)}
                    alt={ad.title || "Advertisement"}
                    fill
                    unoptimized={ad.imageUrl.startsWith("http")}
                    className="object-cover rounded-none"
                    onError={(e) => {
                      e.currentTarget.src = "/default_image.jpg";
                    }}
                  />
                </div>
              </a>
            ) : (
              <div
                className={cn("w-full relative flex items-center justify-center bg-white rounded-none", spec.aspectClass)}
                style={{ maxHeight: spec.maxHeight }}
              >
                <ins
                  className="adsbygoogle"
                  style={{ display: "block", width: "100%", height: "90px" }}
                  data-ad-client={ad?.googleAdClient || "ca-pub-0000000000000000"}
                  data-ad-slot={ad?.googleAdSlot || "0000000000"}
                  data-ad-format={ad?.googleAdFormat || "horizontal"}
                  data-full-width-responsive="true"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3, 4, 5. IN-PAGE ADS (mid_content, footer_banner, sidebar_ad)
  // Normal rectangular structure (rounded-none) - sharp standard edges
  // -------------------------------------------------------------
  const isOuterContainerSlot = slot === "mid_content" || slot === "footer_banner";

  const adContent = (
    <div
      className={cn(
        "relative overflow-hidden rounded-none border border-slate-200 bg-white group transition-all",
        !isOuterContainerSlot && "my-3",
        spec.containerClass,
        className
      )}
    >
      {closeButton}

      {hasImage ? (
        <a
          href={ad.clickUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block relative w-full overflow-hidden rounded-none group"
        >
          <div
            className={cn("relative w-full overflow-hidden bg-slate-100 rounded-none", spec.aspectClass)}
            style={{ maxHeight: spec.maxHeight }}
          >
            <Image
              src={resolveImageUrl(ad.imageUrl)}
              alt={ad.title || "Advertisement"}
              fill
              unoptimized={ad.imageUrl.startsWith("http")}
              className="object-cover rounded-none"
              onError={(e) => {
                e.currentTarget.src = "/default_image.jpg";
              }}
            />
          </div>
        </a>
      ) : (
        <div
          className={cn("w-full relative flex items-center justify-center p-2 bg-white rounded-none", spec.aspectClass)}
          style={{ maxHeight: spec.maxHeight }}
        >
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: spec.maxHeight }}
            data-ad-client={ad?.googleAdClient || "ca-pub-0000000000000000"}
            data-ad-slot={ad?.googleAdSlot || "0000000000"}
            data-ad-format={ad?.googleAdFormat || "auto"}
            data-full-width-responsive="true"
          />
        </div>
      )}
    </div>
  );

  if (isOuterContainerSlot) {
    return <div className="site-container my-4 rounded-none">{adContent}</div>;
  }

  return adContent;
}
