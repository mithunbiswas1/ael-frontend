// src/app/(pages)/layout.jsx

import Footer from "@/components/common/footer/footer";
import Navbar from "@/components/common/navbar/navbar";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { getLocale, getDict } from "@/lib/i18n";

export default async function PagesLayout({ children }) {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);

  return (
    <>
      <Navbar dict={dict.navbar} commonDict={dict.common} locale={locale} />
      {children}
      <WhatsAppButton />
      <Footer dict={dict.footer} commonDict={dict.common} locale={locale} />
    </>
  );
}
