"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const SubNavbar = ({
  navItems,
}: {
  navItems: {
    name: string;
    link: string;
    icon: ReactNode;
  }[];
}) => {
  const pathName = usePathname();

  return (
    <div className="w-full">
      {/* Mobile View - Icon Only with Labels Below */}
      <div className="block sm:hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-2xl border border-gray-200 shadow-lg">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = pathName === item.link;

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-orange-600 to-amber-700 text-white scale-105 shadow-lg"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  <span className="text-[10px] font-medium whitespace-nowrap">
                    {item.name}
                  </span>

                  {/* Active Dot Indicator */}
                  {isActive && (
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop View - Original Design with Icons */}
      <div className="hidden sm:block">
        <div className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 p-1 rounded-2xl border border-gray-200 shadow-lg space-x-3">
          {navItems.map((item) => {
            const isActive = pathName === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className={`relative text-sm rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 px-4 py-2 ${
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
                  <div
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Text */}
                <span className="whitespace-nowrap">{item.name}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-white/0 via-white to-white-100/50 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
