/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypedMutationTrigger } from "@reduxjs/toolkit/query/react";
import { Types } from "mongoose";
import { ReactNode } from "react";

export type TName = {
  bengaliName: string;
  englishName: string;
  _id?: Types.ObjectId;
};

export type TContact = {
  phone: string;
  email: string;
  mobile: string;
  whatsapp: string;
  _id?: Types.ObjectId;
};

export type TAddress = {
  address: string;
  district: string;
  village?: string;
  thana?: string;
  postOffice?: string;
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
  email: string;
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
  name: string;
  relation: "brother" | "sister";
  class: string;
  roll: string;
  _id?: string;
};

// Guardian related types
export type TGuardianInfo = {
  name: TName;
  mobile: string;
  nid: string;
  occupation: string;
  presentAddress: TAddress;
  permanentAddress: TAddress;
  _id?: Types.ObjectId;
};

export type TGuardian = {
  father: TGuardianInfo;
  mother: TGuardianInfo;
  localGuardian?: {
    name?: string;
    email?: string;
    relation?: string;
    phone?: string;
    _id?: Types.ObjectId;
  };
  _id?: Types.ObjectId;
};

export type TPayment = {
  month: string;
  paidAmount: number;
  due: number;
  payableAmount: number;
  status: "paid" | "pending" | "partial" | "unpaid";
  invoiceNo: string | null;
  date: string;
  _id?: string;
};

export type TPaymentInfo = {
  dueAmount: number;
  paidAmount: number;
  payableAmount: number;
  status: "paid" | "partial" | "unpaid";
  payments: TPayment[];
  totalPayments: number;
  _id?: Types.ObjectId;
};

export type TRole = "admin" | "student" | "superAdmin";
export type TUserStatus = "active" | "blocked";
export type TVersion = "bangla" | "english";
export type TTransportation = "yes" | "no";

export type TStudent = {
  _id: string;
  id: string;
  studentId?: string;

  user: {
    needsPasswordChanged: boolean;
    role: TRole;
    status: TUserStatus;
    _id?: string;
  };

  // Personal Information
  name: TName;
  dateOfBirth: string;
  birthCertificateNo: string;
  nationality: string;
  religion: "Islam" | "Hinduism" | "Christianity" | "Buddhism";

  // Contact Information
  email: string;
  WhatsappNumber: string;

  // Academic Information
  admissionClass: string;
  currentClass: string;
  rollNo: string;
  admissionDate: string;
  previousSchool: string;

  // Family Information
  guardian: TGuardian;
  siblings: SiblingType[];

  // Others
  transportation: TTransportation;
  image: TImage;
  version: TVersion;
  paymentInfo: TPaymentInfo;
  waiver: number;
  bloodGroup: TBloodGroup;
  isCadet: boolean;
  admissionFee: number;
  sessionFee: number;

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
