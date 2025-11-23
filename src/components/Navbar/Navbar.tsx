"use client";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import secondLogo from "@/assets/second_logo.png";
import Image from "next/image";
import Link from "next/link";
import { BiLocationPlus } from "react-icons/bi";
import {
  MdEmail,
  MdMenu,
  MdClose,
  MdDashboard,
  MdLogout,
} from "react-icons/md";
import { GoGlobe } from "react-icons/go";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { TAdmin } from "@/types/index.type";

type TCurrentUser = TAdmin;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetMeQuery(undefined);
  const currentUserData: TCurrentUser = data?.data?.data;
  // console.log(currentUserData);

  // User login থাকলে navItems থেকে Login remove করুন
  const baseNavItems = [
    { name: "Home", link: "/" },
    {
      name: "Academic Info",
      subItems: [
        { name: "Notice Board", link: "/academic-info/notice" },
        { name: "Class Routine", link: "/academic-info/class-routine" },
        { name: "Teacher Info", link: "/academic-info/teachers" },
      ],
    },
    {
      name: "Exam Result",
      subItems: [
        { name: "PSC Result", link: "/exam-result/psc" },
        { name: "JSC Result", link: "/exam-result/jsc" },
        { name: "SSC Result", link: "/exam-result/ssc" },
      ],
    },
    { name: "Download", link: "/download" },
    { name: "Gallery", link: "/gallery" },
    {
      name: "Online Activity",
      subItems: [
        { name: "Online Class", link: "/online-activity/class" },
        { name: "Assignment", link: "/online-activity/assignment" },
      ],
    },
    {
      name: "About Us",
      subItems: [
        { name: "Our Teachers", link: "/about-us/teachers" },
        { name: "Mission & Vision", link: "/about-us/mission&vision" },
        {
          name: "Chairman/President List",
          link: "/about-us/chairman/president-list",
        },
      ],
    },
    { name: "Scholarship", link: "/scholarship" },
  ];

  // User login থাকলে Login button add করবেন না
  const navItems = currentUser
    ? baseNavItems
    : [...baseNavItems, { name: "Login", link: "/login" }];

  // Profile dropdown items
  const profileItems = [
    { name: "Dashboard", link: "/dashboard", icon: <MdDashboard size={18} /> },
    { name: "Logout", link: "/logout", icon: <MdLogout size={18} /> },
  ];

  return (
    <div className="px-3 py-1 md:py-2 flex justify-between items-center relative overflow-visible">
      {/* logo */}
      <div className="flex items-center gap-2 ">
        <Image
          priority
          className="w-12 md:w-full"
          src={logo}
          alt="logo"
          width={60}
          height={200}
        />
        <div className="w-[1px] h-20 bg-blue-800 rounded-full hidden md:block"></div>
        <Image
          priority
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
            <BiLocationPlus size={20} /> F-224, Joorpukur Road, Gazipur-1700
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
        <ul className="flex gap-10 items-center whitespace-nowrap text-sm uppercase font-bold text-blue-900 relative z-[100]">
          {navItems.map((item, idx) => (
            <li key={idx} className="relative group z-[100]">
              {/* parent item */}
              {item.subItems ? (
                <div className="cursor-pointer flex items-center hover:text-red-800 duration-300">
                  {item.name}
                  <span className="font-extrabold text-xl ml-2 -mt-1">+</span>

                  {/* dropdown */}
                  <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[200] min-w-[180px]">
                    {item.subItems.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={sub.link}
                          className="block px-4 py-2 text-blue-900 hover:bg-blue-900 hover:text-white duration-200"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
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
              )}
            </li>
          ))}

          {/* User Profile Photo & Dropdown - শুধু login থাকলে show করবে */}
          {currentUser && (
            <li className="relative group">
              {isLoading ? (
                <div className="loading w-10 h-10"></div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  {currentUserData?.image ? (
                    <Image
                      priority
                      src={currentUserData.image.url}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-900"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                      {currentUserData?.name?.englishName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Dropdown */}
              {profileDropdown && (
                <ul className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md z-[200] min-w-[180px] py-2">
                  {profileItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.link}
                        className="flex items-center gap-2 px-4 py-2 text-blue-900 hover:bg-blue-900 hover:text-white duration-200"
                        onClick={() => setProfileDropdown(false)}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* Mobile menu button */}
      <div
        className="text-3xl text-blue-900 cursor-pointer lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <MdClose /> : <MdMenu />}
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out 
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <MdClose
            size={28}
            className="cursor-pointer text-blue-900"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        {/* Mobile User Info - শুধু login থাকলে show করবে */}
        {currentUser && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {currentUserData?.image ? (
                <div className="flex items-center justify-between gap-6">
                  {isLoading ? (
                    <div className="w-20 h-20 loading"></div>
                  ) : (
                    <Image
                      src={currentUserData.image.url}
                      priority
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-900 p-1"
                    />
                  )}

                  {/* Mobile Profile Links - শুধু login থাকলে show করবে */}
                  <div className="">
                    {currentUser &&
                      profileItems.map((item, index) => (
                        <li
                          key={`profile-${index}`}
                          className=" w-full list-none flex"
                        >
                          <Link
                            href={item.link}
                            className="flex items-center justify-center gap-2 text-blue-900 hover:text-red-800 duration-300 py-2"
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        </li>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-lg">
                  {currentUserData?.name?.englishName?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>
        )}

        <ul className="flex flex-col items-center gap-6 mt-4 text-base uppercase font-bold text-blue-900">
          {navItems.map((item, idx) => (
            <li key={idx} className="text-center w-full">
              {item.subItems ? (
                <details className="w-full">
                  <summary className="cursor-pointer hover:text-red-800 py-2 px-4">
                    {item.name}
                  </summary>
                  <ul className="flex flex-col gap-2 mt-2 bg-gray-50 py-2">
                    {item.subItems.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={sub.link}
                          className="block text-blue-900 hover:text-red-800 duration-200 px-6 py-1"
                          onClick={() => setMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  href={item.link}
                  className={`block text-center w-full py-2 ${
                    item.link === "/login"
                      ? "bg-blue-900 text-white px-6 py-2 rounded-2xl hover:bg-red-800 duration-300 mx-4"
                      : "hover:text-red-800 duration-300"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
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
