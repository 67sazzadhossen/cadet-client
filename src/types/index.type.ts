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
  id: string;
  name: TName;
  image: TImage;
  contact: TContact;
  dateOfBirth: string;
  designation: string;
  qualification: string;
  gender: "male" | "female" | "other";
  bloodGroup: TBloodGroup;
  address: TAddress;
  createdAt: string;
  updatedAt: string;
  user: {
    needsPasswordChanged: boolean;
  };
};

export type TTeacher = {
  _id: Types.ObjectId;
  user: {
    needsPasswordChanged: boolean;
  };
  id: string;
  name: TName;
  image: TImage;
  contact: TContact;
  dateOfBirth: string;
  designation: string;
  subjects: string[];
  gender: "male" | "female" | "other";
  qualification: string;
  joiningDate: string;
  bloodGroup: TBloodGroup;
  address: TAddress;
  createdAt: string;
  updatedAt: string;
};

export type TCurrentUser = TAdmin | TTeacher;
export type TMutationTrigger = TypedMutationTrigger<
  {
    id: string;
  },
  any,
  any
>;

// src/pages/Admin/CreateTeacher/CreateTeacher.type.ts
export type TTeacherForm = {
  id: string;
  name: {
    bengaliName: string;
    englishName: string;
  };
  image: FileList | string;
  contact: {
    email: string;
    mobile: string;
    whatsapp?: string;
  };
  dateOfBirth: string;
  designation: string;
  subjects: string[];
  qualification: string;
  bloodGroup: string;
  joiningDate: string;
  address: {
    address: string;
    district: string;
  };
};

// Empty default export add করুন
