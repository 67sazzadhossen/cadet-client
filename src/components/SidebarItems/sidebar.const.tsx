import { BiHome, BiSolidReport } from "react-icons/bi";
import { FaHandHoldingDollar, FaMessage, FaUsers } from "react-icons/fa6";
import { IoPerson, IoSettings } from "react-icons/io5";
import { MdPayments } from "react-icons/md";

export const studentPaths = [
  {
    name: "Profile",
    icon: <IoPerson />,
  },
  {
    name: "Performance Report",
    icon: <BiSolidReport />,
  },
  {
    name: "Attendance",
    icon: <IoPerson />,
  },
  {
    name: "Payment",
    icon: <IoSettings />,
  },
];

export const teacherPaths = [
  {
    name: "Profile",
    icon: <IoPerson />,
  },
  {
    name: "Attendance",
    icon: <IoPerson />,
  },
  {
    name: "Student Reports",
    icon: <IoPerson />,
  },
];

export const adminPaths = [
  {
    name: "Dashboard",
    icon: <BiHome />,
  },
  {
    name: "Profile",
    icon: <IoPerson />,
  },

  {
    name: "Manage Users",
    icon: <FaUsers />,
  },
  {
    name: "Send Sms",
    icon: <FaMessage />,
  },
  {
    name: "Accounts",
    icon: <FaHandHoldingDollar />,
  },
  {
    name: "Fee Collection",
    icon: <MdPayments />,
  },
  {
    name: "Student Reports",
    icon: <IoPerson />,
  },
  {
    name: "Academic Management",
    icon: <IoSettings />,
  },
];
