import SubNavbar from "@/components/Navbar/SubNavbar";
import React, { ReactNode } from "react";
import { BiDollar } from "react-icons/bi";
import { FaUserGraduate } from "react-icons/fa6";

const layout = ({ children }: { children: ReactNode }) => {
  const navItems = [
    {
      name: "Accounts Overview",
      link: "/dashboard/accounts",
      icon: <FaUserGraduate className="w-5 h-5" />,
    },
    {
      name: "Self Pay",
      link: "/dashboard/accounts/self-pay",
      icon: <BiDollar className="w-5 h-5" />,
    },
    {
      name: "Create Monthly Fee Information",
      link: "/dashboard/accounts/create-monthly-fee",
      icon: <FaUserGraduate className="w-5 h-5" />,
    },
    {
      name: "Create Session Fee Information",
      link: "/dashboard/accounts/create-session-fee",
      icon: <FaUserGraduate className="w-5 h-5" />,
    },
    {
      name: "Create Semester Fee Information",
      link: "/dashboard/accounts/create-semester-fee",
      icon: <FaUserGraduate className="w-5 h-5" />,
    },
  ];
  return (
    <div>
      <SubNavbar navItems={navItems} />
      {children}
    </div>
  );
};

export default layout;
