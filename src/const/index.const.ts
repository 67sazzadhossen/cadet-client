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

export const monthMap = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};
