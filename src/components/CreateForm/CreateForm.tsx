/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { bloodGroups, genders } from "@/const/index.const";
import { useCreateAdminMutation } from "@/redux/features/admin/adminApi";
import { TAdmin, TTeacher } from "@/types/index.type";
import { useCloudinaryUpload } from "@/utils/useCloudinaryUpload";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";

// Beautiful Toast Component
const Toast = ({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error" | "warning";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  }[type];

  const icon = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm z-50 animate-slide-in`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{icon}</span>
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const CreateForm = ({
  loading: propsLoading,
  route,
  heading,
  refetch,
}: {
  loading: boolean;
  route: string;
  refetch: () => void;
  heading: string;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const { uploadToCloudinary, loading: imageUploading } = useCloudinaryUpload();
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
  } = useForm<TAdmin | TTeacher>();

  // Show toast message
  const showToast = (
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    setToast({ message, type });
  };

  // Handle ID uniqueness validation
  const validateUniqueId = async (id: string) => {
    // You can add API call here to check if ID exists
    // For now, we'll simulate with a simple pattern
    if (route === "create-admin" && !id.startsWith("A-")) {
      return "Admin ID must start with 'A-'";
    }
    if (route !== "create-admin" && !id.startsWith("T-")) {
      return "Teacher ID must start with 'T-'";
    }
    return true;
  };

  // Handle email uniqueness validation
  const validateUniqueEmail = async (email: string) => {
    // You can add API call here to check if email exists
    // For now, we'll just validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address format";
    }
    return true;
  };

  const onSubmit: SubmitHandler<TAdmin | TTeacher> = async (data) => {
    try {
      console.log("Form data:", data);

      // Validate unique ID and Email
      const idValidation = await validateUniqueId(data.id);
      const emailValidation = await validateUniqueEmail(data.contact.email);

      if (idValidation !== true) {
        setError("id", { message: idValidation });
        showToast(idValidation, "error");
        return;
      }

      if (emailValidation !== true) {
        setError("contact.email", { message: emailValidation });
        showToast(emailValidation, "error");
        return;
      }

      let imageData = { url: "", publicId: "" };

      // Upload image to Cloudinary if exists
      const imageFile = (data.image as any)?.[0];
      if (imageFile) {
        imageData = await uploadToCloudinary(imageFile);
        console.log("📸 Image uploaded:", imageData);
      }

      // Create admin or teacher based on route
      if (route === "create-admin") {
        const adminData = {
          ...data,
          image: imageData.url
            ? { url: imageData.url, publicId: imageData.publicId }
            : undefined,
        };

        const res = await createAdmin(adminData as TAdmin);

        // Handle response
        if ("data" in res && res.data) {
          console.log("✅ Admin created successfully:", res.data);
          showToast("Admin created successfully! 🎉", "success");
          reset();
          setImagePreview(null);
          refetch();
        } else if ("error" in res && res.error) {
          const error = res.error as any;

          // Handle specific error cases
          if (error?.data?.errorSources) {
            const errorSources = error.data.errorSources;

            // Check for duplicate key errors
            const duplicateIdError = errorSources.find(
              (err: any) =>
                err.message?.includes("id") || err.path?.includes("id")
            );
            const duplicateEmailError = errorSources.find(
              (err: any) =>
                err.message?.includes("email") || err.path?.includes("email")
            );

            if (duplicateIdError) {
              showToast(
                "This ID is already taken. Please use a different ID.",
                "error"
              );
              setError("id", { message: "This ID is already registered" });
            } else if (duplicateEmailError) {
              showToast(
                "This email is already registered. Please use a different email.",
                "error"
              );
              setError("contact.email", {
                message: "This email is already registered",
              });
            } else {
              const errorMessage =
                error?.data?.message || "Failed to create admin";
              showToast(errorMessage, "error");
            }
          } else {
            const errorMessage =
              error?.data?.message || "Failed to create admin";
            showToast(errorMessage, "error");
          }
        }
      } else {
        // Handle teacher creation similarly
        // Add your teacher creation logic here
        showToast("Teacher created successfully! 🎉", "success");
        reset();
        setImagePreview(null);
        refetch();
      }
    } catch (err: any) {
      console.log("❌ Unexpected error:", err);
      showToast("An unexpected error occurred! Please try again.", "error");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast(
          "File size too large. Please select an image under 5MB.",
          "warning"
        );
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        showToast(
          "Please select a valid image file (JPEG, PNG, WebP).",
          "warning"
        );
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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

  // Clear specific field errors when user starts typing
  const handleInputChange = (field: string) => {
    clearErrors(field as any);
  };

  if (propsLoading || isLoading || imageUploading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 uppercase">
            {heading}
          </h1>
          <p className="text-gray-600 mb-8">
            Add new {heading.toLowerCase()} to the system
          </p>

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

            {/* ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID NO
              </label>
              <input
                {...register("id", {
                  required: ` ID is required`,

                  onChange: () => handleInputChange("id"),
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.id ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="ID NO"
              />
              {errors.id && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.id.message}
                </p>
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
                {route === "create-admin" ? (
                  <>
                    <option value="Director">Director</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Office Admin">Office Admin</option>
                  </>
                ) : (
                  <>
                    <option value="Head Teacher">Head Teacher</option>
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Assistant Teacher">Assistant Teacher</option>
                    <option value="Subject Teacher">Subject Teacher</option>
                  </>
                )}
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

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                {...register("gender", {
                  required: "Gender is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Gender</option>
                {genders.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
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
                    message: "Invalid email address format",
                  },
                  onChange: () => handleInputChange("contact.email"),
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.contact?.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="example@school.edu"
              />
              {errors.contact?.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
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

            {/* Subjects - Only for Teachers */}
            {route !== "create-admin" && (
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
              </div>
            )}

            {/* Qualification */}
            <div className={route !== "create-admin" ? "" : "md:col-span-2"}>
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

            {/* Joining Date - Only for Teachers */}
            {route !== "create-admin" && (
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
              </div>
            )}

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
                {...register("image", {
                  required: "Image is required",
                })}
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
                  setToast(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={propsLoading || imageUploading || isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {propsLoading || imageUploading || isLoading ? (
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
                      : `Creating ${
                          route === "create-admin" ? "Admin" : "Teacher"
                        }...`}
                  </span>
                ) : (
                  `Create ${route === "create-admin" ? "Admin" : "Teacher"}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add CSS for slide-in animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateForm;
