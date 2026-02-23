/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaHome,
  FaPlus,
  FaTrash,
  FaUpload,
  FaImage,
  FaEnvelope,
  FaBirthdayCake,
  FaFlag,
  FaBook,
  FaUsers,
  FaBus,
  FaCopy,
  FaCheck,
  FaIdCard,
  FaSchool,
  FaChild,
  FaTransgender,
  FaHeartbeat,
  FaShareAlt,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RiParentFill } from "react-icons/ri";
import { MdCheckCircle, MdFamilyRestroom, MdLocationOn } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { TAddress, TBloodGroup, TName } from "@/types/index.type";
import {
  useCreateStudentMutation,
  useGetAllStudentsQuery,
} from "@/redux/features/student/studentApi";
import { useCloudinaryUpload } from "@/utils/useCloudinaryUpload";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { FaEye, FaPrint } from "react-icons/fa6";

// Types based on your Mongoose schema
interface TGuardianInfo {
  name: TName;
  mobile: string;
  nid: string;
  occupation: string;
  presentAddress: TAddress;
  permanentAddress: TAddress;
}

interface TLocalGuardian {
  name?: string;
  email?: string;
  relation?: string;
  phone?: string;
}

interface TGuardian {
  father: TGuardianInfo;
  mother: TGuardianInfo;
  localGuardian?: TLocalGuardian;
}

interface TSibling {
  name: string;
  relation: "brother" | "sister";
  class: string;
  roll: string;
}

interface StudentFormData {
  admissionDate: Date;
  id: string;
  image: string;
  email: string;
  admissionClass: string;
  name: TName;
  dateOfBirth: string;
  religion: string;
  nationality: string;
  birthCertificateNo: string;
  previousSchool: string;
  rollNo: string;
  version: "bangla" | "english";
  guardian: TGuardian;
  siblings: TSibling[];
  WhatsappNumber: string;
  transportation: "yes" | "no";
  isCadet: boolean;
  bloodGroup: TBloodGroup;
}

interface CreatedStudentData {
  admissionDate: string;
  id: string;
  image: {
    url: string;
    publicId: string;
  };
  email: string;
  admissionClass: string;
  name: TName;
  dateOfBirth: string;
  religion: string;
  nationality: string;
  birthCertificateNo: string;
  previousSchool: string;
  rollNo: string;
  version: "bangla" | "english";
  guardian: TGuardian;
  siblings: TSibling[];
  WhatsappNumber: string;
  transportation: "yes" | "no";
  isCadet: boolean;
  bloodGroup: TBloodGroup;
  createdAt: string;
  studentId: string;
}

