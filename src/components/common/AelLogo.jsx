// src/components/common/AelLogo.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetPublicSettingsQuery } from "@/redux/api/adminApi";

export default function AelLogo({
  className = "",
  light = false,
  width = 160,
  height = 40,
  isFooter = false,
}) {
  const { data } = useGetPublicSettingsQuery();
  const settings = data?.data;

  const rawSrc = isFooter
    ? settings?.footerLogo || settings?.siteLogo || "/safe_lpg_2.png"
    : settings?.siteLogo || "/safe_lpg_2.png";

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8005";
  const logoSrc =
    rawSrc.startsWith("http") || rawSrc.startsWith("/")
      ? rawSrc
      : `${backendUrl}${rawSrc.startsWith("/") ? "" : "/"}${rawSrc}`;

  const altText = settings?.siteName || "Safe LPG Logo";

  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-opacity hover:opacity-95 ${className}`}
    >
      <Image
        src={logoSrc}
        alt={altText}
        width={width}
        height={height}
        priority
        unoptimized={logoSrc.startsWith("http")}
        className={`h-9 sm:h-10 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

export { AelLogo as SafeLpgLogo };
