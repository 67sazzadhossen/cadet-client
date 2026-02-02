import React from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="flex items-center gap-3 group cursor-pointer">
      {/* Main Logo - Fixed */}
      <div className="relative">
        <div className="w-12 h-12 ">
          <Image
            src={logo}
            alt="Gazipur Shaheen Cadet Academy Logo"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        {/* Main Title */}
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-gray-900 tracking-wide">
            GAZIPURSHAHEEN
          </span>
          <span className="text-sm font-semibold text-blue-800 tracking-wider uppercase">
            Cadet Academy
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
