// components/SidebarItems/Sidebar.tsx
"use client";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect, JSX } from "react";
import { adminPaths, studentPaths, teacherPaths } from "./sidebar.const";
import { BiSolidLogOutCircle } from "react-icons/bi";

import { IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";
import Image from "next/image";
import logo from "@/assets/logo.png";

// Types
interface TSidebarItem {
  name: string;
  link?: string;
  icon: JSX.Element;
  children?: TSidebarItem[];
}

// Mobile Detection Hook
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Sidebar Item Component
const SidebarItem = ({
  item,
  onClose,
}: {
  item: TSidebarItem;
  onClose?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isChildActive = item.children?.some(
    (child) => child.link && pathname === child.link,
  );

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  if (item.children) {
    return (
      <li className="w-full">
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${
              isOpen
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-xl ${isOpen ? "text-blue-600" : "text-gray-500"}`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium truncate">{item.name}</span>
            </div>
            <span className="text-sm flex-shrink-0">
              {isOpen ? <IoChevronUp /> : <IoChevronDown />}
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-96 mt-1" : "max-h-0"
            }`}
          >
            <ul className="ml-4 space-y-0.5 border-l-2 border-gray-200 pl-2">
              {item.children.map((child, idx) => {
                const isActive = child.link && pathname === child.link;

                return (
                  <li key={idx}>
                    <Link
                      href={child.link || "#"}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span
                        className={`text-lg ${isActive ? "text-white" : "text-gray-500"}`}
                      >
                        {child.icon}
                      </span>
                      <span className="text-sm truncate">{child.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </li>
    );
  }

  const isActive = item.link && pathname === item.link;

  return (
    <li className="w-full">
      <Link
        href={item.link || "#"}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        <span
          className={`text-xl ${isActive ? "text-white" : "text-gray-500"}`}
        >
          {item.icon}
        </span>
        <span className="text-sm font-medium truncate">{item.name}</span>
      </Link>
    </li>
  );
};

// Props interface
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Main Sidebar Component with props
const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);
  const isMobile = useMobile();

  // Sync with prop
  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  const currentUser = useAppSelector(selectCurrentUser) as {
    role: string;
  } | null;
  const role = currentUser?.role;

  const userRole = {
    ADMIN: "admin",
    TEACHER: "teacher",
    STUDENT: "student",
  };

  const sidebarItems: TSidebarItem[] =
    (role === userRole.STUDENT && studentPaths) ||
    (role === userRole.TEACHER && teacherPaths) ||
    (role === userRole.ADMIN && adminPaths) ||
    [];

  const [loggingOut] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await loggingOut({});
    dispatch(logout());
    router.push("/login");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Close sidebar when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile) {
      if (isSidebarOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 h-full transition-all duration-300 ease-in-out
          ${isMobile ? (isSidebarOpen ? "left-0" : "-left-64") : "left-0 w-64"}
        `}
      >
        <div className="h-full w-64 flex flex-col bg-white shadow-xl">
          {/* Logo Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Link href={"/"} className="block flex-1" onClick={closeSidebar}>
                <div className="flex items-center gap-2">
                  <Image
                    src={logo}
                    width={40}
                    height={40}
                    alt="logo"
                    className="rounded-lg"
                  />
                  <span className="text-lg font-bold text-blue-600 truncate">
                    School MS
                  </span>
                </div>
              </Link>

              {/* Close button for mobile */}
              {isMobile && isSidebarOpen && (
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <IoClose className="w-6 h-6 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {sidebarItems.map((item: TSidebarItem, idx) => (
                <SidebarItem key={idx} item={item} onClose={closeSidebar} />
              ))}
            </ul>
          </div>

          {/* Logout Section */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <span className="text-2xl">
                <BiSolidLogOutCircle />
              </span>
              <span className="text-sm font-medium uppercase">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Menu Button in Navbar - This will be rendered in the layout */}
      {/* We'll pass this function to the layout via context or prop */}
    </>
  );
};

export { Sidebar, useMobile };
export type { TSidebarItem };
