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
  FaSquare,
} from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { TAddress, TName } from "@/types/index.type";
import { useCreateStudentMutation } from "@/redux/features/student/studentApi";
import { useCloudinaryUpload } from "@/utils/useCloudinaryUpload";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

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

  const { uploadToCloudinary, loading: imageUploading } = useCloudinaryUpload();

  console.log(seclectClass);

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

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FaUserGraduate className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Create New Student
              </h1>
              <p className="text-gray-600">
                Fill in the student&apos;s information below
              </p>
            </div>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Student Basic Info */}
              <div className="space-y-6">
                {/* Section Title */}
                <div className="flex items-center space-x-2 mb-4">
                  <FaUser className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Student Information
                  </h2>
                </div>

                {/* admission class & Admission Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admission Class *
                    </label>
                    <select
                      {...register("admissionClass", {
                        required: "Admission class is required",
                      })}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        setSelectClass(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                      <p className="mt-1 text-sm text-red-600">
                        {errors.admissionClass.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select admission date"
                        />
                      )}
                    />
                    {errors.admissionDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.admissionDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bengali Name *
                    </label>
                    <input
                      {...register("name.bengaliName", {
                        required: "Bengali name is required",
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="বাংলা নাম"
                    />
                    {errors.name?.bengaliName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.bengaliName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      English Name *
                    </label>
                    <input
                      {...register("name.englishName", {
                        required: "English name is required",
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="English Name"
                    />
                    {errors.name?.englishName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.englishName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="w-4 h-4 mr-2 text-blue-600" />
                      Email *
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="student@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaBirthdayCake className="w-4 h-4 mr-2 text-blue-600" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      {...register("dateOfBirth", {
                        required: "Date of birth is required",
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Religion & Nationality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Religion *
                    </label>
                    <select
                      {...register("religion", {
                        required: "Religion is required",
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.religion && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.religion.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaFlag className="w-4 h-4 mr-2 text-blue-600" />
                      Nationality *
                    </label>
                    <input
                      {...register("nationality", {
                        required: "Nationality is required",
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Bangladeshi"
                    />
                    {errors.nationality && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Birth Certificate & WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birth Certificate No *
                    </label>
                    <input
                      {...register("birthCertificateNo", {
                        required: "Birth certificate number is required",
                      })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="1234567890"
                    />
                    {errors.birthCertificateNo && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.birthCertificateNo.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="w-4 h-4 mr-2 text-blue-600" />
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="01XXXXXXXXX"
                    />
                    {errors.WhatsappNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.WhatsappNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Academic & Image */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <FaImage className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Student Photo
                    </h2>
                  </div>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-400 transition-all">
                    {imagePreview ? (
                      <div className="relative">
                        <Image
                          height={192}
                          width={192}
                          src={imagePreview}
                          alt="Preview"
                          className="w-48 h-48 rounded-xl object-cover shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setSelectedFile(null);
                            setValue("image", "");
                          }}
                          className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                        {selectedFile && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                            New Image
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUpload className="w-12 h-12 text-blue-600" />
                        </div>
                        <p className="text-gray-600 mb-2">
                          Upload student photo
                        </p>
                        <label className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG up to 2MB
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
                      <p className="mt-1 text-sm text-red-600 text-center">
                        {errors.image.message}
                      </p>
                    )}
                    {(imageUploading || isSubmitting) && (
                      <div className="mt-2 text-blue-600 text-sm flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        {imageUploading
                          ? "Uploading image..."
                          : "Processing..."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <FaBook className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Academic Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous School *
                      </label>
                      <input
                        {...register("previousSchool", {
                          required: "Previous school is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Previous school name"
                      />
                      {errors.previousSchool && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.previousSchool.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Roll No *
                      </label>
                      <input
                        {...register("rollNo", {
                          required: "Roll number is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="001"
                      />
                      {errors.rollNo && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.rollNo.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Version *
                      </label>
                      <select
                        {...register("version", {
                          required: "Version is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="bangla">Bangla Version</option>
                        <option value="english">English Version</option>
                      </select>
                      {errors.version && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.version.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cadet *
                      </label>
                      <select
                        {...register("isCadet", {
                          required: "Cadet is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                      {errors.version && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.version.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <FaBus className="w-4 h-4 mr-2 text-blue-600" />
                        Transportation *
                      </label>
                      <select
                        {...register("transportation", {
                          required: "Transportation is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                      {errors.transportation && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.transportation.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <FaUsers className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Guardian Information
              </h2>
            </div>

            {/* Father's Information */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Father&apos;s Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bengali Name *
                  </label>
                  <input
                    {...register("guardian.father.name.bengaliName", {
                      required: "Father's bengali name is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="বাবার বাংলা নাম"
                  />
                  {errors.guardian?.father?.name?.bengaliName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.father.name.bengaliName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English Name *
                  </label>
                  <input
                    {...register("guardian.father.name.englishName", {
                      required: "Father's english name is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Father's English Name"
                  />
                  {errors.guardian?.father?.name?.englishName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.father.name.englishName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile *
                  </label>
                  <input
                    {...register("guardian.father.mobile", {
                      required: "Father's mobile is required",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "Invalid Bangladeshi mobile number",
                      },
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.guardian?.father?.mobile && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.father.mobile.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NID *
                  </label>
                  <input
                    {...register("guardian.father.nid", {
                      required: "Father's NID is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="National ID number"
                  />
                  {errors.guardian?.father?.nid && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.father.nid.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation *
                  </label>
                  <input
                    {...register("guardian.father.occupation", {
                      required: "Father's occupation is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Occupation"
                  />
                  {errors.guardian?.father?.occupation && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.father.occupation.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Father's Address */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Present Address */}
                <div className="p-4 bg-blue-100 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-800">
                      Present Address
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register("guardian.father.presentAddress.address", {
                          required: "Present address is required",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="District name"
                      />
                    </div>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="p-4 bg-blue-100 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-800">
                      Permanent Address
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register(
                          "guardian.father.permanentAddress.address",
                          { required: "Permanent address is required" }
                        )}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="District name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mother's Information */}
            <div className="mb-8 p-6 bg-purple-50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-purple-800">
                  Mother&apos;s Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bengali Name *
                  </label>
                  <input
                    {...register("guardian.mother.name.bengaliName", {
                      required: "Mother's bengali name is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="মায়ের বাংলা নাম"
                  />
                  {errors.guardian?.mother?.name?.bengaliName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.mother.name.bengaliName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English Name *
                  </label>
                  <input
                    {...register("guardian.mother.name.englishName", {
                      required: "Mother's english name is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Mother's English Name"
                  />
                  {errors.guardian?.mother?.name?.englishName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.mother.name.englishName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile *
                  </label>
                  <input
                    {...register("guardian.mother.mobile", {
                      required: "Mother's mobile is required",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "Invalid Bangladeshi mobile number",
                      },
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.guardian?.mother?.mobile && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.mother.mobile.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NID *
                  </label>
                  <input
                    {...register("guardian.mother.nid", {
                      required: "Mother's NID is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="National ID number"
                  />
                  {errors.guardian?.mother?.nid && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.mother.nid.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occupation *
                  </label>
                  <input
                    {...register("guardian.mother.occupation", {
                      required: "Mother's occupation is required",
                    })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Occupation"
                  />
                  {errors.guardian?.mother?.occupation && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.guardian.mother.occupation.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Mother's Address with Auto-fill Options */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Present Address with Auto-fill */}
                <div className="p-4 bg-purple-100 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-purple-800">
                      Present Address
                    </h4>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={copyFatherPresentAddress}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
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
                          className="flex items-center space-x-2 text-sm"
                        >
                          {sameAsFatherPresentAddress ? (
                            <IoCheckmarkCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <FaSquare className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-gray-700">
                            Same as Father's
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        {...register("guardian.mother.presentAddress.address", {
                          required: "Present address is required",
                        })}
                        disabled={sameAsFatherPresentAddress}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          sameAsFatherPresentAddress
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder={
                          sameAsFatherPresentAddress
                            ? "Same as Father's Address"
                            : "Full address"
                        }
                      />
                      {sameAsFatherPresentAddress && (
                        <p className="text-xs text-green-600 mt-1 flex items-center">
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
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          sameAsFatherPresentAddress
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
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
                <div className="p-4 bg-purple-100 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-purple-800">
                      Permanent Address
                    </h4>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={copyFatherPermanentAddress}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
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
                          className="flex items-center space-x-2 text-sm"
                        >
                          {sameAsFatherPermanentAddress ? (
                            <IoCheckmarkCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <FaSquare className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-gray-700">
                            Same as Father's
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
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
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          sameAsFatherPermanentAddress
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder={
                          sameAsFatherPermanentAddress
                            ? "Same as Father's Address"
                            : "Full address"
                        }
                      />
                      {sameAsFatherPermanentAddress && (
                        <p className="text-xs text-green-600 mt-1 flex items-center">
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
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                          sameAsFatherPermanentAddress
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FaHome className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Local Guardian (Optional)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocalGuardian(!showLocalGuardian)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2"
                >
                  {showLocalGuardian ? (
                    <>
                      <span>Hide</span>
                      <FaUsers className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Add Local Guardian</span>
                      <FaPlus className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {showLocalGuardian && (
                <div className="p-6 bg-green-50 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      {...register("guardian.localGuardian.name")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Local guardian name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("guardian.localGuardian.email")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="guardian@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relation
                    </label>
                    <input
                      {...register("guardian.localGuardian.relation")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Uncle/Aunt etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      {...register("guardian.localGuardian.phone")}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Siblings Information */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FaUsers className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Siblings Information (Optional)
                </h2>
              </div>
              <button
                type="button"
                onClick={addSibling}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Sibling</span>
              </button>
            </div>

            <div className="space-y-4">
              {siblings?.map((_, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Sibling {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeSibling(index)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Remove sibling"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        {...register(`siblings.${index}.name`, {
                          required: "Sibling name is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="Sibling name"
                      />
                      {errors.siblings?.[index]?.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.siblings[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relation *
                      </label>
                      <select
                        {...register(`siblings.${index}.relation`, {
                          required: "Relation is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      >
                        <option value="brother">Brother</option>
                        <option value="sister">Sister</option>
                      </select>
                      {errors.siblings?.[index]?.relation && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.siblings[index]?.relation?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Class *
                      </label>
                      <input
                        {...register(`siblings.${index}.class`, {
                          required: "Class is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="Class"
                      />
                      {errors.siblings?.[index]?.class && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.siblings[index]?.class?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Roll *
                      </label>
                      <input
                        {...register(`siblings.${index}.roll`, {
                          required: "Roll is required",
                        })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="Roll number"
                      />
                      {errors.siblings?.[index]?.roll && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.siblings[index]?.roll?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(!siblings || siblings.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <p className="text-gray-500">
                    No siblings added yet. Click &quot;Add Sibling&quot; to add
                    sibling information.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
            <button
              type="button"
              onClick={() => {
                reset(defaultValues);
                setSameAsFatherPresentAddress(false);
                setSameAsFatherPermanentAddress(false);
                setImagePreview("");
                setSelectedFile(null);
              }}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center justify-center space-x-2"
            >
              <FaTrash className="w-4 h-4" />
              <span>Reset Form</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting || imageUploading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting || imageUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>
                    {imageUploading
                      ? "Uploading Image..."
                      : "Creating Student..."}
                  </span>
                </>
              ) : (
                <>
                  <FaCheck className="w-5 h-5" />
                  <span>Create Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
