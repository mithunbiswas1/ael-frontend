// src/components/common/AelLogo.jsx
"use client";

import Link from "next/link";

export default function AelLogo({ className = "", light = false }) {
  const primaryColor = light ? "#38bdf8" : "#1d4ed8";
  const textColor = light ? "#ffffff" : "#1e40af";

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      <svg
        viewBox="0 0 160 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-auto"
      >
        {/* Dynamic Sweeping Orbit / Ellipse */}
        <ellipse
          cx="80"
          cy="26"
          rx="72"
          ry="21"
          stroke={primaryColor}
          strokeWidth="3.5"
          transform="rotate(-5 80 26)"
          strokeDasharray="400"
          strokeDashoffset="10"
        />
        {/* Inner swoosh accent */}
        <path
          d="M 20 34 C 40 45, 120 45, 142 22"
          stroke={light ? "#60a5fa" : "#2563eb"}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Styled Bold Italic AEL Text */}
        <text
          x="80"
          y="34"
          textAnchor="middle"
          fill={textColor}
          fontSize="30"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2"
        >
          AEL
        </text>
      </svg>
    </Link>
  );
}
