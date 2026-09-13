// src/components/common/WhatsAppButton.jsx

"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppButton({
  phoneNumber = "+8801712345678",
  message = "Hello, I would like to inquire about LPG Safety & Guidelines.",
  className = "",
}) {
  // Format phone number to clean international format without '+' or spaces
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <aside
      aria-label="WhatsApp Contact Support"
      className={`fixed bottom-6 right-6 z-50 flex items-center group ${className}`}
    >
      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-md transition-all duration-200 group-hover:block whitespace-nowrap border border-white/10">
        Chat with us on WhatsApp
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900/90" />
      </span>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        {/* WhatsApp Icon */}
        <FaWhatsapp className="relative z-10 h-8 w-8 drop-shadow-sm" />
      </a>
    </aside>
  );
}
