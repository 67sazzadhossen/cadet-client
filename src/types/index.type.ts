import { TypedMutationTrigger } from "@reduxjs/toolkit/query/react";
import { Types } from "mongoose";

export type TName = {
  bengaliName: string;
  englishName: string;
  _id?: Types.ObjectId;
};

export type TContact = {
  email: string;
  mobile: string;
  whatsapp: string;
  _id?: Types.ObjectId;
};

export type TAddress = {
  address: string;
  district: string;
  _id?: Types.ObjectId;
};

export type TImage = {
  url: string;
  publicId: string;
  _id?: Types.ObjectId;
};

export type TBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "unknown";

export type TAdmin = {
  // Basic Information
  user: Types.ObjectId;
  id: string;
  name: TName;
  image: TImage;
  designation: string;
  dateOfBirth: string; // or Date if you prefer
  gender: "male" | "female" | "other";
  contact: TContact;
  bloodGroup: TBloodGroup;
  address: TAddress;

  // System Fields
  _id: Types.ObjectId;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  __v: number;
};

export type TTeacher = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  id: string;
  name: TName;
  image: TImage;
  contact: TContact;
  dateOfBirth: string;
  designation: string;
  subjects: string[];
  qualification: string;
  joiningDate: string;
  bloodGroup: TBloodGroup;
  address: TAddress;
};

export type TCurrentUser = TAdmin;
export type TMutationTrigger = TypedMutationTrigger<
  {
    id: string;
  },
  any,
  any
>;
