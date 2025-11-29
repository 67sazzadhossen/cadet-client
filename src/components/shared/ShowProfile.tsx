import { TCurrentUser } from "@/types/index.type";
import Image from "next/image";
import React from "react";
import {
  MdEmail,
  MdPhone,
  MdWhatsapp,
  MdLocationOn,
  MdCake,
  MdBloodtype,
  MdEdit,
  MdCalendarToday,
  MdWork,
  MdOutlineSecurity,
  MdSchool,
  MdSubject,
} from "react-icons/md";
import { FaTransgender } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import Link from "next/link";

const ShowProfile = ({
  data,
  loading,
}: {
  data: TCurrentUser;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-4 tracking-wide">
            PROFILE NOT FOUND
          </h2>
          <p className="text-gray-600 font-light">
            Unable to load user profile information.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Check if it's a teacher (has subjects and joiningDate)
  const isTeacher = "subjects" in data && "joiningDate" in data;

  return (
    <div className="min-h-screen  px-1 font-sans">
      <div className="mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-300 h-24 relative">
            <div className="absolute -bottom-20 left-12">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200">
                  <Image
                    src={data.image.url}
                    alt={data.name.englishName}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>

            <Link href={"/dashboard/edit-profile"}>
              <div className="absolute bottom-2 right-2">
                <button className="btn btn-sm">
                  <MdEdit size={18} />
                  <span className="hidden md:inline"> EDIT PROFILE</span>
                </button>
              </div>
            </Link>
          </div>

          {/* Profile Info Section */}
          <div className="pt-24 px-4 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
                    {data.name.englishName}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6 font-light tracking-wide">
                    {data.name.bengaliName}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium tracking-wide border border-gray-300">
                      <span className="flex items-center gap-2">
                        <MdWork className="text-gray-600" />
                        {data.designation}
                      </span>
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium tracking-wide border border-gray-300">
                      EMPLOYEE ID: {data.id}
                    </span>
                    {isTeacher && (
                      <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium tracking-wide border border-gray-300">
                        <span className="flex items-center gap-2">
                          <MdSchool className="text-gray-600" />
                          Teacher
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 tracking-wide border-b border-gray-300 pb-2">
                      CONTACT INFORMATION
                    </h3>

                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200">
                      <div className="bg-gray-100 p-3 rounded-full border border-gray-300">
                        <MdEmail className="text-gray-700 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 tracking-wide uppercase">
                          Email
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.contact.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200">
                      <div className="bg-gray-100 p-3 rounded-full border border-gray-300">
                        <MdPhone className="text-gray-700 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 tracking-wide uppercase">
                          Mobile
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.contact.mobile}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200">
                      <div className="bg-gray-100 p-3 rounded-full border border-gray-300">
                        <MdWhatsapp className="text-gray-700 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 tracking-wide uppercase">
                          WhatsApp
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.contact.whatsapp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 tracking-wide border-b border-gray-300 pb-2">
                      ADDRESS & QUALIFICATION
                    </h3>

                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200">
                      <div className="bg-gray-100 p-3 rounded-full border border-gray-300">
                        <MdLocationOn className="text-gray-700 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 tracking-wide uppercase">
                          Address
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.address.address}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          District: {data.address.district}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200">
                      <div className="bg-gray-100 p-3 rounded-full border border-gray-300">
                        <MdSchool className="text-gray-700 text-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 tracking-wide uppercase">
                          Qualification
                        </p>
                        <p className="font-medium text-gray-900">
                          {data.qualification}
                        </p>
                      </div>
                    </div>

                    {/* Teacher Specific Information */}
                    {isTeacher && (
                      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200">
                        <div className="bg-gray-100 p-3 rounded-full border border-gray-300">
                          <MdSubject className="text-gray-700 text-xl" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 tracking-wide uppercase">
                            Subjects
                          </p>
                          <p className="font-medium text-gray-900">
                            {Array.isArray(data.subjects)
                              ? data.subjects.join(", ")
                              : data.subjects}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Personal Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 tracking-wide mb-6 border-b border-gray-300 pb-3">
                    PERSONAL DETAILS
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdCake className="text-gray-600" />
                        <span className="text-sm text-gray-600 tracking-wide">
                          Date of Birth
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatDate(data.dateOfBirth)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {calculateAge(data.dateOfBirth)} years
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <FaTransgender className="text-gray-600" />
                        <span className="text-sm text-gray-600 tracking-wide">
                          Gender
                        </span>
                      </div>
                      <span className="font-medium text-gray-900 capitalize">
                        {data.gender}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <MdBloodtype className="text-gray-600" />
                        <span className="text-sm text-gray-600 tracking-wide">
                          Blood Group
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {data.bloodGroup}
                      </span>
                    </div>

                    {/* Teacher Joining Date */}
                    {isTeacher && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <MdCalendarToday className="text-gray-600" />
                          <span className="text-sm text-gray-600 tracking-wide">
                            Joining Date
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {formatDate(data.joiningDate || "")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 tracking-wide mb-6 border-b border-gray-300 pb-3">
                    ACCOUNT INFORMATION
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600 tracking-wide">
                        Member Since
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {formatDate(data.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600 tracking-wide">
                        Last Updated
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {formatDate(data.updatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600 tracking-wide">
                        Password Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide border ${
                          data.user.needsPasswordChanged
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-green-100 text-green-800 border-green-200"
                        }`}
                      >
                        {data.user.needsPasswordChanged
                          ? "NEEDS UPDATE"
                          : "SECURE"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600 tracking-wide">
                        Role
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium tracking-wide border border-blue-200 capitalize">
                        {data.user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide text-center">
            QUICK ACTIONS
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={"/dashboard/edit-profile"}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 p-6 rounded-2xl transition-all duration-300 group hover:shadow-md"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-full border border-gray-300 group-hover:border-gray-400 transition-colors">
                  <MdEdit size={24} className="text-gray-700" />
                </div>
                <div className="font-medium tracking-wide text-sm">
                  EDIT PROFILE
                </div>
              </div>
            </Link>

            <Link
              href={"/dashboard/change-password"}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 p-6 rounded-2xl transition-all duration-300 group hover:shadow-md"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-full border border-gray-300 group-hover:border-gray-400 transition-colors">
                  <MdOutlineSecurity size={24} className="text-gray-700" />
                </div>
                <div className="font-medium tracking-wide text-sm">
                  CHANGE PASSWORD
                </div>
              </div>
            </Link>

            <button className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 p-6 rounded-2xl transition-all duration-300 group hover:shadow-md">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-full border border-gray-300 group-hover:border-gray-400 transition-colors">
                  <HiOutlineDocumentText size={24} className="text-gray-700" />
                </div>
                <div className="font-medium tracking-wide text-sm">
                  DOCUMENTS
                </div>
              </div>
            </button>

            <button className="bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 p-6 rounded-2xl transition-all duration-300 group hover:shadow-md">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-full border border-gray-300 group-hover:border-gray-400 transition-colors">
                  <MdCalendarToday size={24} className="text-gray-700" />
                </div>
                <div className="font-medium tracking-wide text-sm">
                  ACTIVITY
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProfile;
