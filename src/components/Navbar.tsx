"use client";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import secondLogo from "@/assets/second_logo.png";
import Image from "next/image";
import Link from "next/link";
import { BiLocationPlus } from "react-icons/bi";
import { MdEmail, MdMenu, MdClose } from "react-icons/md";
import { GoGlobe } from "react-icons/go";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Academic Info", link: "/academic-info" },
    { name: "Exam Result", link: "/exam-result" },
    { name: "Download", link: "/download" },
    { name: "Gallery", link: "/gallery" },
    { name: "Online Activity", link: "/online-activity" },
    { name: "About Us", link: "/about-us" },
    { name: "Scholarship", link: "/scholarship" },
    { name: "Login", link: "/login" },
  ];

  return (
    <div className="px-3 py-1 md:py-2 flex justify-between items-center relative overflow-hidden">
      {/* logo */}
      <div className="flex items-center gap-2 ">
        <Image
          className="w-12 md:w-full"
          src={logo}
          alt="logo"
          width={60}
          height={200}
        />
        <div className="w-[1px] h-20 bg-blue-800 rounded-full hidden md:block"></div>
        <Image
          className="w-24 md:w-32"
          src={secondLogo}
          alt="logo"
          width={140}
          height={200}
        />
      </div>

      {/* Desktop nav */}
      <div className="lg:flex flex-col justify-between items-end h-full gap-3 hidden">
        {/* address */}
        <div className="flex items-center gap-6 font-semibold text-sm text-red-800 ">
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
        <div className="w-3/4 h-[0.5px] bg-blue-800 mb-2"></div>

        {/* Navlinks */}
        <ul className="flex gap-10 items-center whitespace-nowrap text-sm uppercase font-bold text-blue-900">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <Link
                className={`${
                  item.link === "/login"
                    ? "bg-blue-900 text-white px-6 py-2 rounded-2xl hover:bg-red-800 duration-300"
                    : "hover:text-red-800 duration-300"
                }`}
                href={item.link}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile menu button */}
      <div
        className="text-3xl text-blue-900 cursor-pointer lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <MdClose /> : <MdMenu />}
      </div>

      {/* Mobile dropdown menu with slide animation */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out 
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button inside menu */}
        <div className="flex justify-end p-4">
          <MdClose
            size={28}
            className="cursor-pointer text-blue-900"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        <ul className="flex flex-col items-center gap-6 mt-4 text-base uppercase font-bold text-blue-900">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.link}
                className={`block text-center ${
                  item.link === "/login"
                    ? "bg-blue-900 text-white px-6 py-2 rounded-2xl hover:bg-red-800 duration-300"
                    : "hover:text-red-800 duration-300"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay with fade transition */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-500 ease-in-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </div>
  );
};

export default Navbar;
