"use client";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import {
  useCreateTeacherMutation,
  useGetTeachersQuery,
} from "@/redux/features/teachers/teacherApi";
import { TBloodGroup, TTeacherForm } from "@/types/index.type";
import { useCloudinaryUpload } from "@/utils/useCloudinaryUpload";

const CreateTeacher = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { refetch } = useGetTeachersQuery(undefined);
  const [createTeacher, { isLoading }] = useCreateTeacherMutation();
  const { uploadToCloudinary, loading: imageUploading } = useCloudinaryUpload();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TTeacherForm>({
    defaultValues: {
      id: "T-100221",
      name: {
        bengaliName: "মোঃ সাইফুল ইসলাম",
        englishName: "Md Saiful Islam",
      },
      contact: {
        email: "saiful.islam@school.edu",
        mobile: "01712345678",
        whatsapp: "01712345678",
      },
      dateOfBirth: "1985-06-15",
      designation: "Senior Teacher",
      subjects: ["Mathematics", "Physics"],
      qualification: "M.Sc in Mathematics, B.Ed",
      bloodGroup: "O+",
      joiningDate: "2018-03-01",
      address: {
        address: "House #45, Road #8, Block-C",
        district: "Gazipur",
      },
    },
  });

  const bloodGroups: TBloodGroup[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: TTeacherForm) => {
    try {
      let imageData = { url: "", publicId: "" };

      // Upload image to Cloudinary if exists
      const imageFile = (data.image as any)?.[0];
      if (imageFile) {
        imageData = await uploadToCloudinary(imageFile);
        console.log("📸 Image uploaded:", imageData);
      }

      // Prepare teacher data WITHOUT the image file object
      const teacherData = {
        id: data.id,
        name: data.name,
        contact: data.contact,
        dateOfBirth: data.dateOfBirth,
        designation: data.designation,
        subjects: data.subjects,
        qualification: data.qualification,
        bloodGroup: data.bloodGroup,
        joiningDate: data.joiningDate,
        address: data.address,
        // Only include image URL and publicId, not the file object
        image: imageData.url
          ? {
              url: imageData.url,
              publicId: imageData.publicId,
            }
          : undefined,
      };

      console.log("📤 Sending teacher data:", teacherData);

      // Send data to your API
      const res = await createTeacher(teacherData);

      // Handle response
      if ("data" in res && res.data) {
        console.log("✅ Teacher created successfully:", res.data);
        refetch();
        alert("Teacher created successfully!");
        reset();
        setImagePreview(null);
      } else if ("error" in res && res.error) {
        const error = res.error as any;
        const errorMessage = error?.data?.message || "Failed to create teacher";
        alert(`Teacher creation failed: ${errorMessage}`);
      }
    } catch (err: any) {
      console.log("❌ Unexpected error:", err);
      alert("An unexpected error occurred!");
    }
  };

  // Handle subjects input (convert string to array)
  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjectsArray = e.target.value
      .split(",")
      .map((sub) => sub.trim())
      .filter((sub) => sub);

    setValue("subjects", subjectsArray);
  };

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create New Teacher
        </h1>
        <p className="text-gray-600 mb-8">Add a new teacher to the system</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* ========== BASIC INFORMATION ========== */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Basic Information
            </h2>
          </div>

          {/* Teacher ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teacher ID *
            </label>
            <input
              {...register("id", {
                required: "Teacher ID is required",
                pattern: {
                  value: /^T-\d+$/,
                  message:
                    "Teacher ID must start with 'T-' followed by numbers",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="T-1001"
            />
            {errors.id && (
              <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation *
            </label>
            <select
              {...register("designation", {
                required: "Designation is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Designation</option>
              <option value="Head Teacher">Head Teacher</option>
              <option value="Senior Teacher">Senior Teacher</option>
              <option value="Assistant Teacher">Assistant Teacher</option>
              <option value="Subject Teacher">Subject Teacher</option>
            </select>
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.designation.message}
              </p>
            )}
          </div>

          {/* ========== PERSONAL INFORMATION ========== */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Personal Information
            </h2>
          </div>

          {/* Name - Bengali */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bengali Name *
            </label>
            <input
              {...register("name.bengaliName", {
                required: "Bengali name is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="মোঃ সাইফুল ইসলাম"
            />
            {errors.name?.bengaliName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.bengaliName.message}
              </p>
            )}
          </div>

          {/* Name - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Name *
            </label>
            <input
              {...register("name.englishName", {
                required: "English name is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Md Saiful Islam"
            />
            {errors.name?.englishName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.englishName.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              {...register("dateOfBirth", {
                required: "Date of birth is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group *
            </label>
            <select
              {...register("bloodGroup", {
                required: "Blood group is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {errors.bloodGroup && (
              <p className="text-red-500 text-sm mt-1">
                {errors.bloodGroup.message}
              </p>
            )}
          </div>

          {/* ========== CONTACT INFORMATION ========== */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Contact Information
            </h2>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              {...register("contact.email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="teacher@school.edu"
            />
            {errors.contact?.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact.email.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <input
              {...register("contact.mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "Invalid Bangladeshi mobile number",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="01712345678"
            />
            {errors.contact?.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact.mobile.message}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              {...register("contact.whatsapp", {
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "Invalid Bangladeshi mobile number",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="01712345678"
            />
            {errors.contact?.whatsapp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact.whatsapp.message}
              </p>
            )}
          </div>

          {/* ========== PROFESSIONAL INFORMATION ========== */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Professional Information
            </h2>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects (comma separated) *
            </label>
            <input
              {...register("subjects", {
                required: "Subjects are required",
              })}
              onChange={handleSubjectsChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Mathematics, Physics"
            />
            {errors.subjects && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subjects.message}
              </p>
            )}
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualification *
            </label>
            <textarea
              {...register("qualification", {
                required: "Qualification is required",
              })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="M.Sc in Mathematics, B.Ed"
            />
            {errors.qualification && (
              <p className="text-red-500 text-sm mt-1">
                {errors.qualification.message}
              </p>
            )}
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Joining Date *
            </label>
            <input
              type="date"
              {...register("joiningDate", {
                required: "Joining date is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.joiningDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.joiningDate.message}
              </p>
            )}
          </div>

          {/* ========== ADDRESS INFORMATION ========== */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Address Information
            </h2>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              {...register("address.address", {
                required: "Address is required",
              })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="House #45, Road #8, Block-C"
            />
            {errors.address?.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.address.message}
              </p>
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District *
            </label>
            <input
              {...register("address.district", {
                required: "District is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Gazipur"
            />
            {errors.address?.district && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.district.message}
              </p>
            )}
          </div>

          {/* ========== PROFILE IMAGE ========== */}
          <div className="col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Profile Image
            </h2>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, WebP. Max size: 5MB
            </p>
          </div>

          {/* ========== SUBMIT BUTTON ========== */}
          <div className="col-span-2 mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setImagePreview(null);
              }}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isLoading || imageUploading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading || imageUploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {imageUploading
                    ? "Uploading Image..."
                    : "Creating Teacher..."}
                </span>
              ) : (
                "Create Teacher"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeacher;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
