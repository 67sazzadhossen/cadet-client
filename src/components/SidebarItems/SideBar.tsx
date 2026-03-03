"use client";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  adminPaths,
  studentPaths,
  teacherPaths,
  TSidebarItem,
} from "./sidebar.const";
import { BiSolidLogOutCircle } from "react-icons/bi";
import Image from "next/image";
import logo from "@/assets/logo.png";
import SidebarItem from "./SideBarItem";

const SideBar = () => {
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

  return (
    <div className="h-full flex flex-col bg-base-100">
      {/* Logo Section */}
      <div className="p-4">
        <Link href={"/"} className="block">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              width={40}
              height={40}
              alt="logo"
              className="rounded-lg"
            />
            <span className="is-drawer-close:hidden text-lg font-bold text-primary truncate">
              School MS
            </span>
          </div>
        </Link>
      </div>

      <div className="divider my-0" />

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {sidebarItems.map((item: TSidebarItem, idx) => (
            <SidebarItem key={idx} item={item} />
          ))}
        </ul>
      </div>

      {/* Logout Section */}
      <div className="p-3 border-t border-base-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-error hover:bg-error/10 transition-all duration-200"
        >
          <span className="text-2xl">
            <BiSolidLogOutCircle />
          </span>
          <span className="is-drawer-close:hidden text-sm font-medium uppercase">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
