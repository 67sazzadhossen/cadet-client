import { BiHome } from "react-icons/bi";
import { FaRectangleList, FaUsers } from "react-icons/fa6";
import { IoPerson, IoSettings, IoCreate } from "react-icons/io5";
import { ImUserPlus } from "react-icons/im";
import { MdGroupAdd } from "react-icons/md";

export const studentPaths = [
  {
    name: "Profile",
    icon: <IoPerson />,
  },
  {
    name: "Result",
    icon: <IoSettings />,
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
    name: "Home",
    icon: <BiHome />,
  },
  {
    name: "Profile",
    icon: <IoPerson />,
  },
  {
    name: "Teacher Dashboard",
    icon: <IoPerson />,
  },
  {
    name: "Manage Students",
    icon: <IoSettings />,
  },
  {
    name: "Marks Entry",
    icon: <IoCreate />,
  },
  {
    name: "Routine",
    icon: <IoPerson />,
  },
];

export const adminPaths = [
  {
    name: "Home",
    icon: <BiHome />,
  },
  {
    name: "Profile",
    icon: <IoPerson />,
  },
  {
    name: "All Teachers",
    icon: <FaRectangleList />,
  },
  {
    name: "Create Student",
    icon: <MdGroupAdd />,
  },
  {
    name: "Create Teacher",
    icon: <ImUserPlus />,
  },

  {
    name: "Manage Users",
    icon: <FaUsers />,
  },
  {
    name: "Settings",
    icon: <IoSettings />,
  },
];
