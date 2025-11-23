import { TAddress, TBloodGroup, TContact, TName } from "@/types/index.type";

export type TTeacherForm = {
  id: string;
  name: TName;
  contact: TContact;
  dateOfBirth: string;
  designation: string;
  subjects: string[];
  image: string;
  qualification: string;
  bloodGroup: TBloodGroup;
  joiningDate: string;
  address: TAddress;
};
