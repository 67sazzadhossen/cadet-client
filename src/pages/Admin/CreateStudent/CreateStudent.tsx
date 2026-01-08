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
} from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RiParentFill } from "react-icons/ri";
import { MdCheckCircle, MdFamilyRestroom, MdLocationOn } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { TAddress, TBloodGroup, TName } from "@/types/index.type";
import { useCreateStudentMutation } from "@/redux/features/student/studentApi";
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
  const [sameAsFatherPermanentAddress, setSameAsFatherPermanentAddress] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdStudent, setCreatedStudent] =
    useState<CreatedStudentData | null>(null);

  const { uploadToCloudinary, loading: imageUploading } = useCloudinaryUpload();

  // Default values matching your Mongoose schema
  const defaultValues: StudentFormData = {
    admissionDate: new Date(),
    id: "000000",
    image: "",
    email: "s@gmail.com",
    admissionClass: "1",
    name: {
      bengaliName: "মোঃ সাজ্জাদ হোসেন",
      englishName: "Md Sazzad Hossen",
    },
    dateOfBirth: "06/04/1999",
    religion: "Islam",
    nationality: "Bangladeshi",
    birthCertificateNo: "543242543252354",
    previousSchool: "fdasfsaf",
    rollNo: "01",
    version: "bangla",
    guardian: {
      father: {
        name: {
          bengaliName: "মোঃ সাইফুল ইসলাম",
          englishName: "Md Saiful Islam",
        },
        mobile: "01710000000",
        nid: "54325325",
        occupation: "fgddsaf",
        presentAddress: {
          address: "fdsfsaffd",
          district: "fdsafsaf",
        },
        permanentAddress: {
          address: "fdsafsdfsad",
          district: "fsdafsdasda",
        },
      },
      mother: {
        name: {
          bengaliName: "রাবেয়া সিদ্দিকা",
          englishName: "Rabeya Shiddika",
        },
        mobile: "01750000000",
        nid: "54325325342",
        occupation: "fdsafsadf",
        presentAddress: {
          address: "",
          district: "",
        },
        permanentAddress: {
          address: "",
          district: "",
        },
      },
      localGuardian: {
        name: "fdsfsaf",
        email: "a@gmail.com",
        relation: "fdsfsaf",
        phone: "01750000000",
      },
    },
    siblings: [],
    WhatsappNumber: "01750000000",
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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    console.log("clicked");
    console.log(data);
    setIsSubmitting(true);

    try {
      const image = {
        url: "",
        publicId: "",
      };
      // Upload image if a new file is selected
      if (selectedFile) {
        const res = await uploadToCloudinary(selectedFile);
        image.url = res.url;
        image.publicId = res.publicId;
      }

      // Prepare final data with uploaded image URL
      const finalData = {
        ...data,
        image,
        admissionDate: data.admissionDate.toISOString(),
      };

      console.log(finalData);

      const result = await createStudent(finalData).unwrap();
      if (result.success) {
        alert("Student Created Successfully");
        reset();
      }

      // Call the API to create student
    } catch (error: any) {
      alert(
        error?.data.errorSources[0].message ||
          "An error occurred while creating student"
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
      currentSiblings.filter((_, i) => i !== index)
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
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrintStudentInfo = () => {
    window.print();
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <FaUserGraduate className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
                  Create New Student
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete the student profile with all required information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                All fields marked with * are required
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Form Card - Modern Glass Effect */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Student Basic Info */}
              <div className="space-y-8">
                {/* Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <FaUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Student Information
                      </h2>
                      <p className="text-sm text-gray-600">
                        Personal details and contact information
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Required
                  </div>
                </div>

                {/* admission class & Admission Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <FaSchool className="w-4 h-4 mr-2 text-blue-600" />
                      Admission Class *
                    </label>
                    <select
                      {...register("admissionClass", {
                        required: "Admission class is required",
                      })}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setSelectClass(e.target.value);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                    >
                      <option value="">Select Class</option>
                      <option value="Play">Play</option>
                      <option value="Nursery">Nursery</option>
                      <option value="KG">KG</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      <option value="4">Class 4</option>
                      <option value="5">Class 5</option>
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                    </select>
                    {errors.admissionClass && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.admissionClass.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <FaCalendarAlt className="w-4 h-4 mr-2 text-blue-600" />
                      Admission Date *
                    </label>
                    <Controller
                      name="admissionDate"
                      control={control}
                      rules={{ required: "Admission date is required" }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select admission date"
                        />
                      )}
                    />
                    {errors.admissionDate && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.admissionDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      <span className="inline-flex items-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs mr-2">
                          বাংলা
                        </span>
                        Bengali Name *
                      </span>
                    </label>
                    <input
                      {...register("name.bengaliName", {
                        required: "Bengali name is required",
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                      placeholder="বাংলা নাম লিখুন"
                    />
                    {errors.name?.bengaliName && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.name.bengaliName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      <span className="inline-flex items-center">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs mr-2">
                          EN
                        </span>
                        English Name *
                      </span>
                    </label>
                    <input
                      {...register("name.englishName", {
                        required: "English name is required",
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                      placeholder="Enter English Name"
                    />
                    {errors.name?.englishName && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.name.englishName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <FaEnvelope className="w-4 h-4 mr-2 text-blue-600" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                      placeholder="student@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <FaBirthdayCake className="w-4 h-4 mr-2 text-blue-600" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      {...register("dateOfBirth", {
                        required: "Date of birth is required",
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Religion & Nationality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <FaTransgender className="w-4 h-4 mr-2 text-blue-600" />
                      Religion *
                    </label>
                    <select
                      {...register("religion", {
                        required: "Religion is required",
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.religion && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.religion.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <FaFlag className="w-4 h-4 mr-2 text-blue-600" />
                      Nationality *
                    </label>
                    <input
                      {...register("nationality", {
                        required: "Nationality is required",
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                      placeholder="Bangladeshi"
                    />
                    {errors.nationality && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Birth Certificate & WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <FaIdCard className="w-4 h-4 mr-2 text-blue-600" />
                      Birth Certificate No *
                    </label>
                    <input
                      {...register("birthCertificateNo", {
                        required: "Birth certificate number is required",
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                      placeholder="1234567890"
                    />
                    {errors.birthCertificateNo && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.birthCertificateNo.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                      <div className="relative">
                        <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      WhatsApp Number *
                    </label>
                    <input
                      {...register("WhatsappNumber", {
                        required: "WhatsApp number is required",
                        pattern: {
                          value: /^01[3-9]\d{8}$/,
                          message: "Invalid Bangladeshi mobile number",
                        },
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300"
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.WhatsappNumber && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        {errors.WhatsappNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Academic & Image */}
              <div className="space-y-8">
                {/* Modern Image Upload */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                        <FaImage className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Student Photo
                        </h2>
                        <p className="text-sm text-gray-600">
                          Upload a clear passport size photo
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      Max 2MB
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    {imagePreview ? (
                      <div className="relative group">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl">
                          <Image
                            height={256}
                            width={256}
                            src={imagePreview}
                            alt="Preview"
                            className="w-64 h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setSelectedFile(null);
                            setValue("image", "");
                          }}
                          className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg transform hover:scale-110"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                        {selectedFile && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                            ✓ Ready to Upload
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="relative mx-auto mb-6">
                          <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                            <FaUpload className="w-16 h-16 text-blue-400" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <FaPlus className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4 font-medium">
                          Drag & drop or click to upload
                        </p>
                        <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                          <FaUpload className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Choose Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-4">
                          Supports JPG, PNG • Max 2MB • 1:1 Ratio
                        </p>
                      </div>
                    )}
                    <input
                      type="hidden"
                      {...register("image", {
                        validate: (value) => {
                          if (!value && !selectedFile) {
                            return "Student photo is required";
                          }
                          return true;
                        },
                      })}
                    />
                    {errors.image && (
                      <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl text-center">
                        {errors.image.message}
                      </p>
                    )}
                    {(imageUploading || isSubmitting) && (
                      <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600 font-medium">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span>
                          {imageUploading
                            ? "Uploading image..."
                            : "Processing..."}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                        <FaBook className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Academic Information
                        </h2>
                        <p className="text-sm text-gray-600">
                          School and academic details
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaSchool className="w-4 h-4 mr-2 text-emerald-600" />
                        Previous School *
                      </label>
                      <input
                        {...register("previousSchool", {
                          required: "Previous school is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-300"
                        placeholder="Previous school name"
                      />
                      {errors.previousSchool && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.previousSchool.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaUser className="w-4 h-4 mr-2 text-emerald-600" />
                        Roll No *
                      </label>
                      <input
                        {...register("rollNo", {
                          required: "Roll number is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-300"
                        placeholder="001"
                      />
                      {errors.rollNo && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.rollNo.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs mr-2">
                          ভার্সন
                        </span>
                        Version *
                      </label>
                      <select
                        {...register("version", {
                          required: "Version is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-300"
                      >
                        <option value="bangla">Bangla Version</option>
                        <option value="english">English Version</option>
                      </select>
                      {errors.version && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.version.message}
                        </p>
                      )}
                    </div>
                    <div className={`${seclectClass !== "6" && "hidden"}`}>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaChild className="w-4 h-4 mr-2 text-emerald-600" />
                        Cadet Status *
                      </label>
                      <select
                        {...register("isCadet")}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-300"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.isCadet && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.isCadet.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaBus className="w-4 h-4 mr-2 text-emerald-600" />
                        Transportation *
                      </label>
                      <select
                        {...register("transportation", {
                          required: "Transportation is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-300"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                      {errors.transportation && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.transportation.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaHeartbeat className="w-4 h-4 mr-2 text-emerald-600" />
                        Blood Group *
                      </label>
                      <select
                        {...register("bloodGroup", {
                          required: "Blood Group is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white hover:border-gray-300"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      {errors.bloodGroup && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.bloodGroup.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information - Modern Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                  <RiParentFill className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Guardian Information
                  </h2>
                  <p className="text-gray-600">Parents and guardian details</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Father & Mother information required
                </span>
              </div>
            </div>

            {/* Father's Information */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                    <FaUser className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">
                    Father's Information
                  </h3>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Primary Guardian
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    <span className="text-blue-600">বাংলা</span> Name *
                  </label>
                  <input
                    {...register("guardian.father.name.bengaliName", {
                      required: "Father's bengali name is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    placeholder="বাবার বাংলা নাম"
                  />
                  {errors.guardian?.father?.name?.bengaliName && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.father.name.bengaliName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    <span className="text-blue-600">English</span> Name *
                  </label>
                  <input
                    {...register("guardian.father.name.englishName", {
                      required: "Father's english name is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    placeholder="Father's English Name"
                  />
                  {errors.guardian?.father?.name?.englishName && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.father.name.englishName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
                    Mobile Number *
                  </label>
                  <input
                    {...register("guardian.father.mobile", {
                      required: "Father's mobile is required",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "Invalid Bangladeshi mobile number",
                      },
                    })}
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.guardian?.father?.mobile && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.father.mobile.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FaIdCard className="w-4 h-4 mr-2 text-blue-600" />
                    NID Number *
                  </label>
                  <input
                    {...register("guardian.father.nid", {
                      required: "Father's NID is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    placeholder="National ID number"
                  />
                  {errors.guardian?.father?.nid && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.father.nid.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FaUser className="w-4 h-4 mr-2 text-blue-600" />
                    Occupation *
                  </label>
                  <input
                    {...register("guardian.father.occupation", {
                      required: "Father's occupation is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    placeholder="Occupation"
                  />
                  {errors.guardian?.father?.occupation && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.father.occupation.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Father's Address */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Present Address */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <MdLocationOn className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-blue-900">
                        Present Address
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register("guardian.father.presentAddress.address", {
                          required: "Present address is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="Full address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District *
                      </label>
                      <input
                        {...register(
                          "guardian.father.presentAddress.district",
                          { required: "District is required" }
                        )}
                        className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="District name"
                      />
                    </div>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <TbAddressBook className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-blue-900">
                        Permanent Address
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register(
                          "guardian.father.permanentAddress.address",
                          { required: "Permanent address is required" }
                        )}
                        className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="Full address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District *
                      </label>
                      <input
                        {...register(
                          "guardian.father.permanentAddress.district",
                          { required: "District is required" }
                        )}
                        className="w-full px-4 py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                        placeholder="District name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mother's Information */}
            <div className="mb-8 p-6 bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border border-pink-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                    <FaUser className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-900">
                    Mother's Information
                  </h3>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    Secondary Guardian
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    <span className="text-pink-600">বাংলা</span> Name *
                  </label>
                  <input
                    {...register("guardian.mother.name.bengaliName", {
                      required: "Mother's bengali name is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white"
                    placeholder="মায়ের বাংলা নাম"
                  />
                  {errors.guardian?.mother?.name?.bengaliName && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.mother.name.bengaliName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    <span className="text-pink-600">English</span> Name *
                  </label>
                  <input
                    {...register("guardian.mother.name.englishName", {
                      required: "Mother's english name is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white"
                    placeholder="Mother's English Name"
                  />
                  {errors.guardian?.mother?.name?.englishName && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.mother.name.englishName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FaPhone className="w-4 h-4 mr-2 text-pink-600" />
                    Mobile Number *
                  </label>
                  <input
                    {...register("guardian.mother.mobile", {
                      required: "Mother's mobile is required",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "Invalid Bangladeshi mobile number",
                      },
                    })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white"
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.guardian?.mother?.mobile && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.mother.mobile.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FaIdCard className="w-4 h-4 mr-2 text-pink-600" />
                    NID Number *
                  </label>
                  <input
                    {...register("guardian.mother.nid", {
                      required: "Mother's NID is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white"
                    placeholder="National ID number"
                  />
                  {errors.guardian?.mother?.nid && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.mother.nid.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                    <FaUser className="w-4 h-4 mr-2 text-pink-600" />
                    Occupation *
                  </label>
                  <input
                    {...register("guardian.mother.occupation", {
                      required: "Mother's occupation is required",
                    })}
                    className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white"
                    placeholder="Occupation"
                  />
                  {errors.guardian?.mother?.occupation && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      {errors.guardian.mother.occupation.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Mother's Address with Auto-fill Options */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Present Address with Auto-fill */}
                <div className="p-5 bg-gradient-to-br from-pink-50 to-white rounded-xl border-2 border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-pink-100 rounded-lg">
                        <MdLocationOn className="w-4 h-4 text-pink-600" />
                      </div>
                      <h4 className="font-bold text-pink-900">
                        Present Address
                      </h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={copyFatherPresentAddress}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                        title="Copy from Father's Present Address"
                      >
                        <FaCopy className="w-3 h-3" />
                        <span>Copy Father's</span>
                      </button>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSameAsFatherPresentAddress(
                              !sameAsFatherPresentAddress
                            )
                          }
                          className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
                        >
                          {sameAsFatherPresentAddress ? (
                            <IoCheckmarkCircle className="w-5 h-5 text-green-600 animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-transparent"></div>
                            </div>
                          )}
                          <span className="text-gray-700 font-medium">
                            Same as Father's
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register("guardian.mother.presentAddress.address", {
                          required: "Present address is required",
                        })}
                        disabled={sameAsFatherPresentAddress}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
                          sameAsFatherPresentAddress
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                            : "border-pink-100 bg-white"
                        }`}
                        placeholder={
                          sameAsFatherPresentAddress
                            ? "Same as Father's Address"
                            : "Full address"
                        }
                      />
                      {sameAsFatherPresentAddress && (
                        <p className="text-xs text-green-600 mt-1 flex items-center font-medium">
                          <FaCheck className="w-3 h-3 mr-1" />
                          Auto-filled from Father's address
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District *
                      </label>
                      <input
                        {...register(
                          "guardian.mother.presentAddress.district",
                          { required: "District is required" }
                        )}
                        disabled={sameAsFatherPresentAddress}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
                          sameAsFatherPresentAddress
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                            : "border-pink-100 bg-white"
                        }`}
                        placeholder={
                          sameAsFatherPresentAddress
                            ? "Same as Father's District"
                            : "District name"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Permanent Address with Auto-fill */}
                <div className="p-5 bg-gradient-to-br from-pink-50 to-white rounded-xl border-2 border-pink-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-pink-100 rounded-lg">
                        <TbAddressBook className="w-4 h-4 text-pink-600" />
                      </div>
                      <h4 className="font-bold text-pink-900">
                        Permanent Address
                      </h4>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={copyFatherPermanentAddress}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-sm rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                        title="Copy from Father's Permanent Address"
                      >
                        <FaCopy className="w-3 h-3" />
                        <span>Copy Father's</span>
                      </button>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSameAsFatherPermanentAddress(
                              !sameAsFatherPermanentAddress
                            )
                          }
                          className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
                        >
                          {sameAsFatherPermanentAddress ? (
                            <IoCheckmarkCircle className="w-5 h-5 text-green-600 animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-transparent"></div>
                            </div>
                          )}
                          <span className="text-gray-700 font-medium">
                            Same as Father's
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register(
                          "guardian.mother.permanentAddress.address",
                          { required: "Permanent address is required" }
                        )}
                        disabled={sameAsFatherPermanentAddress}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
                          sameAsFatherPermanentAddress
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                            : "border-pink-100 bg-white"
                        }`}
                        placeholder={
                          sameAsFatherPermanentAddress
                            ? "Same as Father's Address"
                            : "Full address"
                        }
                      />
                      {sameAsFatherPermanentAddress && (
                        <p className="text-xs text-green-600 mt-1 flex items-center font-medium">
                          <FaCheck className="w-3 h-3 mr-1" />
                          Auto-filled from Father's address
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District *
                      </label>
                      <input
                        {...register(
                          "guardian.mother.permanentAddress.district",
                          { required: "District is required" }
                        )}
                        disabled={sameAsFatherPermanentAddress}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
                          sameAsFatherPermanentAddress
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                            : "border-pink-100 bg-white"
                        }`}
                        placeholder={
                          sameAsFatherPermanentAddress
                            ? "Same as Father's District"
                            : "District name"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Local Guardian */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      showLocalGuardian
                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                        : "bg-gradient-to-br from-gray-400 to-gray-500"
                    }`}
                  >
                    <FaHome className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Local Guardian
                    </h3>
                    <p className="text-sm text-gray-600">
                      Optional - Add if applicable
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocalGuardian(!showLocalGuardian)}
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg ${
                    showLocalGuardian
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                      : "bg-gradient-to-r from-green-600 to-emerald-700 text-white hover:from-green-700 hover:to-emerald-800"
                  }`}
                >
                  {showLocalGuardian ? (
                    <>
                      <span className="font-medium">Hide</span>
                      <FaUsers className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <FaPlus className="w-4 h-4" />
                      <span className="font-medium">Add Local Guardian</span>
                    </>
                  )}
                </button>
              </div>

              {showLocalGuardian && (
                <div className="p-6 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl border-2 border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaUser className="w-4 h-4 mr-2 text-green-600" />
                        Full Name
                      </label>
                      <input
                        {...register("guardian.localGuardian.name")}
                        className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                        placeholder="Local guardian name"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaEnvelope className="w-4 h-4 mr-2 text-green-600" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register("guardian.localGuardian.email")}
                        className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                        placeholder="guardian@example.com"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaUsers className="w-4 h-4 mr-2 text-green-600" />
                        Relation
                      </label>
                      <input
                        {...register("guardian.localGuardian.relation")}
                        className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                        placeholder="Uncle/Aunt etc."
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaPhone className="w-4 h-4 mr-2 text-green-600" />
                        Phone Number
                      </label>
                      <input
                        {...register("guardian.localGuardian.phone")}
                        className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Siblings Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
                  <MdFamilyRestroom className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Siblings Information
                  </h2>
                  <p className="text-gray-600">
                    Optional - Add sibling details if any
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSibling}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-xl hover:from-purple-700 hover:to-violet-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="w-4 h-4" />
                <span className="font-semibold">Add Sibling</span>
              </button>
            </div>

            <div className="space-y-4">
              {siblings?.map((_, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-purple-50/50 to-violet-50/50 rounded-2xl border border-purple-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                        <FaUsers className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-purple-900">
                        Sibling {index + 1}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSibling(index)}
                      className="p-2.5 bg-gradient-to-br from-red-50 to-rose-50 text-red-600 rounded-xl hover:from-red-100 hover:to-rose-100 transition-all duration-300 border border-red-100"
                      title="Remove sibling"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaUser className="w-4 h-4 mr-2 text-purple-600" />
                        Full Name *
                      </label>
                      <input
                        {...register(`siblings.${index}.name`, {
                          required: "Sibling name is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                        placeholder="Sibling name"
                      />
                      {errors.siblings?.[index]?.name && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.siblings[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaUsers className="w-4 h-4 mr-2 text-purple-600" />
                        Relation *
                      </label>
                      <select
                        {...register(`siblings.${index}.relation`, {
                          required: "Relation is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                      >
                        <option value="brother">Brother</option>
                        <option value="sister">Sister</option>
                      </select>
                      {errors.siblings?.[index]?.relation && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.siblings[index]?.relation?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaBook className="w-4 h-4 mr-2 text-purple-600" />
                        Class *
                      </label>
                      <input
                        {...register(`siblings.${index}.class`, {
                          required: "Class is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                        placeholder="Class"
                      />
                      {errors.siblings?.[index]?.class && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.siblings[index]?.class?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                        <FaUser className="w-4 h-4 mr-2 text-purple-600" />
                        Roll No *
                      </label>
                      <input
                        {...register(`siblings.${index}.roll`, {
                          required: "Roll is required",
                        })}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                        placeholder="Roll number"
                      />
                      {errors.siblings?.[index]?.roll && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          {errors.siblings[index]?.roll?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(!siblings || siblings.length === 0) && (
                <div className="text-center py-12 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <MdFamilyRestroom className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    No siblings added yet
                  </p>
                  <p className="text-gray-400 mt-2">
                    Click &quot;Add Sibling&quot; to add sibling information
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Modern Form Actions */}
          <div className="sticky bottom-6 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FaUserGraduate className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg text-gray-600">Ready to create</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset(defaultValues);
                    setSameAsFatherPresentAddress(false);
                    setSameAsFatherPermanentAddress(false);
                    setImagePreview("");
                    setSelectedFile(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold flex items-center justify-center space-x-2 hover:border-gray-400"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Reset Form</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || imageUploading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isSubmitting || imageUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="relative">
                        {imageUploading
                          ? "Uploading Image..."
                          : "Creating Student..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-5 h-5 relative" />
                      <span className="relative">Create Student Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showSuccessModal && createdStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modalIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <MdCheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Student Created Successfully! 🎉
                    </h2>
                    <p className="text-green-100">
                      Student has been registered successfully
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Student Info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                      <FaUserGraduate className="w-5 h-5 mr-2" />
                      Student Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Student ID:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.studentId}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Name (Bengali):</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.name.bengaliName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Name (English):</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.name.englishName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Class:</span>
                        <span className="font-semibold text-gray-900">
                          Class {createdStudent.admissionClass}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Roll No:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.rollNo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Admission Date:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(
                            createdStudent.admissionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                    <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center">
                      <FaBook className="w-5 h-5 mr-2" />
                      Academic Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {createdStudent.version}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Previous School:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.previousSchool}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Cadet:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.isCadet ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Transportation:</span>
                        <span className="font-semibold text-gray-900 capitalize">
                          {createdStudent.transportation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Group:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.bloodGroup}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Guardian Info & Actions */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
                    <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                      <RiParentFill className="w-5 h-5 mr-2" />
                      Guardian Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Father's Name:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.guardian.father.name.englishName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Father's Mobile:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.guardian.father.mobile}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Mother's Name:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.guardian.mother.name.englishName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mother's Mobile:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.guardian.mother.mobile}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
                    <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                      <FaPhone className="w-5 h-5 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.email}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">WhatsApp:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.WhatsappNumber}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(
                            createdStudent.dateOfBirth
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Religion:</span>
                        <span className="font-semibold text-gray-900">
                          {createdStudent.religion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Siblings Information */}
              {createdStudent.siblings &&
                createdStudent.siblings.length > 0 && (
                  <div className="mt-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <MdFamilyRestroom className="w-5 h-5 mr-2" />
                      Siblings Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {createdStudent.siblings.map((sibling, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-xl border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {sibling.name}
                              </h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {sibling.relation}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                Class {sibling.class}
                              </p>
                              <p className="text-sm text-gray-600">
                                Roll: {sibling.roll}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaEye className="w-4 h-4" />
                  <span className="text-sm">
                    Created at:{" "}
                    {new Date(createdStudent.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handlePrintStudentInfo}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <FaPrint className="w-4 h-4" />
                    <span>Print Details</span>
                  </button>
                  <button
                    onClick={handleAddMoreStudent}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Add More Student</span>
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <FaShareAlt className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStudent;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
