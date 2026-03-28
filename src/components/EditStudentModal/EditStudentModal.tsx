/* eslint-disable @typescript-eslint/no-explicit-any */
import { TStudent } from "@/types/index.type";
import { useCloudinaryUpload } from "@/utils/useCloudinaryUpload";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2, FiUpload, FiX } from "react-icons/fi";

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

  const { register, handleSubmit, reset } = useForm({
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

export default EditStudentModal;
