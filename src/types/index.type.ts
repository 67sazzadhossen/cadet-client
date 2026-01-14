/* eslint-disable @typescript-eslint/no-explicit-any */
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
    role: string;
  };
};

export type TTeacher = {
  _id: Types.ObjectId;
  user: {
    needsPasswordChanged: boolean;
    role: string;
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

export type SiblingType = {
  name?: string;
  class?: string;
  institution?: string;
  _id?: string;
};

// Guardian related types
type GuardianPersonType = {
  name?: string;
  occupation?: string;
  phone?: string;
  email?: string;
  nid?: string;
  _id?: string;
};

export type GuardianType = {
  father?: GuardianPersonType;
  mother?: GuardianPersonType;
  localGuardian?: GuardianPersonType;
  _id?: string;
};

export type TStudent = {
  _id: string;
  id: string;
  user: {
    needsPasswordChanged: boolean;
    role: string;
    status: string;
  };

  // Personal Information
  name: TName;
  dateOfBirth: string;
  birthCertificateNo: string;
  nationality: string;
  religion: string;

  // Contact Information
  email: string;
  WhatsappNumber: string;

  // Academic Information
  admissionClass: string;
  currentClass: string;
  rollNo: string;
  admissionDate: string;
  previousSchool?: string;

  // Family Information
  guardian: GuardianType;
  siblings: SiblingType[];

  // Others
  transportation: "yes" | "no";
  image?: TImage;
  version: "bangla" | "english";
  paymentInfo: {
    status: string;
    month: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type TUpdateProfile = {
  name: {
    englishName: string;
    bengaliName: string;
  };
  contact: {
    email: string;
    mobile: string;
    whatsapp: string;
  };
  dateOfBirth: string;
  qualification: string;
  subjects: string[];
  joiningDate: string;
  gender: "male" | "female" | "other";
  bloodGroup:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-"
    | "unknown";
  address: {
    address: string;
    district: string;
  };
};

export type TCurrentUser = TAdmin | TTeacher;
export type TMutationTrigger = TypedMutationTrigger<
  {
    id: string;
  },
  any,
  any
>;

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
