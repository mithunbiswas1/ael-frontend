"use client";

import { toast } from "sonner";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

export default function BlogSocialShare({ title }) {
  const handleShare = (platform) => {
    toast.success(`Sharing "${title || "article"}" to ${platform}...`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-700">Share:</span>
      <button
        onClick={() => handleShare("Facebook")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xs hover:opacity-90 transition-opacity"
        title="Share on Facebook"
      >
        <FaFacebookF className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => handleShare("Twitter")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-2xs hover:opacity-90 transition-opacity"
        title="Share on Twitter"
      >
        <FaTwitter className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => handleShare("LinkedIn")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-white shadow-2xs hover:opacity-90 transition-opacity"
        title="Share on LinkedIn"
      >
        <FaLinkedinIn className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => handleShare("WhatsApp")}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs hover:opacity-90 transition-opacity"
        title="Share on WhatsApp"
      >
        <FaWhatsapp className="h-4 w-4" />
      </button>
    </div>
  );
}
