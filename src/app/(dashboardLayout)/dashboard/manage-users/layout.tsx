import SubNavbar from "@/components/Navbar/SubNavbar";
import React, { ReactNode } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa6";

const layout = ({ children }: { children: ReactNode }) => {
  const navItems = [
    {
      name: "All Students",
      link: "/dashboard/manage-users",
      icon: <FaUserGraduate className="w-5 h-5" />,
    },
    {
      name: "All Teachers",
      link: "/dashboard/manage-users/all-teachers",
      icon: <FaChalkboardTeacher className="w-5 h-5" />,
    },
    {
      name: "Add Student",
      link: "/dashboard/manage-users/add-student",
      icon: <BiAddToQueue className="w-5 h-5" />,
    },
    {
      name: "Add Teacher",
      link: "/dashboard/manage-users/add-teacher",
      icon: <BiAddToQueue className="w-5 h-5" />,
    },
  ];
  return (
    <div>
      <nav>
        <SubNavbar navItems={navItems} />
      </nav>
      {children}
    </div>
  );
};

export default layout;
