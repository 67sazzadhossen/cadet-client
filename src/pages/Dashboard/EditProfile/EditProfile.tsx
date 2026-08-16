"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import {
  useGetMeQuery,
  useUpdateMeMutation,
} from "@/redux/features/user/userApi";
import { TCurrentUser, TUpdateProfile } from "@/types/index.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdCheckCircle, MdError, MdClose, MdInfo } from "react-icons/md";

const EditProfile = () => {
  const { data, isLoading, refetch } = useGetMeQuery(undefined);
  const userInfo: TCurrentUser = data?.data?.data;
  const [updateMe, { isLoading: updateLoading }] = useUpdateMeMutation();
  const router = useRouter();

  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info" | null;
    text: string;
  }>({ type: null, text: "" });

  const { register, handleSubmit, setValue } = useForm<TUpdateProfile>();

  useEffect(() => {
    if (userInfo) {
      setValue("name.englishName", userInfo.name.englishName);
      setValue("name.bengaliName", userInfo.name.bengaliName);
      setValue("contact.email", userInfo.contact.email);
      setValue("contact.mobile", userInfo.contact.mobile);
      setValue("contact.whatsapp", userInfo.contact.whatsapp);
      setValue("dateOfBirth", userInfo.dateOfBirth.split("T")[0]);
      setValue("qualification", userInfo.qualification);
      setValue("bloodGroup", userInfo.bloodGroup);
      setValue("gender", userInfo.gender);
      setValue("address.address", userInfo.address.address);
      setValue("address.district", userInfo.address.district);

      // Check if user is Teacher (has joiningDate) and set the value
      if ("joiningDate" in userInfo && userInfo.joiningDate) {
        setValue("joiningDate", userInfo.joiningDate.split("T")[0]);
      }

      if ("subjects" in userInfo && userInfo.subjects) {
        setSubjects(
          Array.isArray(userInfo.subjects)
            ? userInfo.subjects
            : [userInfo.subjects]
        );
      }
    }
  }, [userInfo, setValue]);

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setMessage({ type: null, text: "" });
    }, 5000);
  };

  const closeMessage = () => {
    setMessage({ type: null, text: "" });
  };

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject("");
      showMessage("success", "Subject added successfully!");
    } else if (subjects.includes(newSubject.trim())) {
      showMessage("error", "This subject already exists!");
    }
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
    showMessage("info", "Subject removed!");
  };

  const onSubmit = async (data: TUpdateProfile) => {
    // Add subjects to the data if user is a teacher
    const submitData = {
      ...data,
      ...("subjects" in userInfo && { subjects: subjects }),
    };

    try {
      const res = await updateMe(submitData).unwrap();

      if (res.success) {
        showMessage("success", "Profile updated successfully!");
        refetch();
        router.push("/dashboard/profile");
      } else {
        showMessage("error", res.message || "Failed to update profile!");
      }
    } catch (error: any) {
      showMessage(
        "error",
        error?.data?.message ||
          error?.error ||
          "An error occurred while updating profile!"
      );
    }
  };

  if (isLoading || updateLoading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="mx-auto ">
      {/* Message Notification */}
      {message.type && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-right duration-300 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : message.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          } border rounded-lg shadow-lg p-4`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 ${
                message.type === "success"
                  ? "text-green-500"
                  : message.type === "error"
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              {message.type === "success" && <MdCheckCircle size={24} />}
              {message.type === "error" && <MdError size={24} />}
              {message.type === "info" && <MdInfo size={24} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
            <button
              onClick={closeMessage}
              className={`flex-shrink-0 rounded-full p-1 hover:bg-opacity-20 transition-colors ${
                message.type === "success"
                  ? "hover:bg-green-600"
                  : message.type === "error"
                  ? "hover:bg-red-600"
                  : "hover:bg-blue-600"
              }`}
            >
              <MdClose size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2">
              Update your personal information
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userInfo.id}
                </p>
              </div>
              <div className="relative">
                <Image
                  className="rounded-full border-4 border-white shadow-md"
                  src={userInfo.image.url}
                  alt="Profile"
                  width={80}
                  height={80}
                />
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Section */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Name Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (English)
                </label>
                <input
                  type="text"
                  {...register("name.englishName")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  নাম (বাংলা)
                </label>
                <input
                  type="text"
                  {...register("name.bengaliName")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register("contact.email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile
                </label>
                <input
                  type="tel"
                  {...register("contact.mobile")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  {...register("contact.whatsapp")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Show Joining Date only for Teachers */}
              {"joiningDate" in userInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    {...register("joiningDate")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  {...register("qualification")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  {...register("bloodGroup")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="unknown">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="unknown">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subjects Section - Only for Teachers */}
          {"subjects" in userInfo && (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Subjects
              </h2>

              {/* Current Subjects */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Subjects
                </label>
                <div className="flex flex-wrap gap-3">
                  {subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
                    >
                      <span className="font-medium">{subject}</span>
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-100 p-1"
                        title="Remove subject"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  ))}
                  {subjects.length === 0 && (
                    <p className="text-gray-500 text-sm italic">
                      No subjects added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Add New Subject
                </label>
                <div className="flex gap-3 flex-col md:flex-row">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Enter subject name..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSubject();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSubject}
                    disabled={!newSubject.trim()}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Add Subject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Address Information */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  {...register("address.address")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  {...register("address.district")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={updateLoading}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-md hover:shadow-lg "
            >
              {updateLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
