// src/app/layout.jsx

import { Manrope } from "next/font/google";

import "./globals.css";

import { Toaster } from "sonner";
import { defaultMetadata } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} bg-page-back antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
