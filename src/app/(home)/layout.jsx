// src/app/(home)/layout.jsx

import Footer from "@/components/common/footer/footer";
import Navbar from "@/components/common/navbar/navbar";
import { getLocale, getDict } from "@/lib/i18n";

export default async function HomeLayout({ children }) {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);

  return (
    <>
      <Navbar dict={dict.navbar} commonDict={dict.common} locale={locale} />
      {children}
      <Footer dict={dict.footer} commonDict={dict.common} locale={locale} />
    </>
  );
}
