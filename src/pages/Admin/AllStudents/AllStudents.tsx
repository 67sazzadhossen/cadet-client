"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import {
  useDeleteStudentMutation,
  useGetAllStudentsQuery,
  useUpdateStudentMutation,
} from "@/redux/features/student/studentApi";
import { TStudent, TBloodGroup } from "@/types/index.type";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiBookOpen,
  FiPhone,
  FiX,
  FiUpload,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useCloudinaryUpload } from "@/utils/useCloudinaryUpload";

// Edit Student Modal Component
interface EditStudentModalProps {
  student: TStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<TStudent>) => Promise<void>;
}

const EditStudentModal = ({
  student,
  isOpen,
  onClose,
  onUpdate,
}: EditStudentModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadToCloudinary, loading: imageUploading } = useCloudinaryUpload();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: {
        bengaliName: student?.name?.bengaliName || "",
        englishName: student?.name?.englishName || "",
      },
      rollNo: student?.rollNo || "",
      currentClass: student?.currentClass || "",
      admissionClass: student?.admissionClass || "",
      version: student?.version || "bangla",
      WhatsappNumber: student?.WhatsappNumber || "",
      bloodGroup: student?.bloodGroup || "A+",
      religion: student?.religion || "Islam",
      nationality: student?.nationality || "Bangladeshi",
      birthCertificateNo: student?.birthCertificateNo || "",
      previousSchool: student?.previousSchool || "",
      transportation: student?.transportation || "no",
      isCadet: student?.isCadet || false,
      waiver: student?.waiver || 0,
      admissionFee: student?.admissionFee || 0,
      sessionFee: student?.sessionFee || 0,
      guardian: {
        father: {
          name: {
            bengaliName: student?.guardian?.father?.name?.bengaliName || "",
            englishName: student?.guardian?.father?.name?.englishName || "",
          },
          mobile: student?.guardian?.father?.mobile || "",
          nid: student?.guardian?.father?.nid || "",
          occupation: student?.guardian?.father?.occupation || "",
          presentAddress: {
            address: student?.guardian?.father?.presentAddress?.address || "",
            district: student?.guardian?.father?.presentAddress?.district || "",
          },
          permanentAddress: {
            address: student?.guardian?.father?.permanentAddress?.address || "",
            district:
              student?.guardian?.father?.permanentAddress?.district || "",
          },
        },
        mother: {
          name: {
            bengaliName: student?.guardian?.mother?.name?.bengaliName || "",
            englishName: student?.guardian?.mother?.name?.englishName || "",
          },
          mobile: student?.guardian?.mother?.mobile || "",
          nid: student?.guardian?.mother?.nid || "",
          occupation: student?.guardian?.mother?.occupation || "",
          presentAddress: {
            address: student?.guardian?.mother?.presentAddress?.address || "",
            district: student?.guardian?.mother?.presentAddress?.district || "",
          },
          permanentAddress: {
            address: student?.guardian?.mother?.permanentAddress?.address || "",
            district:
              student?.guardian?.mother?.permanentAddress?.district || "",
          },
        },
        localGuardian: {
          name: student?.guardian?.localGuardian?.name || "",
          email: student?.guardian?.localGuardian?.email || "",
          relation: student?.guardian?.localGuardian?.relation || "",
          phone: student?.guardian?.localGuardian?.phone || "",
        },
      },
    },
  });

  useEffect(() => {
    if (student) {
      // Set image preview from existing student image
      if (student.image?.url) {
        setImagePreview(student.image.url);
      } else {
        setImagePreview("");
      }

      reset({
        name: {
          bengaliName: student?.name?.bengaliName || "",
          englishName: student?.name?.englishName || "",
        },
        rollNo: student?.rollNo || "",
        currentClass: student?.currentClass || "",
        admissionClass: student?.admissionClass || "",
        version: student?.version || "bangla",
        WhatsappNumber: student?.WhatsappNumber || "",
        bloodGroup: student?.bloodGroup || "A+",
        religion: student?.religion || "Islam",
        nationality: student?.nationality || "Bangladeshi",
        birthCertificateNo: student?.birthCertificateNo || "",
        previousSchool: student?.previousSchool || "",
        transportation: student?.transportation || "no",
        isCadet: student?.isCadet || false,
        waiver: student?.waiver || 0,
        admissionFee: student?.admissionFee || 0,
        sessionFee: student?.sessionFee || 0,
        guardian: {
          father: {
            name: {
              bengaliName: student?.guardian?.father?.name?.bengaliName || "",
              englishName: student?.guardian?.father?.name?.englishName || "",
            },
            mobile: student?.guardian?.father?.mobile || "",
            nid: student?.guardian?.father?.nid || "",
            occupation: student?.guardian?.father?.occupation || "",
            presentAddress: {
              address: student?.guardian?.father?.presentAddress?.address || "",
              district:
                student?.guardian?.father?.presentAddress?.district || "",
            },
            permanentAddress: {
              address:
                student?.guardian?.father?.permanentAddress?.address || "",
              district:
                student?.guardian?.father?.permanentAddress?.district || "",
            },
          },
          mother: {
            name: {
              bengaliName: student?.guardian?.mother?.name?.bengaliName || "",
              englishName: student?.guardian?.mother?.name?.englishName || "",
            },
            mobile: student?.guardian?.mother?.mobile || "",
            nid: student?.guardian?.mother?.nid || "",
            occupation: student?.guardian?.mother?.occupation || "",
            presentAddress: {
              address: student?.guardian?.mother?.presentAddress?.address || "",
              district:
                student?.guardian?.mother?.presentAddress?.district || "",
            },
            permanentAddress: {
              address:
                student?.guardian?.mother?.permanentAddress?.address || "",
              district:
                student?.guardian?.mother?.permanentAddress?.district || "",
            },
          },
          localGuardian: {
            name: student?.guardian?.localGuardian?.name || "",
            email: student?.guardian?.localGuardian?.email || "",
            relation: student?.guardian?.localGuardian?.relation || "",
            phone: student?.guardian?.localGuardian?.phone || "",
          },
        },
      });
    }
  }, [student, reset]);

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

  const removeImage = () => {
    setImagePreview("");
    setSelectedFile(null);
  };

  const onSubmit = async (data: any) => {
    if (!student?._id) return;

    setIsUpdating(true);
    try {
      let imageData = {};

      // If there's a new image selected, upload it
      if (selectedFile) {
        const res = await uploadToCloudinary(selectedFile);
        imageData = {
          image: {
            url: res.url,
            publicId: res.publicId,
          },
        };
      } else if (!imagePreview && student.image?.url) {
        // If image was removed, you might want to handle that
        imageData = {
          image: null, // or you can set to default image
        };
      }

      const updateData = {
        ...data,
        ...imageData,
      };

      await onUpdate(student._id, updateData);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-t-2xl md:rounded-2xl overflow-hidden animate-slideUp">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              ছাত্র তথ্য সংশোধন
            </h2>
            <p className="text-xs text-gray-600">
              ID: {student.id} | {student.name.englishName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Image Upload Section */}
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
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <FiTrash2 className="w-3 h-3" />
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
                        <FiUpload className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    <label className="block w-full">
                      <div className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium text-center shadow-md active:from-blue-700 active:to-blue-800 cursor-pointer">
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

            {/* Basic Information */}
            <div className="bg-blue-50/30 rounded-xl p-3 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                মৌলিক তথ্য
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      বাংলা নাম *
                    </label>
                    <input
                      {...register("name.bengaliName", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      English Name *
                    </label>
                    <input
                      {...register("name.englishName", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      রোল নং *
                    </label>
                    <input
                      {...register("rollNo", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      বর্তমান ক্লাস *
                    </label>
                    <select
                      {...register("currentClass", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
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
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      ভর্তি ক্লাস *
                    </label>
                    <select
                      {...register("admissionClass", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
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
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      ভার্সন *
                    </label>
                    <select
                      {...register("version", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="bangla">বাংলা</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      হোয়াটসঅ্যাপ নম্বর *
                    </label>
                    <input
                      {...register("WhatsappNumber", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      ব্লাড গ্রুপ *
                    </label>
                    <select
                      {...register("bloodGroup", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
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

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    জন্ম সনদ নং *
                  </label>
                  <input
                    {...register("birthCertificateNo", { required: true })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    পূর্ববর্তী স্কুল
                  </label>
                  <input
                    {...register("previousSchool")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="পূর্ববর্তী স্কুলের নাম"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      ধর্ম *
                    </label>
                    <select
                      {...register("religion", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="Islam">ইসলাম</option>
                      <option value="Hinduism">হিন্দু</option>
                      <option value="Christianity">খ্রিস্টান</option>
                      <option value="Buddhism">বৌদ্ধ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      পরিবহন *
                    </label>
                    <select
                      {...register("transportation", { required: true })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                      <option value="no">না</option>
                      <option value="yes">হ্যাঁ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <input
                      type="checkbox"
                      {...register("isCadet")}
                      className="mr-2"
                    />
                    ক্যাডেট
                  </label>
                </div>
              </div>
            </div>

            {/* Fee Information */}
            <div className="bg-amber-50/30 rounded-xl p-3 border border-amber-100">
              <h3 className="text-sm font-semibold text-amber-900 mb-3">
                ফি সংক্রান্ত তথ্য
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    ভর্তি ফি *
                  </label>
                  <input
                    type="number"
                    {...register("admissionFee", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    সেশন ফি *
                  </label>
                  <input
                    type="number"
                    {...register("sessionFee", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  ওয়েভার/ছাড় (টাকা)
                </label>
                <input
                  type="number"
                  {...register("waiver", { valueAsNumber: true })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Father's Information */}
            <div className="bg-blue-50/30 rounded-xl p-3 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                পিতার তথ্য
              </h3>
              <div className="space-y-2">
                <input
                  {...register("guardian.father.name.bengaliName")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="বাবার বাংলা নাম"
                />
                <input
                  {...register("guardian.father.name.englishName")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Father's English Name"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    {...register("guardian.father.mobile")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="মোবাইল নং"
                  />
                  <input
                    {...register("guardian.father.occupation")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="পেশা"
                  />
                </div>
                <input
                  {...register("guardian.father.nid")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="এনআইডি নম্বর"
                />
                <div>
                  <p className="text-xs font-medium text-blue-800 mb-1">
                    বর্তমান ঠিকানা
                  </p>
                  <input
                    {...register("guardian.father.presentAddress.address")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2"
                    placeholder="ঠিকানা"
                  />
                  <input
                    {...register("guardian.father.presentAddress.district")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="জেলা"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-800 mb-1">
                    স্থায়ী ঠিকানা
                  </p>
                  <input
                    {...register("guardian.father.permanentAddress.address")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2"
                    placeholder="ঠিকানা"
                  />
                  <input
                    {...register("guardian.father.permanentAddress.district")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="জেলা"
                  />
                </div>
              </div>
            </div>

            {/* Mother's Information */}
            <div className="bg-pink-50/30 rounded-xl p-3 border border-pink-100">
              <h3 className="text-sm font-semibold text-pink-900 mb-3">
                মাতার তথ্য
              </h3>
              <div className="space-y-2">
                <input
                  {...register("guardian.mother.name.bengaliName")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="মায়ের বাংলা নাম"
                />
                <input
                  {...register("guardian.mother.name.englishName")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="Mother's English Name"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    {...register("guardian.mother.mobile")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="মোবাইল নং"
                  />
                  <input
                    {...register("guardian.mother.occupation")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="পেশা"
                  />
                </div>
                <input
                  {...register("guardian.mother.nid")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="এনআইডি নম্বর"
                />
                <div>
                  <p className="text-xs font-medium text-pink-800 mb-1">
                    বর্তমান ঠিকানা
                  </p>
                  <input
                    {...register("guardian.mother.presentAddress.address")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2"
                    placeholder="ঠিকানা"
                  />
                  <input
                    {...register("guardian.mother.presentAddress.district")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="জেলা"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-pink-800 mb-1">
                    স্থায়ী ঠিকানা
                  </p>
                  <input
                    {...register("guardian.mother.permanentAddress.address")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2"
                    placeholder="ঠিকানা"
                  />
                  <input
                    {...register("guardian.mother.permanentAddress.district")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                    placeholder="জেলা"
                  />
                </div>
              </div>
            </div>

            {/* Local Guardian Section */}
            <div className="bg-green-50/30 rounded-xl p-3 border border-green-100">
              <h3 className="text-sm font-semibold text-green-900 mb-3">
                স্থানীয় অভিভাবক
              </h3>
              <div className="space-y-2">
                <input
                  {...register("guardian.localGuardian.name")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="নাম"
                />
                <input
                  {...register("guardian.localGuardian.email")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="ইমেইল"
                />
                <input
                  {...register("guardian.localGuardian.relation")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="সম্পর্ক"
                />
                <input
                  {...register("guardian.localGuardian.phone")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  placeholder="মোবাইল নং"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isUpdating || imageUploading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {isUpdating || imageUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                    {imageUploading ? "ছবি আপলোড হচ্ছে..." : "আপডেট হচ্ছে..."}
                  </>
                ) : (
                  "আপডেট করুন"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main AllStudents Component (same as before, but with updated modal)
const AllStudents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<
    "bangla" | "english" | ""
  >("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<TStudent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateStudent] = useUpdateStudentMutation();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const query = {
    search: debouncedSearch,
    class: selectedClass,
    version: selectedVersion,
    page: currentPage,
    limit: 10,
  };

  const { data, isLoading, refetch } = useGetAllStudentsQuery(query);
  const [deleteStudent, { isLoading: deleting }] = useDeleteStudentMutation();

  const allStudents: TStudent[] = data?.data?.data?.data || [];
  const meta = data?.data?.data?.meta;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudent(id);
      refetch();
    }
  };

  const handleUpdate = async (id: string, updateData: Partial<TStudent>) => {
    try {
      const result = await updateStudent({ id, data: updateData }).unwrap();
      if (result.success) {
        refetch();
      }
      return result;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  const handleEditClick = (student: TStudent) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedVersion("");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleExpand = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "partial":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  if (isLoading || deleting) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex flex-col gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">ছাত্রছাত্রী</h1>
                <p className="text-xs text-gray-600 mt-0.5">
                  সব ছাত্রছাত্রীর তথ্য
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 border rounded-xl relative ${
                    showFilters
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  <FiFilter size={18} />
                  {(selectedClass || selectedVersion) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {(selectedClass ? 1 : 0) + (selectedVersion ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">ফিল্টার</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    সব রিসেট
                  </button>
                </div>

                {/* Class Filter */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    ক্লাস
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">সব ক্লাস</option>
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

                {/* Version Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    ভার্সন
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVersion === "bangla"}
                        onChange={() =>
                          setSelectedVersion(
                            selectedVersion === "bangla" ? "" : "bangla",
                          )
                        }
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm">বাংলা</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVersion === "english"}
                        onChange={() =>
                          setSelectedVersion(
                            selectedVersion === "english" ? "" : "english",
                          )
                        }
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm">English</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-600">
            <span>মোট {meta?.totalStudents || 0} জন</span>
            <span>
              পৃষ্ঠা {currentPage}/{meta?.totalPages || 1}
            </span>
          </div>
        </div>

        {/* Student List */}
        <div className="p-4 space-y-3">
          {allStudents.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUser className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-600 font-medium">
                কোনো ছাত্র পাওয়া যায়নি
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {searchTerm || selectedClass || selectedVersion
                  ? "অন্য ফিল্টার দিয়ে চেষ্টা করুন"
                  : "নতুন ছাত্র যোগ করুন"}
              </p>
            </div>
          ) : (
            allStudents.map((student) => {
              const isExpanded = expandedStudent === student._id;
              const paidMonths =
                student.paymentInfo.payments?.filter((p) => p.status === "paid")
                  .length || 0;

              return (
                <div
                  key={student._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Student Card Header */}
                  <div
                    onClick={() => toggleExpand(student._id!)}
                    className="p-4 cursor-pointer active:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {student.image?.url ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200">
                            <Image
                              width={56}
                              height={56}
                              src={student.image.url}
                              alt={student.name.englishName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="font-bold text-white text-lg">
                              {student.name.englishName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Basic Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {student.name.englishName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              ID: {student.id}
                            </p>
                          </div>
                          <button className="p-1">
                            {isExpanded ? (
                              <FiChevronUp
                                size={20}
                                className="text-gray-400"
                              />
                            ) : (
                              <FiChevronDown
                                size={20}
                                className="text-gray-400"
                              />
                            )}
                          </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            ক্লাস {student.currentClass}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                            {student.version === "bangla" ? "বাংলা" : "English"}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                            রোল {student.rollNo}
                          </span>
                        </div>

                        {/* Payment Status Summary */}
                        <div className="flex items-center gap-2 mt-3">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(
                              student.paymentInfo.status,
                            )}`}
                          >
                            {student.paymentInfo.status === "paid"
                              ? "পরিশোধিত"
                              : student.paymentInfo.status === "partial"
                                ? "আংশিক"
                                : "বকেয়া"}
                          </span>
                          <span className="text-xs font-bold text-green-700">
                            ৳ {student.paymentInfo.paidAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <FiPhone size={12} className="text-blue-500" />
                            <span>ফোন</span>
                          </div>
                          <p className="text-sm font-medium truncate">
                            {student.WhatsappNumber}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <FaWhatsapp size={12} className="text-green-500" />
                            <span>WhatsApp</span>
                          </div>
                          <p className="text-sm font-medium truncate">
                            {student.WhatsappNumber}
                          </p>
                        </div>
                      </div>

                      {/* Academic Details */}
                      <div className="bg-white p-3 rounded-lg border mb-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <FiBookOpen size={12} />
                          <span>একাডেমিক তথ্য</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">ভর্তির তারিখ</p>
                            <p className="font-medium">
                              {formatDate(student.admissionDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">ভর্তি ক্লাস</p>
                            <p className="font-medium">
                              {student.admissionClass}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">বর্তমান ক্লাস</p>
                            <p className="font-medium">
                              {student.currentClass}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">রোল নং</p>
                            <p className="font-medium">{student.rollNo}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="bg-white p-3 rounded-lg border mb-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <MdOutlinePayments size={12} />
                          <span>পেমেন্ট তথ্য</span>
                        </h4>

                        {/* Payment Summary */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center p-2 bg-green-50 rounded-lg">
                            <p className="text-[10px] text-gray-600">
                              পরিশোধিত
                            </p>
                            <p className="text-sm font-bold text-green-700">
                              ৳ {student.paymentInfo.paidAmount}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <p className="text-[10px] text-gray-600">বাকি</p>
                            <p className="text-sm font-bold text-blue-700">
                              ৳ {student.paymentInfo.dueAmount}
                            </p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded-lg">
                            <p className="text-[10px] text-gray-600">পেমেন্ট</p>
                            <p className="text-sm font-bold text-purple-700">
                              {student.paymentInfo.totalPayments}x
                            </p>
                          </div>
                        </div>

                        {/* Paid Months */}
                        {paidMonths > 0 && (
                          <div>
                            <p className="text-[10px] text-gray-500 mb-1">
                              পরিশোধিত মাস ({paidMonths}):
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {student.paymentInfo.payments
                                ?.filter((p) => p.status === "paid")
                                .slice(0, 4)
                                .map((payment, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] px-2 py-0.5 bg-green-100 text-green-800 rounded-full"
                                    title={`${payment.paidAmount} Tk - ${new Date(
                                      payment.date,
                                    ).toLocaleDateString("bn-BD")}`}
                                  >
                                    {payment.month}
                                  </span>
                                ))}
                              {paidMonths > 4 && (
                                <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                                  +{paidMonths - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 active:bg-blue-600">
                          <FiEye size={14} />
                          <span>বিস্তারিত</span>
                        </button>
                        <button
                          onClick={() => handleEditClick(student)}
                          className="flex-1 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 active:bg-green-600"
                        >
                          <FiEdit size={14} />
                          <span>এডিট</span>
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 active:bg-red-600"
                        >
                          <FiTrash2 size={14} />
                          <span>ডিলিট</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Pagination */}
          {meta?.totalPages && meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-1 bg-white rounded-lg border p-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  আগে
                </button>
                <span className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.totalPages}
                  className="px-3 py-1.5 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  পরে
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default AllStudents;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
