import { FaRectangleList } from "react-icons/fa6";
import { IoPerson, IoSettings, IoCreate } from "react-icons/io5";

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
    name: "All Teachers",
    icon: <FaRectangleList />,
  },
  {
    name: "Create Teacher",
    icon: <IoCreate />,
  },

  {
    name: "Manage Users",
    icon: <IoPerson />,
  },
  {
    name: "Settings",
    icon: <IoSettings />,
  },
];
