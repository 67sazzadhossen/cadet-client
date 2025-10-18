import React from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { BiLocationPlus } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { GoGlobe } from "react-icons/go";

const Navbar = () => {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Academic Info",
      link: "/academic-info",
    },
    {
      name: "Exam Result",
      link: "/exam-result",
    },
    {
      name: "Download",
      link: "/download",
    },
    {
      name: "Gallery",
      link: "/gallery",
    },
    {
      name: "Online Activity",
      link: "/online-activity",
    },
    {
      name: "About Us",
      link: "/about-us",
    },
    {
      name: "Login",
      link: "/login",
    },
    {
      name: "Scholarship",
      link: "/scholarship",
    },
  ];

  return (
    <div className="px-3 py-2 flex justify-between items-center">
      {/* logo */}
      <div className="flex items-center gap-2 ">
        <Image src={logo} alt="logo" width={80} height={200} />
        <div className="w-1 h-20 bg-blue-800 rounded-full"></div>
        <div className="flex flex-col">
          <h1 className="uppercase text-2xl font-bold bg-orange-500 rounded-full px-6 py-1 text-yellow-300 border-gray-100 border-4">
            gazipurshaheen
          </h1>
          <h1 className="text-2xl font-bold ml-2">Cadet Academy</h1>
        </div>
      </div>

      {/* nav items */}
      <div className="flex flex-col justify-between items-end h-full gap-3">
        <div className="flex items-center gap-6 font-semibold ">
          <div className="flex gap-1 items-center ">
            <BiLocationPlus size={20} /> F-224, Joorpukur Road, Gazipur-1700{" "}
          </div>
          <div className="flex gap-1 items-center ">
            <MdEmail size={20} />
            gazipurshaheen@gmail.com
          </div>
          <div className="flex gap-1 items-center ">
            <GoGlobe size={20} /> gsca.edu.bd
          </div>
        </div>
        <div className="w-3/4 h-[0.5px] bg-orange-500"></div>
        <ul className="flex gap-10 items-center text-lg uppercase font-bold text-orange-500">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <Link href={item.link}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