const CreateStudent = () => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showLocalGuardian, setShowLocalGuardian] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seclectClass, setSelectClass] = useState<string>("1");
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const [sameAsFatherPresentAddress, setSameAsFatherPresentAddress] =
    useState(false);
  const { refetch } = useGetAllStudentsQuery({ page: "1" });
  const [sameAsFatherPermanentAddress, setSameAsFatherPermanentAddress] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdStudent, setCreatedStudent] =
    useState<CreatedStudentData | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    studentInfo: true,
    academicInfo: true,
    guardianInfo: true,
    siblingsInfo: false,
  });

  const { uploadToCloudinary, loading: imageUploading } = useCloudinaryUpload();

  // Default values matching your Mongoose schema
  const defaultValues: StudentFormData = {
    admissionDate: new Date(),
    id: "000000",
    image: "",
    email: "s@gmail.com",
    admissionClass: "1",
    name: {
      bengaliName: "বাংলা নাম",
      englishName: "",
    },
    dateOfBirth: "06/04/1999",
    religion: "Islam",
    nationality: "Bangladeshi",
    birthCertificateNo: "update your birth certificate no",
    previousSchool: "N/A",
    rollNo: "",
    version: "bangla",
    guardian: {
      father: {
        name: {
          bengaliName: "বাবার বাংলা নাম",
          englishName: "Father's english name",
        },
        mobile: "Father's mobile number",
        nid: "Father's nid no",
        occupation: "Father's occupation",
        presentAddress: {
          address: "Update Adress",
          district: "Update Adress",
        },
        permanentAddress: {
          address: "Update Parment Adress",
          district: "Update Adress",
        },
      },
      mother: {
        name: {
          bengaliName: "মাতার বাংলা নাম",
          englishName: "Mother's English Name",
        },
        mobile: "01750000000",
        nid: "Update Mothers nid no",
        occupation: "Update mothers occupation",
        presentAddress: {
          address: "Update Adress",
          district: "Update Adress",
        },
        permanentAddress: {
          address: "Update Parment Adress",
          district: "Update Adress",
        },
      },
      localGuardian: {
        name: "Local Guardian Name",
        email: "local.guardian@gmail.com",
        relation: "Update Relation",
        phone: "01750000000",
      },
    },
    siblings: [],
    WhatsappNumber: "",
    transportation: "no",
    isCadet: false,
    bloodGroup: "A+",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
    getValues,
  } = useForm<StudentFormData>({
    defaultValues,
  });

  // Watch father's address fields
  const fatherPresentAddress = watch("guardian.father.presentAddress");
  const fatherPermanentAddress = watch("guardian.father.permanentAddress");

  // Auto-fill mother's address when checkbox is checked
  useEffect(() => {
    if (sameAsFatherPresentAddress) {
      setValue("guardian.mother.presentAddress", {
        address: fatherPresentAddress.address,
        district: fatherPresentAddress.district,
      });
    }
  }, [sameAsFatherPresentAddress, fatherPresentAddress, setValue]);

  useEffect(() => {
    if (sameAsFatherPermanentAddress) {
      setValue("guardian.mother.permanentAddress", {
        address: fatherPermanentAddress.address,
        district: fatherPermanentAddress.district,
      });
    }
  }, [sameAsFatherPermanentAddress, fatherPermanentAddress, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      const image = {
        url: "",
        publicId: "",
      };
      if (selectedFile) {
        const res = await uploadToCloudinary(selectedFile);
        image.url = res.url;
        image.publicId = res.publicId;
      }

      const finalData = {
        ...data,
        image,
        admissionDate: data.admissionDate.toISOString(),
      };

      const result = await createStudent(finalData).unwrap();
      if (result.success) {
        alert("Student Created Successfully");
        refetch();
        reset();
      }
    } catch (error: any) {
      alert(
        error?.data.errorSources[0].message ||
          "An error occurred while creating student",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const siblings = watch("siblings");

  const addSibling = () => {
    const currentSiblings = siblings || [];
    setValue("siblings", [
      ...currentSiblings,
      { name: "", relation: "brother", class: "", roll: "" },
    ]);
  };

  const removeSibling = (index: number) => {
    const currentSiblings = siblings || [];
    setValue(
      "siblings",
      currentSiblings.filter((_, i) => i !== index),
    );
  };

  const copyFatherPresentAddress = () => {
    const fatherAddress = getValues("guardian.father.presentAddress");
    setValue("guardian.mother.presentAddress", {
      address: fatherAddress.address,
      district: fatherAddress.district,
    });
  };

  const copyFatherPermanentAddress = () => {
    const fatherAddress = getValues("guardian.father.permanentAddress");
    setValue("guardian.mother.permanentAddress", {
      address: fatherAddress.address,
      district: fatherAddress.district,
    });
  };

  const handleAddMoreStudent = () => {
    setShowSuccessModal(false);
    setCreatedStudent(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrintStudentInfo = () => {
    window.print();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header - Mobile Optimized */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <FaUserGraduate className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">নতুন ছাত্র</h1>
                <p className="text-xs text-gray-600">সব তথ্য দিন</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-medium text-gray-700">
                * চিহ্নিত ঘর অবশ্যই পূরণ করুন
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-green-500 w-1/3 rounded-full"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 pb-28">
        {/* Student Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("studentInfo")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/50"
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-500 rounded-lg">
                <FaUser className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                ছাত্রের তথ্য
              </span>
            </div>
            {expandedSections.studentInfo ? (
              <FaChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <FaChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expandedSections.studentInfo && (
            <div className="p-4 space-y-4">
              {/* Image Upload - Mobile Optimized */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative w-full max-w-[200px] mx-auto">
                      <div className="relative rounded-xl overflow-hidden border-2 border-blue-200">
                        <Image
                          height={160}
                          width={160}
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setSelectedFile(null);
                            setValue("image", "");
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-2 text-center font-medium">
                        ✓ ছবি আপলোড হয়েছে
                      </p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="text-center mb-3">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                          <FaUpload className="w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                      <label className="block w-full">
                        <div className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium text-center shadow-md active:from-blue-700 active:to-blue-800">
                          ছবি আপলোড করুন
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-gray-500 text-center mt-2">
                        JPG, PNG • Max 2MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <FaSchool className="w-3 h-3 mr-1 text-blue-500" />
                    ভর্তির ক্লাস *
                  </label>
                  <select
                    {...register("admissionClass", { required: true })}
                    onChange={(e) => setSelectClass(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">ক্লাস নির্বাচন করুন</option>
                    {[
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
                    ].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="w-3 h-3 mr-1 text-blue-500" />
                    ভর্তির তারিখ *
                  </label>
                  <Controller
                    name="admissionDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="তারিখ নির্বাচন করুন"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <span className="inline-flex items-center">
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[8px] mr-1">
                        বাংলা
                      </span>
                      নাম *
                    </span>
                  </label>
                  <input
                    {...register("name.bengaliName", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="বাংলা নাম লিখুন"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <span className="inline-flex items-center">
                      <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[8px] mr-1">
                        EN
                      </span>
                      English Name *
                    </span>
                  </label>
                  <input
                    {...register("name.englishName", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter English Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                      <FaEnvelope className="w-3 h-3 mr-1 text-blue-500" />
                      ইমেইল *
                    </label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                      placeholder="s@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                      <FaBirthdayCake className="w-3 h-3 mr-1 text-blue-500" />
                      জন্ম তারিখ *
                    </label>
                    <input
                      type="date"
                      {...register("dateOfBirth", { required: true })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                      <FaFlag className="w-3 h-3 mr-1 text-blue-500" />
                      ধর্ম *
                    </label>
                    <select
                      {...register("religion", { required: true })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                    >
                      <option value="Islam">ইসলাম</option>
                      <option value="Hinduism">হিন্দু</option>
                      <option value="Christianity">খ্রিস্টান</option>
                      <option value="Buddhism">বৌদ্ধ</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                      <FaIdCard className="w-3 h-3 mr-1 text-blue-500" />
                      জন্ম সনদ *
                    </label>
                    <input
                      {...register("birthCertificateNo", { required: true })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                      placeholder="জন্ম সনদ নং"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <FaPhone className="w-3 h-3 mr-1 text-blue-500" />
                    হোয়াটসঅ্যাপ নম্বর *
                  </label>
                  <input
                    {...register("WhatsappNumber", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Academic Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("academicInfo")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50/50"
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-500 rounded-lg">
                <FaBook className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                একাডেমিক তথ্য
              </span>
            </div>
            {expandedSections.academicInfo ? (
              <FaChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <FaChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expandedSections.academicInfo && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    রোল নং *
                  </label>
                  <input
                    {...register("rollNo", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                    placeholder="রোল নং"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ভার্সন *
                  </label>
                  <select
                    {...register("version", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                  >
                    <option value="bangla">বাংলা ভার্সন</option>
                    <option value="english">English Version</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  পূর্ববর্তী স্কুল *
                </label>
                <input
                  {...register("previousSchool", { required: true })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                  placeholder="পূর্ববর্তী স্কুলের নাম"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <FaBus className="w-3 h-3 mr-1 text-emerald-500" />
                    পরিবহন *
                  </label>
                  <select
                    {...register("transportation", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                  >
                    <option value="no">না</option>
                    <option value="yes">হ্যাঁ</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <FaHeartbeat className="w-3 h-3 mr-1 text-emerald-500" />
                    ব্লাড গ্রুপ *
                  </label>
                  <select
                    {...register("bloodGroup", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {seclectClass >= "6" && (
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <FaChild className="w-3 h-3 mr-1 text-emerald-500" />
                    ক্যাডেট
                  </label>
                  <select
                    {...register("isCadet")}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl"
                  >
                    <option value="false">না</option>
                    <option value="true">হ্যাঁ</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Guardian Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("guardianInfo")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50/50"
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-orange-500 rounded-lg">
                <RiParentFill className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                অভিভাবকের তথ্য
              </span>
            </div>
            {expandedSections.guardianInfo ? (
              <FaChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <FaChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expandedSections.guardianInfo && (
            <div className="p-4 space-y-4">
              {/* Father's Info */}
              <div className="bg-blue-50/30 rounded-xl p-3 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                  পিতার তথ্য
                </h3>
                <div className="space-y-3">
                  <input
                    {...register("guardian.father.name.bengaliName", {
                      required: true,
                    })}
                    className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                    placeholder="বাবার বাংলা নাম"
                  />
                  <input
                    {...register("guardian.father.name.englishName", {
                      required: true,
                    })}
                    className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                    placeholder="Father's English Name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      {...register("guardian.father.mobile", {
                        required: true,
                      })}
                      className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                      placeholder="মোবাইল নং"
                    />
                    <input
                      {...register("guardian.father.occupation", {
                        required: true,
                      })}
                      className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                      placeholder="পেশা"
                    />
                  </div>
                  <input
                    {...register("guardian.father.nid", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                    placeholder="এনআইডি নম্বর"
                  />

                  {/* Father's Addresses */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-blue-800">
                      বর্তমান ঠিকানা
                    </p>
                    <input
                      {...register("guardian.father.presentAddress.address", {
                        required: true,
                      })}
                      className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                      placeholder="ঠিকানা"
                    />
                    <input
                      {...register("guardian.father.presentAddress.district", {
                        required: true,
                      })}
                      className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                      placeholder="জেলা"
                    />

                    <p className="text-xs font-medium text-blue-800 mt-2">
                      স্থায়ী ঠিকানা
                    </p>
                    <input
                      {...register("guardian.father.permanentAddress.address", {
                        required: true,
                      })}
                      className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                      placeholder="ঠিকানা"
                    />
                    <input
                      {...register(
                        "guardian.father.permanentAddress.district",
                        { required: true },
                      )}
                      className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-white"
                      placeholder="জেলা"
                    />
                  </div>
                </div>
              </div>

              {/* Mother's Info */}
              <div className="bg-pink-50/30 rounded-xl p-3 border border-pink-100">
                <h3 className="text-sm font-semibold text-pink-900 mb-3 flex items-center">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></div>
                  মাতার তথ্য
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSameAsFatherPresentAddress(
                            !sameAsFatherPresentAddress,
                          )
                        }
                        className={`px-2 py-1 text-[10px] rounded-lg flex items-center space-x-1 ${
                          sameAsFatherPresentAddress
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {sameAsFatherPresentAddress ? (
                          <FaCheck className="w-2 h-2" />
                        ) : (
                          <FaCopy className="w-2 h-2" />
                        )}
                        <span>বর্তমান ঠিকানা কপি</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSameAsFatherPermanentAddress(
                            !sameAsFatherPermanentAddress,
                          )
                        }
                        className={`px-2 py-1 text-[10px] rounded-lg flex items-center space-x-1 ${
                          sameAsFatherPermanentAddress
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {sameAsFatherPermanentAddress ? (
                          <FaCheck className="w-2 h-2" />
                        ) : (
                          <FaCopy className="w-2 h-2" />
                        )}
                        <span>স্থায়ী ঠিকানা কপি</span>
                      </button>
                    </div>
                  </div>

                  <input
                    {...register("guardian.mother.name.bengaliName", {
                      required: true,
                    })}
                    className="w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl bg-white"
                    placeholder="মায়ের বাংলা নাম"
                  />
                  <input
                    {...register("guardian.mother.name.englishName", {
                      required: true,
                    })}
                    className="w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl bg-white"
                    placeholder="Mother's English Name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      {...register("guardian.mother.mobile", {
                        required: true,
                      })}
                      className="w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl bg-white"
                      placeholder="মোবাইল নং"
                    />
                    <input
                      {...register("guardian.mother.occupation", {
                        required: true,
                      })}
                      className="w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl bg-white"
                      placeholder="পেশা"
                    />
                  </div>
                  <input
                    {...register("guardian.mother.nid", { required: true })}
                    className="w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl bg-white"
                    placeholder="এনআইডি নম্বর"
                  />

                  {/* Mother's Addresses */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-pink-800">
                      বর্তমান ঠিকানা
                    </p>
                    <input
                      {...register("guardian.mother.presentAddress.address", {
                        required: true,
                      })}
                      disabled={sameAsFatherPresentAddress}
                      className={`w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl ${
                        sameAsFatherPresentAddress
                          ? "bg-gray-100 text-gray-500"
                          : "bg-white"
                      }`}
                      placeholder={
                        sameAsFatherPresentAddress
                          ? "পিতার ঠিকানা অনুযায়ী"
                          : "ঠিকানা"
                      }
                    />
                    <input
                      {...register("guardian.mother.presentAddress.district", {
                        required: true,
                      })}
                      disabled={sameAsFatherPresentAddress}
                      className={`w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl ${
                        sameAsFatherPresentAddress
                          ? "bg-gray-100 text-gray-500"
                          : "bg-white"
                      }`}
                      placeholder={
                        sameAsFatherPresentAddress
                          ? "পিতার জেলা অনুযায়ী"
                          : "জেলা"
                      }
                    />

                    <p className="text-xs font-medium text-pink-800 mt-2">
                      স্থায়ী ঠিকানা
                    </p>
                    <input
                      {...register("guardian.mother.permanentAddress.address", {
                        required: true,
                      })}
                      disabled={sameAsFatherPermanentAddress}
                      className={`w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl ${
                        sameAsFatherPermanentAddress
                          ? "bg-gray-100 text-gray-500"
                          : "bg-white"
                      }`}
                      placeholder={
                        sameAsFatherPermanentAddress
                          ? "পিতার ঠিকানা অনুযায়ী"
                          : "ঠিকানা"
                      }
                    />
                    <input
                      {...register(
                        "guardian.mother.permanentAddress.district",
                        { required: true },
                      )}
                      disabled={sameAsFatherPermanentAddress}
                      className={`w-full px-3 py-2.5 text-sm border border-pink-200 rounded-xl ${
                        sameAsFatherPermanentAddress
                          ? "bg-gray-100 text-gray-500"
                          : "bg-white"
                      }`}
                      placeholder={
                        sameAsFatherPermanentAddress
                          ? "পিতার জেলা অনুযায়ী"
                          : "জেলা"
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Local Guardian Toggle */}
              <button
                type="button"
                onClick={() => setShowLocalGuardian(!showLocalGuardian)}
                className="w-full py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center space-x-2"
              >
                <FaPlus className="w-3 h-3" />
                <span>
                  {showLocalGuardian
                    ? "স্থানীয় অভিভাবক সরান"
                    : "স্থানীয় অভিভাবক যোগ করুন"}
                </span>
              </button>

              {showLocalGuardian && (
                <div className="bg-green-50/30 rounded-xl p-3 border border-green-100">
                  <h3 className="text-sm font-semibold text-green-900 mb-3">
                    স্থানীয় অভিভাবক
                  </h3>
                  <div className="space-y-2">
                    <input
                      {...register("guardian.localGuardian.name")}
                      className="w-full px-3 py-2.5 text-sm border border-green-200 rounded-xl bg-white"
                      placeholder="নাম"
                    />
                    <input
                      {...register("guardian.localGuardian.relation")}
                      className="w-full px-3 py-2.5 text-sm border border-green-200 rounded-xl bg-white"
                      placeholder="সম্পর্ক"
                    />
                    <input
                      {...register("guardian.localGuardian.phone")}
                      className="w-full px-3 py-2.5 text-sm border border-green-200 rounded-xl bg-white"
                      placeholder="মোবাইল নং"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Siblings Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("siblingsInfo")}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-50 to-violet-50/50"
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-purple-500 rounded-lg">
                <MdFamilyRestroom className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                ভাইবোনের তথ্য
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {siblings?.length > 0 && (
                <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full text-[8px]">
                  {siblings.length}
                </span>
              )}
              {expandedSections.siblingsInfo ? (
                <FaChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <FaChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          {expandedSections.siblingsInfo && (
            <div className="p-4">
              {siblings?.length === 0 ? (
                <div className="text-center py-6">
                  <MdFamilyRestroom className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-3">
                    কোনো ভাইবোন যোগ করা হয়নি
                  </p>
                  <button
                    type="button"
                    onClick={addSibling}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-xl text-sm font-medium inline-flex items-center space-x-2"
                  >
                    <FaPlus className="w-3 h-3" />
                    <span>ভাইবোন যোগ করুন</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {siblings.map((_, index) => (
                    <div
                      key={index}
                      className="bg-purple-50/30 rounded-xl p-3 border border-purple-100"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-semibold text-purple-900">
                          ভাইবোন {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeSibling(index)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          {...register(`siblings.${index}.name`, {
                            required: true,
                          })}
                          className="w-full px-3 py-2 text-sm border border-purple-200 rounded-xl bg-white"
                          placeholder="নাম"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            {...register(`siblings.${index}.relation`, {
                              required: true,
                            })}
                            className="px-3 py-2 text-sm border border-purple-200 rounded-xl bg-white"
                          >
                            <option value="brother">ভাই</option>
                            <option value="sister">বোন</option>
                          </select>
                          <input
                            {...register(`siblings.${index}.class`, {
                              required: true,
                            })}
                            className="px-3 py-2 text-sm border border-purple-200 rounded-xl bg-white"
                            placeholder="ক্লাস"
                          />
                          <input
                            {...register(`siblings.${index}.roll`, {
                              required: true,
                            })}
                            className="px-3 py-2 text-sm border border-purple-200 rounded-xl bg-white"
                            placeholder="রোল"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSibling}
                    className="w-full py-2.5 border-2 border-dashed border-purple-200 rounded-xl text-sm text-purple-700 font-medium hover:bg-purple-50 transition-colors"
                  >
                    + আরেকটি ভাইবোন যোগ করুন
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-lg">
          <div className="flex items-center space-x-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                reset(defaultValues);
                setImagePreview("");
                setSelectedFile(null);
              }}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              রিসেট
            </button>
            <button
              type="submit"
              disabled={isSubmitting || imageUploading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting || imageUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>
                    {imageUploading ? "ছবি আপলোড হচ্ছে..." : "সাবমিট হচ্ছে..."}
                  </span>
                </>
              ) : (
                <>
                  <FaCheck className="w-3 h-3" />
                  <span>সাবমিট</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal - Mobile Optimized */}
      {showSuccessModal && createdStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MdCheckCircle className="w-5 h-5 text-white" />
                  <h2 className="text-base font-bold text-white">
                    সফল হয়েছে!
                  </h2>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="p-1.5 text-white/80 hover:text-white"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600">ছাত্র আইডি</p>
                  <p className="text-sm font-bold text-blue-700">
                    {createdStudent.studentId}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center space-x-3">
                    {createdStudent.image?.url && (
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          width={48}
                          height={48}
                          src={createdStudent.image.url}
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold">
                        {createdStudent.name.englishName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {createdStudent.name.bengaliName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-[10px] text-gray-500">ক্লাস</p>
                    <p className="text-xs font-bold">
                      Class {createdStudent.admissionClass}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-[10px] text-gray-500">রোল</p>
                    <p className="text-xs font-bold">{createdStudent.rollNo}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={handleAddMoreStudent}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl text-sm font-medium"
                >
                  আরেকটি যোগ করুন
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStudent;
