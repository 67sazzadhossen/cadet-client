import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <nav>
        <Navbar />
      </nav>
      <div className="min-h-screen bg-gray-100">{children}</div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default layout;
