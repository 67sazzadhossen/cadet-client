import ManageUserNav from "@/components/Navbar/ManageUserNav";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <nav>
        <ManageUserNav />
      </nav>
      {children}
    </div>
  );
};

export default layout;
