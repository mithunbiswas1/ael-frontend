// src/app/layout.jsx

import { Manrope, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { defaultMetadata } from "@/lib/seo";
import { getLocale, getDict } from "@/lib/i18n";
import { DictionaryProvider } from "@/context/DictionaryContext";
import ReduxProvider from "@/redux/redux-provider/ReduxProvider";
import AdSlot from "@/components/shared/AdSlot";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata = defaultMetadata;

export default async function RootLayout({ children }) {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);

  return (
    <html lang={locale}>
      <body
        className={`${manrope.variable} ${hindSiliguri.variable} bg-page-back antialiased`}
        cz-shortcut-listen="true"
      >
        <ReduxProvider>
          <DictionaryProvider locale={locale} dict={dict}>
            {children}
            <AdSlot slot="popup_ad" />
            <Toaster position="top-center" richColors closeButton />
          </DictionaryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
