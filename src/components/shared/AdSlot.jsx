// src/components/shared/AdSlot.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  useGetActiveAdBySlotQuery,
  useTrackAdClickMutation,
} from "@/redux/api/advertisementApi";

export default function AdSlot({ slot, className = "" }) {
  const { data: adResponse, isLoading } = useGetActiveAdBySlotQuery(slot, {
    skip: !slot,
  });
  const [trackClick] = useTrackAdClickMutation();
  const [isPopupDismissed, setIsPopupDismissed] = useState(false);

  const ad = adResponse?.data;

  const handleClick = () => {
    if (ad?._id) {
      trackClick(ad._id);
    }
  };

  if (isLoading || !ad) {
    return null;
  }

  // Handle POP UP Ad Modal
  if (slot === "popup_ad") {
    if (isPopupDismissed) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative max-w-lg w-full overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setIsPopupDismissed(true)}
            className="absolute top-3 right-3 z-10 rounded-full bg-slate-900/70 p-1.5 text-white hover:bg-slate-900 transition-colors shadow-md"
            aria-label="Close Ad"
          >
            <X className="h-4 w-4" />
          </button>

          <a
            href={ad.clickUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="block group"
          >
            {ad.imageUrl && (
              <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/default_image.jpg";
                  }}
                />
              </div>
            )}
            <div className="p-4 bg-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Sponsored Partner
                </span>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">
                  {ad.title}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs group-hover:bg-primary/90 transition-colors">
                <span>Learn More</span>
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </a>
        </div>
      </div>
    );
  }

  // Handle In-Page Slots (Header, Sidebar, Mid-Content, Footer, Sponsored Post)
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs group my-4",
        className
      )}
    >
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
          Advertisement • স্পন্সরড
        </span>
      </div>

      <a
        href={ad.clickUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block relative overflow-hidden rounded-lg"
      >
        {ad.type === "html5" && ad.htmlContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: ad.htmlContent }}
            className="w-full overflow-hidden"
          />
        ) : ad.imageUrl ? (
          <div className="relative aspect-21/9 sm:aspect-16/5 w-full overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "/default_image.jpg";
              }}
            />
          </div>
        ) : (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
            <p className="text-xs font-bold text-primary">{ad.title}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click to view official safety notice</p>
          </div>
        )}
      </a>
    </div>
  );
}
