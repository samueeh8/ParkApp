import React, { ReactNode } from "react";
import Navbar from "@/Components/navbar/navbar";
import Footer from "@/Components/ui/Footer";

export default function MainPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="container mx-auto p-4 pt-20">{children}</div>
      <Footer />
    </div>
  );
}
