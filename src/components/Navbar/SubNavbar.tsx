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
        <div className="dashboard-glass overflow-x-auto p-1.5">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = pathName === item.link;

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg"
                      : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`h-6 w-6 ${isActive ? "text-white" : "text-blue-200/70"}`}
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
        <div className="dashboard-glass inline-flex items-center gap-1 p-1">
          {navItems.map((item) => {
            const isActive = pathName === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className={`relative text-sm rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 px-4 py-2 ${
                  isActive
                    ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl"
                    : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {/* Icon with background */}
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? "bg-white/20"
                      : "bg-white/10"
                  }`}
                >
                  <div
                    className={`h-5 w-5 ${isActive ? "text-white" : "text-blue-200/70"}`}
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
