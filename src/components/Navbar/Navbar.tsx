"use client";
import React, { useState, useEffect } from "react";
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
import { TCurrentUser } from "@/types/index.type";
import Logo from "../shared/Logo";
import { motion, AnimatePresence, Variants } from "framer-motion";
import HandleLogout from "@/utils/HandleLogout";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const { data, isLoading } = useGetMeQuery(undefined);
  const currentUserData: TCurrentUser = data?.data?.data;
  const handleLogout = HandleLogout();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  // Animation variants
  const mobileMenuVariants: Variants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-500 top-0 left-0  z-50 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
            : "bg-white/90 backdrop-blur-md "
        }`}
      >
        {/* Top Info Bar - Hidden on mobile */}
        <div className="hidden sm:block bg-gradient-to-br from-gray-900 to-blue-900 text-white py-2">
          <div className="w-full px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <BiLocationPlus size={16} className="text-blue-200" />
                  <span className="text-blue-100 text-xs sm:text-sm">
                    F-224, Joorpukur Road, Gazipur-1700
                  </span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <MdEmail size={16} className="text-blue-200" />
                  <span className="text-blue-100 text-sm">
                    gazipurshaheen@gmail.com
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GoGlobe size={16} className="text-blue-200" />
                <span className="text-blue-100 text-xs sm:text-sm">
                  gsca.edu.bd
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="w-full py-2 px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation - All items in one row */}
            <div className="hidden lg:flex items-center justify-end flex-1">
              <div className="flex items-center space-x-1">
                {navItems.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {item.subItems ? (
                      <>
                        <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 group-hover:bg-blue-50 rounded-lg whitespace-nowrap text-[15px]">
                          {item.name}
                          <MdKeyboardArrowDown
                            size={16}
                            className="transition-transform duration-300 group-hover:rotate-180"
                          />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                          <div className="p-2">
                            {item.subItems.map((sub, i) => (
                              <Link
                                key={i}
                                href={sub.link}
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-sm"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.link}
                        className="px-4 py-2 text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 hover:bg-blue-50 rounded-lg whitespace-nowrap text-[15px]"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Auth Section - Right beside nav items */}
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                {currentUser ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                      ) : currentUserData?.image ? (
                        <Image
                          src={currentUserData.image.url}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                          {currentUserData?.name?.englishName?.charAt(0) || "U"}
                        </div>
                      )}
                      <span className="text-gray-700 font-medium text-sm hidden xl:block">
                        {currentUserData?.name?.englishName || "User"}
                      </span>
                    </button>

                    {profileDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                        <div className="p-2">
                          <Link
                            href={"/dashboard"}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-sm"
                            onClick={() => setProfileDropdown(false)}
                          >
                            <MdDashboard size={18} />
                            Dashboard
                          </Link>
                          <button
                            className="flex items-center gap-3 px-4 py-3  w-full text-gray-700 hover:bg-red-700 hover:text-white rounded-lg transition-all duration-200 font-medium text-sm"
                            onClick={() => {
                              setProfileDropdown(false);
                              handleLogout();
                            }}
                          >
                            <MdLogout size={18} />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300 text-[15px] whitespace-nowrap"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Tablet Navigation - Nav items and auth together */}
            <div className="hidden md:flex lg:hidden items-center justify-end flex-1">
              <div className="flex items-center space-x-2">
                {navItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="relative group">
                    {item.subItems ? (
                      <>
                        <button className="flex items-center gap-1 px-2 py-2 text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 group-hover:bg-blue-50 rounded-lg whitespace-nowrap text-xs">
                          {item.name}
                          <MdKeyboardArrowDown
                            size={14}
                            className="transition-transform duration-300 group-hover:rotate-180"
                          />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                          <div className="p-2">
                            {item.subItems.map((sub, i) => (
                              <Link
                                key={i}
                                href={sub.link}
                                className="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-xs"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.link}
                        className="px-2 py-2 text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 hover:bg-blue-50 rounded-lg whitespace-nowrap text-xs"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                {/* More dropdown for tablet */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-2 py-2 text-gray-700 hover:text-blue-700 font-medium transition-all duration-300 group-hover:bg-blue-50 rounded-lg whitespace-nowrap text-xs">
                    More
                    <MdKeyboardArrowDown
                      size={14}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-2">
                      {navItems.slice(3).map((item, i) => (
                        <div key={i}>
                          {item.subItems ? (
                            <div className="relative group/sub">
                              <button className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-xs">
                                {item.name}
                                <MdKeyboardArrowDown
                                  size={12}
                                  className="transition-transform duration-300 group-hover/sub:rotate-180"
                                />
                              </button>
                              <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300">
                                <div className="p-2">
                                  {item.subItems.map((sub, j) => (
                                    <Link
                                      key={j}
                                      href={sub.link}
                                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-xs"
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
                              className="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-xs"
                            >
                              {item.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet Auth Section - Right beside nav items */}
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                {currentUser ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse"></div>
                      ) : currentUserData?.image ? (
                        <Image
                          src={currentUserData.image.url}
                          alt="Profile"
                          width={28}
                          height={28}
                          className="w-7 h-7 rounded-full object-cover border-2 border-blue-600"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs">
                          {currentUserData?.name?.englishName?.charAt(0) || "U"}
                        </div>
                      )}
                    </button>

                    {profileDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
                        <div className="p-2">
                          <div className="px-3 py-2 border-b border-gray-100 mb-1">
                            <p className="text-xs font-medium text-gray-900">
                              {currentUserData?.name?.englishName || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {currentUserData?.contact.email || ""}
                            </p>
                          </div>
                          {profileItems.map((item, index) => (
                            <Link
                              key={index}
                              href={item.link}
                              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-xs"
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
                  <Link
                    href="/login"
                    className="px-4 py-1.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300 text-xs whitespace-nowrap"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <MdClose size={24} className="text-gray-700" />
              ) : (
                <MdMenu size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay & Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-[100] md:hidden bg-black/20"
              onClick={() => setMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl z-[110] md:hidden"
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
                            {currentUserData?.name?.englishName?.charAt(0) ||
                              "U"}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {currentUserData?.name?.englishName || "User"}
                          </h3>
                          <p className="text-sm text-gray-600">Welcome back!</p>
                        </div>
                      </>
                    )}
                    {!currentUser && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Menu</h3>
                        <p className="text-sm text-gray-600">Welcome to GSCA</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    aria-label="Close menu"
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
                            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                              {item.subItems.map((sub, i) => (
                                <li key={i}>
                                  <Link
                                    href={sub.link}
                                    className="flex items-center p-3 text-gray-600 hover:bg-gray-50 hover:text-blue-700 rounded-lg transition-all duration-200 font-medium text-sm"
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
                            className="flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-300 font-medium"
                            onClick={() => setMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Mobile Auth Section */}
                  {!currentUser && (
                    <div className="p-4 border-t border-gray-100">
                      <Link
                        href="/login"
                        className="flex items-center justify-center w-full px-4 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300"
                        onClick={() => setMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </div>
                  )}

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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
