"use client";
import React, { useState, useEffect } from "react";
// import logo from "@/assets/logo.png";
// import secondLogo from "@/assets/second_logo.png";
import Image from "next/image";
import Link from "next/link";
import { BiLocationPlus } from "react-icons/bi";
import {
  MdEmail,
  MdMenu,
  MdClose,
  MdDashboard,
  MdLogout,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { GoGlobe } from "react-icons/go";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { TAdmin } from "@/types/index.type";
import Logo from "../shared/Logo";

type TCurrentUser = TAdmin;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetMeQuery(undefined);
  const currentUserData: TCurrentUser = data?.data?.data;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Nav items
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

  const navItems = currentUser ? baseNavItems : [...baseNavItems];

  const profileItems = [
    { name: "Dashboard", link: "/dashboard", icon: <MdDashboard size={18} /> },
    { name: "Logout", link: "/logout", icon: <MdLogout size={18} /> },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 backdrop-filter ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
          : "bg-white/90 backdrop-blur-md border-b border-gray-100"
      }`}
    >
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-2 px-4">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BiLocationPlus size={16} className="text-blue-200" />
                <span className="text-blue-100">
                  F-224, Joorpukur Road, Gazipur-1700
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <MdEmail size={16} className="text-blue-200" />
                <span className="text-blue-100">gazipurshaheen@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GoGlobe size={16} className="text-blue-200" />
              <span className="text-blue-100">gsca.edu.bd</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-[1920px] mx-auto px-6 xl:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo Section - Left Side */}
          {/* <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Image
                priority
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
                src={logo}
                alt="logo"
                width={56}
                height={56}
              />
              <div className="w-px h-12 bg-gray-300 hidden md:block"></div>
              <Image
                priority
                className="w-28 md:w-36 object-contain"
                src={secondLogo}
                alt="second logo"
                width={144}
                height={48}
              />
            </div>
          </div> */}

          <Logo />

          {/* Desktop Navigation - Center with proper spacing */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-12">
            <ul className="flex items-center justify-center gap-0">
              {navItems.map((item, idx) => (
                <li key={idx} className="relative group">
                  {item.subItems ? (
                    <div className="relative">
                      <button className="flex items-center gap-1 px-5 py-3 text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 group-hover:bg-blue-50 rounded-lg whitespace-nowrap">
                        {item.name}
                        <MdKeyboardArrowDown
                          size={18}
                          className="transition-transform duration-300 group-hover:rotate-180"
                        />
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                        <div className="p-2">
                          {item.subItems.map((sub, i) => (
                            <Link
                              key={i}
                              href={sub.link}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.link}
                      className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                        item.link === "/login"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* User Profile - Right Side */}
          <div className="hidden xl:flex items-center">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  ) : currentUserData?.image ? (
                    <Image
                      src={currentUserData.image.url}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {currentUserData?.name?.englishName?.charAt(0) || "U"}
                    </div>
                  )}
                </button>

                {/* Profile Dropdown */}
                {profileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                    <div className="p-2">
                      {profileItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.link}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium"
                          onClick={() => setProfileDropdown(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href={"/login"} className="btn bg-blue-900 text-white">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
          >
            {menuOpen ? (
              <MdClose size={24} className="text-gray-700" />
            ) : (
              <MdMenu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {currentUser && !isLoading && (
                <>
                  {currentUserData?.image ? (
                    <Image
                      src={currentUserData.image.url}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                      {currentUserData?.name?.englishName?.charAt(0) || "U"}
                    </div>
                  )}
                </>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">Menu</h3>
                {currentUser && (
                  <p className="text-sm text-gray-600">Welcome back!</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <MdClose size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-1">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  {item.subItems ? (
                    <details className="group">
                      <summary className="flex items-center justify-between p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg cursor-pointer transition-all duration-300 font-medium">
                        {item.name}
                        <MdKeyboardArrowDown
                          size={18}
                          className="transition-transform duration-300 group-open:rotate-180"
                        />
                      </summary>
                      <ul className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((sub, i) => (
                          <li key={i}>
                            <Link
                              href={sub.link}
                              className="flex items-center p-3 text-gray-600 hover:bg-gray-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium"
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
                      className={`flex items-center p-4 rounded-lg transition-all duration-300 font-medium ${
                        item.link === "/login"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Profile Links for Mobile */}
            {currentUser && (
              <div className="p-4 border-t border-gray-100">
                <div className="space-y-1">
                  {profileItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="flex items-center gap-3 p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-300 font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className={`xl:hidden fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
            menuOpen
              ? "bg-black/40 backdrop-blur-sm visible opacity-100"
              : "bg-black/0 backdrop-blur-none invisible opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
