// components/SidebarItems/Sidebar.tsx
"use client";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { accountantPaths, adminPaths, studentPaths, teacherPaths } from "./sidebar.const";
import type { TSidebarItem } from "./sidebar.const";
import { BiSolidLogOutCircle } from "react-icons/bi";

import { IoClose, IoChevronDown, IoChevronUp } from "react-icons/io5";
import Image from "next/image";
import logo from "@/assets/logo.png";

// Types
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
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() || "";
  const currentHref = `${pathname}${queryString ? `?${queryString}` : ""}`;

  const isChildActive = item.children?.some((child) =>
    child.link ? currentHref === child.link : child.children?.some((nested) => currentHref === nested.link),
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
                ? "bg-white/15 text-white shadow-inner"
                : "text-blue-100/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-xl ${isOpen ? "text-cyan-200" : "text-blue-200/70"}`}
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
            <ul className="ml-4 space-y-0.5 border-l border-blue-200/20 pl-2">
              {item.children.map((child) => {
                const isActive = child.link && currentHref === child.link;

                return (
                  <li key={child.link || child.name}>
                    <Link
                      href={child.link || "#"}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                          : "text-blue-100/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span
                          className={`text-lg ${isActive ? "text-white" : "text-blue-200/70"}`}
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
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
            : "text-blue-100/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span
          className={`text-xl ${isActive ? "text-white" : "text-blue-200/70"}`}
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
    ACCOUNTANT: "accountant",
  };

  const sidebarItems: TSidebarItem[] =
    (role === userRole.STUDENT && studentPaths) ||
    (role === userRole.TEACHER && teacherPaths) ||
    (role === userRole.ADMIN && adminPaths) ||
    (role === userRole.ACCOUNTANT && accountantPaths) ||
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
          className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-sm"
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
        <div className="m-2 flex h-[calc(100%_-_1rem)] w-64 flex-col rounded-2xl border border-blue-200/20 bg-blue-950/60 shadow-2xl backdrop-blur-2xl lg:ml-3">
          {/* Logo Section */}
          <div className="border-b border-blue-200/15 p-4">
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
                  <span className="truncate text-lg font-bold text-blue-50">
                    School MS
                  </span>
                </div>
              </Link>

              {/* Close button for mobile */}
              {isMobile && isSidebarOpen && (
                <button
                  onClick={closeSidebar}
                  className="rounded-lg p-2 text-blue-100 transition-colors hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <IoClose className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {sidebarItems.map((item: TSidebarItem) => (
                <SidebarItem key={item.link || item.name} item={item} onClose={closeSidebar} />
              ))}
            </ul>
          </div>

          {/* Logout Section */}
          <div className="border-t border-blue-200/15 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-red-200 transition-all duration-200 hover:bg-red-500/15 hover:text-red-100"
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
