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
        name: "Add Mark",
        link: "/dashboard/academic/add-mark",
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

      {
        name: "Subjects",
        link: "/dashboard/academic/subjects",
        icon: <MdSubject />,
      },
    ],
  },
  {
    name: "Manage Students",
    icon: <FaUsers />,
    children: [
      {
        name: "All Students",
        link: "/dashboard/manage-students/all-students",
        icon: <IoPeople />,
      },
      {
        name: "Add Student",
        link: "/dashboard/manage-students/add-student",
        icon: <FaUserGraduate />,
      },
    ],
  },
  {
    name: "Manage Teachers",
    icon: <FaUsers />,
    children: [
      {
        name: "All Teachers",
        link: "/dashboard/manage-teachers/all-teachers",
        icon: <IoPeople />,
      },
      {
        name: "Add Teacher",
        link: "/dashboard/manage-teachers/add-teacher",
        icon: <FaUserGraduate />,
      },
    ],
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
    name: "Academic Management",
    icon: <IoSchool />,
    children: [
      {
        name: "Create Subject",
        link: "/dashboard/academic/create-subject",
        icon: <MdClass />,
      },
      {
        name: "Add Subject",
        link: "/dashboard/academic-management",
        icon: <MdClass />,
      },
      {
        name: "Subjects",
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
        name: "Add Mark",
        link: "/dashboard/academic/add-mark",
        icon: <BiTime />,
      },
      {
        name: "Result",
        link: "/dashboard/academic/result",
        icon: <BiTime />,
      },
    ],
  },
  {
    name: "Examination Management",
    icon: <IoSchool />,
    children: [
      {
        name: "Create Examination",
        link: "/dashboard/academic/create-exam",
        icon: <BiTime />,
      },
      {
        name: "Mark Entry",
        link: "/dashboard/academic/mark-entry",
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
