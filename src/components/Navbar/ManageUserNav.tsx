"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

const ManageUserNav = () => {
  const pathName = usePathname();

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
  ];

  return (
    <div className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 p-1 rounded-2xl border border-gray-200 shadow-lg space-x-3">
      {navItems.map((item) => {
        const isActive = pathName === item.link;

        return (
          <Link
            key={item.link}
            href={item.link}
            className={`relative text-sm rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              isActive
                ? "bg-gradient-to-br text-white shadow-xl transform scale-[1.02]"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            } ${
              isActive && item.link.includes("students")
                ? "from-purple-600 to-violet-700"
                : isActive
                ? "from-orange-600 to-amber-700"
                : ""
            }`}
          >
            {/* Icon with background */}
            <div
              className={`p-2 rounded-lg ${
                isActive
                  ? "bg-white/20"
                  : "bg-gradient-to-br from-gray-200 to-gray-300"
              }`}
            >
              <div className={isActive ? "text-white" : "text-gray-600"}>
                {item.icon}
              </div>
            </div>

            {/* Text */}
            <span className="whitespace-nowrap">{item.name}</span>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-white/0 via-white to-white/0 rounded-full"></div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ManageUserNav;
