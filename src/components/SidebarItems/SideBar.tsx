"use client";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { sideBarItemsGenerator } from "@/utils/sidebarItemsGenerator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { TSidebar } from "./sidebar.type";
import { adminPaths, studentPaths, teacherPaths } from "./sidebar.const";
import { BiSolidLogOutCircle } from "react-icons/bi";
import Image from "next/image";
import logo from "@/assets/logo.png";

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
  type role = {
    ADMIN: string;
    TEACHER: string;
    STUDENT: string;
  } | null;

  const sidebarItems =
    (role === userRole.STUDENT && sideBarItemsGenerator(studentPaths)) ||
    (role === userRole.TEACHER && sideBarItemsGenerator(teacherPaths)) ||
    (role === userRole.ADMIN && sideBarItemsGenerator(adminPaths)) ||
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
    <ul className="menu w-full grow space-y-3 ">
      {/* List item */}

      <Link href={"/"}>
        <Image
          src={logo}
          width={60}
          height={80}
          alt="logo"
          className="mx-auto"
        />
      </Link>
      <div className="divider -my-2 mb-5"></div>
      {sidebarItems.map((item: TSidebar, idx) => (
        <li key={idx}>
          <Link href={item.link}>
            <button
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-2"
              data-tip={item.name}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="is-drawer-close:hidden whitespace-nowrap">
                {item.name}
              </span>
            </button>
          </Link>
        </li>
      ))}

      <li className="absolute bottom-20 text-2xl">
        {" "}
        <button
          onClick={handleLogout}
          className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-2 -ml-2 text-red-700"
          data-tip="Logout"
        >
          <span className="text-4xl">
            <BiSolidLogOutCircle />
          </span>
          <span className="is-drawer-close:hidden whitespace-nowrap uppercase font-bold">
            Logout
          </span>
        </button>
      </li>
    </ul>
  );
};

export default SideBar;
