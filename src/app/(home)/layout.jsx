// src/app/(home)/layout.jsx

import Footer from "@/components/common/footer/footer";
import Navbar from "@/components/common/navbar/navbar";

export default function HomeLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
