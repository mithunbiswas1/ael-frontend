// src/components/shared/SocialShareBar.jsx
"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaLink,
  FaCheck,
} from "react-icons/fa";
import { toast } from "sonner";

export default function SocialShareBar({
  title = "",
  url = "",
  isBn = false,
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  const handleShare = (platform) => {
    const shareUrl = getShareUrl();
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    let targetUrl = "";
    if (platform === "facebook") {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === "twitter") {
      targetUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    } else if (platform === "linkedin") {
      targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === "whatsapp") {
      targetUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    }

    if (targetUrl) {
      window.open(
        targetUrl,
        "_blank",
        "noopener,noreferrer,width=600,height=500"
      );
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success(
          isBn ? "লিঙ্ক কপি করা হয়েছে!" : "Link copied to clipboard!"
        );
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      toast.error(
        isBn ? "লিঙ্ক কপি করা সম্ভব হয়নি" : "Failed to copy link"
      );
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-bold text-slate-700">
        {isBn ? "শেয়ার:" : "Share:"}
      </span>

      {/* Facebook */}
      <button
        type="button"
        onClick={() => handleShare("facebook")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-2xs hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
        title={isBn ? "ফেসবুকে শেয়ার করুন" : "Share on Facebook"}
        aria-label="Share on Facebook"
      >
        <FaFacebookF className="h-3.5 w-3.5" />
      </button>

      {/* Twitter / X */}
      <button
        type="button"
        onClick={() => handleShare("twitter")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1DA1F2] text-white shadow-2xs hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
        title={isBn ? "টুইটারে শেয়ার করুন" : "Share on Twitter / X"}
        aria-label="Share on Twitter"
      >
        <FaTwitter className="h-3.5 w-3.5" />
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={() => handleShare("linkedin")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-2xs hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
        title={isBn ? "লিংকডইনে শেয়ার করুন" : "Share on LinkedIn"}
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn className="h-3.5 w-3.5" />
      </button>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={() => handleShare("whatsapp")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xs hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
        title={isBn ? "হোয়াটসঅ্যাপে শেয়ার করুন" : "Share on WhatsApp"}
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp className="h-4 w-4" />
      </button>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all active:scale-95 cursor-pointer ${
          copied
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
        }`}
        title={
          copied
            ? (isBn ? "কপি সম্পন্ন!" : "Copied!")
            : (isBn ? "লিঙ্ক কপি করুন" : "Copy Link")
        }
        aria-label="Copy link"
      >
        {copied ? (
          <FaCheck className="h-3 w-3" />
        ) : (
          <FaLink className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}
