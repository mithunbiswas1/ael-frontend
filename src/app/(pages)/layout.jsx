// src/app/(pages)/layout.jsx

import Footer from "@/components/common/footer/footer";
import Navbar from "@/components/common/navbar/navbar";

export default function PagesLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
