// src/components/common/AelLogo.jsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function AelLogo({ className = "", light = false, width = 160, height = 40 }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-opacity hover:opacity-95 ${className}`}
    >
      <Image
        src="/safe_lpg.png"
        alt="Safe LPG Logo"
        width={width}
        height={height}
        priority
        className={`h-9 sm:h-10 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

export { AelLogo as SafeLpgLogo };
