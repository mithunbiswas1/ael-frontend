// src/components/shared/CertificateDocument.jsx
"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export const CertificateDocument = forwardRef(function CertificateDocument(
  { certificate, className, showQr = true },
  ref
) {
  if (!certificate) return null;

  const instituteName =
    certificate.instituteName ||
    certificate.issuingAuthority ||
    "Auto LPG Engineering Training Institute L.L.C";
  const instituteAddress =
    certificate.instituteAddress ||
    "Bank Street, Dhanmondi, Dhaka, Bangladesh • PB: 1209";
  const permitNo =
    certificate.permitNo || certificate.khdaPermit || "AEL-DOE-62621";
  const phone = certificate.phone || "+880 9603 44 66 89";
  const email = certificate.email || "support@safelpg.com";
  const web = certificate.web || "www.safelpg.com";
  const sealText =
    certificate.sealText || "Auto LPG Engineering Institute";
  const sealLocation =
    certificate.sealLocation || "DHAKA - B.D.";

  const studentName =
    certificate.studentName || certificate.recipientName || "Abdulmajeed";
  const courseTitle =
    certificate.courseTitle ||
    certificate.title ||
    "HVAC Systems Design & Technical Engineering";
  const certId =
    certificate.certificateId || certificate.id || "CERT-LPG-001";
  const regNo =
    certificate.regNo ||
    certificate.studentRegNo ||
    `AIT${String(certId).replace(/[^0-9]/g, "").padStart(4, "0") || "4937"}`;
  const grade = certificate.grade || "Pass (90%)";
  const duration =
    certificate.duration ||
    (certificate.issueDate
      ? `ISSUED : ${certificate.issueDate.toUpperCase()} • LIFETIME VALIDITY`
      : "MARCH 15 2024 TO JUN 11 2024");
  const authorizedSignatory =
    certificate.authorizedBy || "Mr. Mathew";
  const signatoryTitle =
    certificate.signatoryRole || "PROGRAM MANAGER";
  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify-certificate?id=${certId}`
      : `https://safelpg.com/verify-certificate?id=${certId}`;

  return (
    <div
      ref={ref}
      id="printable-certificate"
      className={cn(
        "relative w-full max-w-[1000px] mx-auto aspect-[1.414/1] bg-[#FAF8F5] text-slate-800 shadow-2xl overflow-hidden select-none print:shadow-none print:m-0 print:w-full print:max-w-none print:aspect-[1.414/1]",
        className
      )}
      style={{
        boxSizing: "border-box",
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* 1. Ornate Multi-Layered Guilloche Vector Border */}
      <div className="absolute inset-0 pointer-events-none p-3 sm:p-5">
        <svg
          className="w-full h-full text-[#B8860B]"
          viewBox="0 0 1000 707"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Outer Border Line */}
          <rect
            x="4"
            y="4"
            width="992"
            height="699"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />

          {/* Intricate Repeated Guilloche Fill Pattern */}
          <rect
            x="14"
            y="14"
            width="972"
            height="679"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            fill="none"
            opacity="0.8"
          />

          {/* Inner Ornate Border Frame */}
          <rect
            x="24"
            y="24"
            width="952"
            height="659"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />

          {/* Thin Inner Margin Line */}
          <rect
            x="30"
            y="30"
            width="940"
            height="647"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />

          {/* Corner Baroque Flourishes (Top-Left) */}
          <g transform="translate(18, 18)">
            <path
              d="M0,0 C25,5 45,25 50,50 C45,35 35,25 20,20 C10,18 5,10 0,0 Z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="15" cy="15" r="4" fill="currentColor" />
            <path
              d="M5,40 C15,35 25,25 35,15 C28,18 20,22 12,28 Z"
              fill="currentColor"
              opacity="0.75"
            />
            <path
              d="M0,70 C10,50 25,35 50,25 C30,30 20,45 10,65 Z"
              fill="currentColor"
              opacity="0.6"
            />
          </g>

          {/* Corner Baroque Flourishes (Top-Right) */}
          <g transform="translate(982, 18) scale(-1, 1)">
            <path
              d="M0,0 C25,5 45,25 50,50 C45,35 35,25 20,20 C10,18 5,10 0,0 Z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="15" cy="15" r="4" fill="currentColor" />
            <path
              d="M5,40 C15,35 25,25 35,15 C28,18 20,22 12,28 Z"
              fill="currentColor"
              opacity="0.75"
            />
            <path
              d="M0,70 C10,50 25,35 50,25 C30,30 20,45 10,65 Z"
              fill="currentColor"
              opacity="0.6"
            />
          </g>

          {/* Corner Baroque Flourishes (Bottom-Left) */}
          <g transform="translate(18, 689) scale(1, -1)">
            <path
              d="M0,0 C25,5 45,25 50,50 C45,35 35,25 20,20 C10,18 5,10 0,0 Z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="15" cy="15" r="4" fill="currentColor" />
            <path
              d="M5,40 C15,35 25,25 35,15 C28,18 20,22 12,28 Z"
              fill="currentColor"
              opacity="0.75"
            />
            <path
              d="M0,70 C10,50 25,35 50,25 C30,30 20,45 10,65 Z"
              fill="currentColor"
              opacity="0.6"
            />
          </g>

          {/* Corner Baroque Flourishes (Bottom-Right) */}
          <g transform="translate(982, 689) scale(-1, -1)">
            <path
              d="M0,0 C25,5 45,25 50,50 C45,35 35,25 20,20 C10,18 5,10 0,0 Z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="15" cy="15" r="4" fill="currentColor" />
            <path
              d="M5,40 C15,35 25,25 35,15 C28,18 20,22 12,28 Z"
              fill="currentColor"
              opacity="0.75"
            />
            <path
              d="M0,70 C10,50 25,35 50,25 C30,30 20,45 10,65 Z"
              fill="currentColor"
              opacity="0.6"
            />
          </g>

          {/* Center-Top Filigree Accent */}
          <path
            d="M470,24 C485,16 500,12 515,16 C530,20 540,24 550,24 C535,24 515,18 500,18 C485,18 475,22 470,24 Z"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* 2. Certificate Body Content */}
      <div className="relative z-10 flex flex-col justify-between h-full px-8 sm:px-14 md:px-20 py-6 sm:py-9 md:py-11 text-center">
        {/* Top Header & Institute Crest */}
        <div className="flex flex-col items-center">
          {/* Official Institute Crest with Ribbon */}
          <div className="relative flex flex-col items-center mb-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] p-1 bg-white shadow-xs flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-amber-300 flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100/50">
                <svg
                  className="w-8 h-8 sm:w-9 sm:h-9 text-[#8B5A2B]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>

            {/* Purple / Gold Ribbon Banner */}
            <div className="-mt-2 bg-[#2D112C] text-[#EADBB6] px-4 py-0.5 rounded-xs text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-widest shadow-xs border border-amber-400/40">
              Training Institute L.L.C
            </div>
          </div>

          {/* Institute Name */}
          <h1 className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wider text-slate-800 font-sans mt-1">
            {instituteName}
          </h1>
          <p className="text-[9px] sm:text-[10px] text-slate-500 font-sans tracking-wide">
            {instituteAddress}
          </p>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 font-sans tracking-wider uppercase mt-0.5">
            PERMIT / REGISTRATION NUMBER: {permitNo}
          </p>
        </div>

        {/* Main Certificate Title */}
        <div className="my-1 sm:my-2">
          <h2
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#7C481A]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: "1px 1px 0px rgba(255,255,255,0.8)",
            }}
          >
            Professional Diploma
          </h2>
          <div className="text-[10px] sm:text-xs md:text-sm font-sans font-black uppercase tracking-[0.35em] text-slate-800 mt-0.5 sm:mt-1">
            CERTIFICATE
          </div>
          <p className="text-[11px] sm:text-xs italic text-slate-600 font-serif mt-1">
            Is Proudly Presented To
          </p>
        </div>

        {/* Recipient Student Name in Grand Calligraphy Script */}
        <div className="my-1 sm:my-2 flex flex-col items-center">
          <div
            className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-[#4A2E1B] tracking-wide px-4 font-normal"
            style={{
              fontFamily:
                "'Great Vibes', 'Brush Script MT', 'Baskerville', 'Playfair Display', cursive, serif",
            }}
          >
            {studentName}
          </div>

          {/* Elegant Filigree Line Divider */}
          <div className="w-full max-w-md flex items-center justify-center gap-2 mt-1 text-[#B8860B]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#B8860B] to-[#B8860B]/60" />
            <div className="w-2 h-2 rotate-45 border border-current bg-[#FAF8F5]" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#B8860B] to-[#B8860B]/60" />
          </div>
        </div>

        {/* Statement of Completion & Course Title */}
        <div className="my-1">
          <p className="text-[10px] sm:text-xs text-slate-600 font-serif">
            For Successfully Completing the Training in
          </p>
          <h3 className="text-base sm:text-xl md:text-2xl font-black uppercase text-slate-900 font-serif tracking-wide mt-1">
            {courseTitle}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-700 font-sans tracking-wider font-semibold mt-1">
            Duration :{" "}
            <span className="font-bold text-slate-900 uppercase">
              {duration}
            </span>
          </p>
        </div>

        {/* Center Meta Info (Reg No & Permit No) */}
        <div className="flex flex-col items-center justify-center text-[9px] sm:text-[10px] font-sans font-bold text-slate-600 tracking-wider">
          <div className="flex items-center gap-6">
            <span>
              STUDENT REG NO :{" "}
              <strong className="text-slate-900 font-mono">{regNo}</strong>
            </span>
            <span>
              KHDA PERMIT NO :{" "}
              <strong className="text-slate-900 font-mono">{permitNo}</strong>
            </span>
          </div>
        </div>

        {/* Bottom Signatures, Official Seal & QR Code */}
        <div className="grid grid-cols-3 items-end pt-2 sm:pt-4">
          {/* Left: Authentic Fluid Signature */}
          <div className="flex flex-col items-center sm:items-start text-left pl-2 sm:pl-4">
            <div className="h-10 sm:h-12 flex items-end">
              {/* SVG Fluid Signature Curve */}
              <svg
                className="w-24 sm:w-32 h-9 sm:h-11 text-[#0f2452]"
                viewBox="0 0 160 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10,38 C25,10 35,45 45,20 C55,8 60,35 75,25 C85,15 105,10 115,22 C125,32 135,15 145,25 M115,22 C135,5 155,18 145,40 C135,52 110,48 95,42"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="w-28 sm:w-36 h-[1px] bg-slate-700 mt-0.5" />
            <span className="text-[10px] sm:text-xs font-serif font-bold text-slate-800 mt-1">
              {authorizedSignatory}
            </span>
            <span className="text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider text-slate-500">
              {signatoryTitle}
            </span>
          </div>

          {/* Center: Digital Verification QR Code */}
          <div className="flex flex-col items-center justify-end pb-1">
            {showQr && (
              <div className="flex flex-col items-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    verificationUrl
                  )}`}
                  alt="Certificate Verification QR"
                  className="w-12 h-12 sm:w-14 sm:h-14 p-0.5 border border-slate-300 rounded bg-white shadow-2xs"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
                <span className="text-[7px] sm:text-[8px] font-sans font-bold uppercase text-slate-400 mt-1 tracking-wider">
                  Scan to Verify
                </span>
                <span className="text-[7px] sm:text-[8px] font-mono text-slate-500 font-semibold">
                  {certId}
                </span>
              </div>
            )}
          </div>

          {/* Right: Authentic Stamped Ink Institute Seal */}
          <div className="flex flex-col items-center sm:items-end text-right pr-2 sm:pr-4">
            <div className="relative flex flex-col items-center">
              {/* Circular Stamp with authentic dark navy ink */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-double border-[#1B365D] text-[#1B365D] p-1 flex flex-col items-center justify-center text-center rotate-[-3deg] shadow-2xs">
                <div className="w-full h-full rounded-full border border-dashed border-[#1B365D] flex flex-col items-center justify-center p-1 leading-none">
                  <span className="text-[6px] sm:text-[7px] font-sans font-extrabold uppercase tracking-tighter truncate max-w-[68px]">
                    {sealText}
                  </span>
                  <span className="text-[5px] sm:text-[6px] font-sans uppercase my-0.5 font-bold">
                    P.O.BOX: 1209
                  </span>
                  <span className="text-[5px] sm:text-[6px] font-sans uppercase font-bold">
                    {sealLocation}
                  </span>
                  <div className="text-[6px] sm:text-[7px] text-[#1B365D] mt-0.5">
                    ★ ★ ★
                  </div>
                </div>
              </div>
              <span className="text-[8px] sm:text-[9px] font-sans font-extrabold uppercase tracking-widest text-slate-700 mt-1">
                INSTITUTE SEAL
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Fine Footer Line */}
        <div className="border-t border-slate-300/80 pt-1 mt-1 text-[8px] sm:text-[9px] font-sans text-slate-500 flex flex-wrap items-center justify-center gap-4 sm:gap-8 tracking-wider">
          <span>
            Phone: <strong className="text-slate-700">{phone}</strong>
          </span>
          <span>
            Email: <strong className="text-slate-700">{email}</strong>
          </span>
          <span>
            Web: <strong className="text-slate-700">{web}</strong>
          </span>
        </div>
      </div>
    </div>
  );
});

export default CertificateDocument;
