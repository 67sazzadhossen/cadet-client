import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      {/* Navbar with proper z-index */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Main content - behind navbar during mobile menu */}
      <div className=" min-h-screen bg-gray-100">{children}</div>

      {/* Footer */}
      <footer className="relative z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default layout;
