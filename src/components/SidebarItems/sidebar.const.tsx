import { JSX } from "react";
import {
  BiHome,
  BiSolidReport,
  BiUser,
  BiCalendarCheck,
  BiMoney,
  BiGroup,
  BiCreditCard,
  BiBookOpen,
  BiTime,
  BiIdCard,
} from "react-icons/bi";
import {
  FaChalkboardTeacher,
  FaExclamationTriangle,
  FaUserCog,
} from "react-icons/fa";
import {
  FaHandHoldingDollar,
  FaMessage,
  FaUsers,
  FaUserGraduate,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaBookOpen,
  FaClipboardList,
  FaUserShield,
  FaChartLine,
} from "react-icons/fa6";
import {
  IoPerson,
  IoSettings,
  IoPeople,
  IoCalendar,
  IoDocumentText,
  IoCash,
  IoWallet,
  IoBusiness,
  IoSchool,
} from "react-icons/io5";
import {
  MdPayments,
  MdAttachMoney,
  MdReceipt,
  MdAssignment,
  MdClass,
  MdSubject,
  MdSchedule,
  MdReport,
  MdEmail,
  MdSms,
} from "react-icons/md";

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
    icon: <FaChartLine />,
  },
  {
    name: "Attendance",
    link: "/dashboard/attendance",
    icon: <BiCalendarCheck />,
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
    link: "/dashboard/attendance",
    icon: <BiCalendarCheck />,
  },
  {
    name: "Student Reports",
    link: "/dashboard/student-reports",
    icon: <FaClipboardList />,
    children: [
      {
        name: "Class Reports",
        link: "/dashboard/student-reports/class",
        icon: <FaUsers />,
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
    icon: <FaUserCog />,
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
    name: "Accounts",
    icon: <IoWallet />,
    children: [
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
    ],
  },
  {
    name: "Fee Collection",
    icon: <MdReceipt />,
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
      {
        name: "Session Fee Reports",
        link: "/dashboard/fee/session-reports",
        icon: <BiSolidReport />,
      },
    ],
  },
  {
    name: "Student Reports",
    icon: <FaClipboardList />,
    children: [
      {
        name: "Academic Reports",
        link: "/dashboard/reports/academic",
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
        name: "Classes",
        link: "/dashboard/academic/classes",
        icon: <MdClass />,
      },
      {
        name: "Subjects",
        link: "/dashboard/academic/subjects",
        icon: <MdSubject />,
      },
      {
        name: "Routines",
        link: "/dashboard/academic/routines",
        icon: <BiTime />,
      },
    ],
  },
  {
    name: "Accounts",
    icon: <IoSchool />,
    children: [
      {
        name: "Add Monthly Fee Info",
        link: "/dashboard/accounts/create-monthly-fee",
        icon: <MdClass />,
      },
      {
        name: "Subjects",
        link: "/dashboard/academic/subjects",
        icon: <MdSubject />,
      },
      {
        name: "Routines",
        link: "/dashboard/academic/routines",
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
