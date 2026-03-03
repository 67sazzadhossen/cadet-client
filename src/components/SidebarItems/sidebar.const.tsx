import { JSX } from "react";
import { BiHome, BiSolidReport } from "react-icons/bi";
import { FaHandHoldingDollar, FaMessage, FaUsers } from "react-icons/fa6";
import { IoPerson, IoSettings } from "react-icons/io5";
import { MdPayments } from "react-icons/md";

export interface TSidebarItem {
  name: string;
  link?: string;
  icon: JSX.Element;
  children?: TSidebarItem[];
}

export const studentPaths: TSidebarItem[] = [
  {
    name: "Profile",
    link: "/dashboard/profile",
    icon: <IoPerson />,
  },
  {
    name: "Performance Report",
    link: "/dashboard/performance",
    icon: <BiSolidReport />,
  },
  {
    name: "Attendance",
    link: "/dashboard/attendance",
    icon: <IoPerson />,
  },
  // Example with submenu
  // {
  //   name: "Payment",
  //   icon: <IoSettings />,
  //   children: [
  //     {
  //       name: "Make Payment",
  //       link: "/dashboard/payment/make",
  //       icon: <MdPayments />,
  //     },
  //     {
  //       name: "Payment History",
  //       link: "/dashboard/payment/history",
  //       icon: <BiSolidReport />,
  //     },
  //   ],
  // },
];

export const teacherPaths: TSidebarItem[] = [
  {
    name: "Profile",
    link: "/dashboard/profile",
    icon: <IoPerson />,
  },
  {
    name: "Attendance",
    link: "/dashboard/attendance",
    icon: <IoPerson />,
  },
  {
    name: "Student Reports",
    link: "/dashboard/student-reports",
    icon: <IoPerson />,
    children: [
      {
        name: "Class Reports",
        link: "/dashboard/student-reports/class",
        icon: <BiSolidReport />,
      },
      {
        name: "Individual Reports",
        link: "/dashboard/student-reports/individual",
        icon: <IoPerson />,
      },
    ],
  },
];

export const adminPaths: TSidebarItem[] = [
  {
    name: "Dashboard",
    link: "/dashboard/admin",
    icon: <BiHome />,
  },
  {
    name: "Profile",
    link: "/dashboard/profile",
    icon: <IoPerson />,
  },
  {
    name: "Manage Users",
    icon: <FaUsers />,
    children: [
      {
        name: "All Users",
        link: "/dashboard/users/all",
        icon: <FaUsers />,
      },
      {
        name: "Add User",
        link: "/dashboard/users/add",
        icon: <IoPerson />,
      },
      {
        name: "Roles & Permissions",
        link: "/dashboard/users/roles",
        icon: <IoSettings />,
      },
    ],
  },
  {
    name: "Attendance",
    icon: <FaUsers />,
    children: [
      {
        name: "Teachers Attendance",
        link: "/dashboard/attendance/teachers",
        icon: <FaUsers />,
      },
      {
        name: "Students Attendance",
        link: "/dashboard/attendance/students",
        icon: <FaUsers />,
      },
    ],
  },
  {
    name: "Send Sms",
    link: "/dashboard/sms",
    icon: <FaMessage />,
  },
  {
    name: "Accounts",
    icon: <FaHandHoldingDollar />,
    children: [
      {
        name: "Income",
        link: "/dashboard/accounts/income",
        icon: <MdPayments />,
      },
      {
        name: "Expenses",
        link: "/dashboard/accounts/expenses",
        icon: <BiSolidReport />,
      },
    ],
  },
  {
    name: "Fee Collection",
    icon: <MdPayments />,
    children: [
      {
        name: "Collect Fee",
        link: "/dashboard/fee/collect",
        icon: <FaHandHoldingDollar />,
      },
      {
        name: "Fee Reports",
        link: "/dashboard/fee/reports",
        icon: <BiSolidReport />,
      },
    ],
  },
  {
    name: "Student Reports",
    icon: <IoPerson />,
    children: [
      {
        name: "Academic Reports",
        link: "/dashboard/reports/academic",
        icon: <BiSolidReport />,
      },
      {
        name: "Behavior Reports",
        link: "/dashboard/reports/behavior",
        icon: <IoPerson />,
      },
    ],
  },
  {
    name: "Academic Management",
    icon: <IoSettings />,
    children: [
      {
        name: "Classes",
        link: "/dashboard/academic/classes",
        icon: <IoSettings />,
      },
      {
        name: "Subjects",
        link: "/dashboard/academic/subjects",
        icon: <IoSettings />,
      },
      {
        name: "Routines",
        link: "/dashboard/academic/routines",
        icon: <IoSettings />,
      },
    ],
  },
  {
    name: "Id Cards",
    link: "/dashboard/id-cards",
    icon: <IoSettings />,
  },
];
