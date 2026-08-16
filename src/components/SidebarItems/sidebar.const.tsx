import { JSX } from "react";
import {
  BiHome,
  BiSolidReport,
  BiCalendarCheck,
  BiTime,
  BiIdCard,
} from "react-icons/bi";
import {
  FaChalkboardTeacher,
  FaDollarSign,
  FaExclamationTriangle,
  FaUserCog,
} from "react-icons/fa";
import {
  FaUsers,
  FaUserGraduate,
  FaMoneyBillWave,
  FaBookOpen,
  FaClipboardList,
  FaChartLine,
} from "react-icons/fa6";
import { IoPerson, IoPeople, IoCash, IoSchool } from "react-icons/io5";
import { MdClass, MdSubject, MdSms } from "react-icons/md";

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
    link: "/dashboard/performance-report",
    icon: <FaChartLine />,
  },
  {
    name: "Attendance",
    link: "/dashboard/my-attendance",
    icon: <BiCalendarCheck />,
  },
  {
    name: "Payment History",
    link: "/dashboard/payment-history",
    icon: <FaDollarSign />,
  },
];

export const teacherPaths: TSidebarItem[] = [
  {
    name: "Profile",
    link: "/dashboard/profile",
    icon: <FaChalkboardTeacher />,
  },
  {
    name: "Attendance",
    link: "/dashboard/my-attendance",
    icon: <BiCalendarCheck />,
  },
  {
    name: "Student Reports",

    icon: <FaClipboardList />,
    children: [
      {
        name: "Class Reports",
        link: "/dashboard/student-reports",
        icon: <FaUsers />,
      },
      {
        name: "Individual Reports",
        link: "/dashboard/student-reports/individual",
        icon: <IoPerson />,
      },
    ],
  },
  {
    name: "Academic Management",
    icon: <IoSchool />,
    children: [
      {
        name: "Mark Entry",
        link: "/dashboard/academic/mark-entry",
        icon: <BiTime />,
      },
      {
        name: "Result",
        link: "/dashboard/academic/result",
        icon: <BiTime />,
      },
    ],
  },
];

export const accountantPaths: TSidebarItem[] = [
  { name: "Profile", link: "/dashboard/profile", icon: <IoPerson /> },
  { name: "My Attendance", link: "/dashboard/my-attendance", icon: <BiCalendarCheck /> },
  { name: "Collect Fee", link: "/dashboard/fee/reports", icon: <FaMoneyBillWave /> },
  { name: "Daily Collections", link: "/dashboard/accounts/payment-history", icon: <BiSolidReport /> },
  { name: "Add Expense", link: "/dashboard/accounts/expenses", icon: <IoCash /> },
];

export const adminPaths: TSidebarItem[] = [
  {
    name: "Overview",
    link: "/dashboard",
    icon: <BiHome />,
  },
  {
    name: "Profile",
    link: "/dashboard/profile",
    icon: <FaUserCog />,
  },
  {
    name: "Accounts",
    icon: <IoSchool />,
    children: [
      {
        name: "Collect Fee",
        link: "/dashboard/fee/reports",
        icon: <BiSolidReport />,
      },
      {
        name: "Collect Semester Fee",
        link: "/dashboard/fee/semester-fee-reports",
        icon: <BiSolidReport />,
      },
      {
        name: "Income",
        link: "/dashboard/accounts/income",
        icon: <FaMoneyBillWave />,
      },
      {
        name: "Expenses",
        link: "/dashboard/accounts/expenses",
        icon: <IoCash />,
      },
      {
        name: "Add Monthly Fee Info",
        link: "/dashboard/accounts/create-monthly-fee",
        icon: <MdClass />,
      },
      {
        name: "Add Semester Fee Info",
        link: "/dashboard/accounts/create-semester-fee",
        icon: <MdClass />,
      },
      {
        name: "Payment History",
        link: "/dashboard/accounts/payment-history",
        icon: <MdClass />,
      },
      {
        name: "Monthly Payment History",
        link: "/dashboard/accounts/monthly-payment-history",
        icon: <MdClass />,
      },

    ],
  },
  {
    name: "Manage Users",
    icon: <FaUsers />,
    children: [
      {
        name: "Students",
        link: "/dashboard/users?role=student",
        icon: <FaUserGraduate />,
      },
      {
        name: "Teachers",
        link: "/dashboard/users?role=teacher",
        icon: <FaChalkboardTeacher />,
      },
      {
        name: "Admins",
        link: "/dashboard/users?role=admin",
        icon: <FaUserCog />,
      },
      {
        name: "Accountants",
        link: "/dashboard/users?role=accountant",
        icon: <FaMoneyBillWave />,
      },
    ],
  },
  {
    name: "Recycle Bin",
    link: "/dashboard/recycle-bin",
    icon: <FaExclamationTriangle />,
  },
  {
    name: "Attendance",
    icon: <BiCalendarCheck />,
    children: [
      {
        name: "Teachers Attendance",
        link: "/dashboard/attendance/teachers",
        icon: <FaChalkboardTeacher />,
      },
      {
        name: "Students Attendance",
        link: "/dashboard/attendance/students",
        icon: <FaUserGraduate />,
      },
    ],
  },
  {
    name: "Send Sms",
    link: "/dashboard/sms",
    icon: <MdSms />,
  },

  {
    name: "Student Reports",
    icon: <FaClipboardList />,
    children: [
      {
        name: "Daily Reports",
        link: "/dashboard/student-reports",
        icon: <FaBookOpen />,
      },
      {
        name: "Behavior Reports",
        link: "/dashboard/reports/behavior",
        icon: <FaExclamationTriangle />,
      },
    ],
  },
  {
    name: "Previous Exam System",
    icon: <IoSchool />,
    children: [
      {
        name: "Create Subject Groups",
        link: "/dashboard/academic/create-subject",
        icon: <MdClass />,
      },
      {
        name: "Manage Legacy Subjects",
        link: "/dashboard/academic-management",
        icon: <MdClass />,
      },
      {
        name: "Legacy Subject List",
        link: "/dashboard/academic/all-subjects",
        icon: <MdSubject />,
      },
      {
        name: "Routines",
        link: "/dashboard/academic/routines",
        icon: <BiTime />,
      },
      {
        name: "Admit Cards",
        link: "/dashboard/academic/admit-card",
        icon: <BiTime />,
      },
      {
        name: "Seat Plan",
        link: "/dashboard/academic/seat-plan",
        icon: <BiTime />,
      },
      {
        name: "Legacy Mark Entry",
        link: "/dashboard/academic/add-mark",
        icon: <BiTime />,
      },
      {
        name: "Legacy Result",
        link: "/dashboard/academic/result",
        icon: <BiTime />,
      },
    ],
  },
  {
    name: "Current Exam System",
    icon: <IoSchool />,
    children: [
      {
        name: "Create Examination",
        link: "/dashboard/academic/create-exam",
        icon: <BiTime />,
      },
      {
        name: "Exam Mark Entry",
        link: "/dashboard/academic/mark-entry",
        icon: <BiTime />,
      },
      {
        name: "Published Exam Results",
        link: "/dashboard/academic/dynamic-result",
        icon: <BiTime />,
      },
    ],
  },

  {
    name: "Id Cards",
    link: "/dashboard/id-cards",
    icon: <BiIdCard />,
  },
];
