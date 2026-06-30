import { TBloodGroup } from "@/types/index.type";

export const bloodGroups: TBloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];
export const genders: string[] = ["male", "female", "other"];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const classOptions = [
  "Play",
  "Nursery",
  "KG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
];

export const versionOptions = [
  {
    value: "",
    label: "All Versions",
    color: "gray",
  },
  {
    value: "bangla",
    label: "Bangla",
    color: "green",
  },
  {
    value: "english",
    label: "English",
    color: "blue",
  },
];

export const studentTypeOptions = [
  {
    value: "",
    label: "All Students",
    color: "gray",
  },
  {
    value: "false",
    label: "Regular",
    color: "blue",
  },
  {
    value: "true",
    label: "Cadet",
    color: "red",
  },
];

export const YEARS = [2024, 2025, 2026];
