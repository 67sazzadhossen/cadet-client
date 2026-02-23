/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useDeleteTeacherByIdMutation,
  useGetTeachersQuery,
} from "@/redux/features/teachers/teacherApi";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { TTeacher } from "@/types/index.type";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// Teacher type from your API response
interface TeacherResponse {
  data?: {
    data?: TTeacher[];
  };
}

const AllTeachers = () => {
  const {
    data: teachersResponse,
    isLoading,
    error,
    refetch,
  } = useGetTeachersQuery(undefined) as {
    data?: TeacherResponse;
    isLoading: boolean;
    error?: any;
    refetch: () => void;
  };

  const [deleteTeacher, { isLoading: deleteLoading }] =
    useDeleteTeacherByIdMutation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedDesignation, setSelectedDesignation] = useState<string>("");
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const teachers: TTeacher[] = teachersResponse?.data?.data || [];

  // Filter teachers based on search and filters
  const filteredTeachers: TTeacher[] = teachers.filter((teacher: TTeacher) => {
    const matchesSearch =
      searchTerm === "" ||
      teacher.name?.englishName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      teacher.name?.bengaliName?.includes(searchTerm) ||
      teacher.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation =
      selectedDesignation === "" || teacher.designation === selectedDesignation;

    const matchesSubject =
      selectedSubject === "" ||
      teacher.subjects?.some((subject: string) =>
        subject.toLowerCase().includes(selectedSubject.toLowerCase()),
      );

    return matchesSearch && matchesDesignation && matchesSubject;
  });

  // Get unique designations for filter
  const designations: string[] = [
    ...new Set(teachers.map((t: TTeacher) => t.designation).filter(Boolean)),
  ] as string[];

  // Get unique subjects for filter
  const allSubjects: string[] = [
    ...new Set(teachers.flatMap((t: TTeacher) => t.subjects || [])),
  ].filter(Boolean);

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher(id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete teacher:", error);
      }
    }
  };

  const toggleExpand = (teacherId: string): void => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
  };

  const handleResetFilters = (): void => {
    setSearchTerm("");
    setSelectedDesignation("");
    setSelectedSubject("");
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading || deleteLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Teachers
          </h3>
          <p className="text-sm text-red-600 mb-4">
            There was a problem loading the teachers. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">শিক্ষকগণ</h1>
                <p className="text-xs text-gray-600 mt-0.5">
                  মোট {filteredTeachers.length} জন শিক্ষক
                </p>
              </div>
              <Link
                href="/dashboard/create-teacher"
                className="bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm active:bg-blue-600"
              >
                <FiPlus size={16} />
                <span>নতুন</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="নাম, আইডি বা পদবি দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
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
                {(selectedDesignation || selectedSubject) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {(selectedDesignation ? 1 : 0) + (selectedSubject ? 1 : 0)}
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

              {/* Designation Filter */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  পদবি
                </label>
                <select
                  value={selectedDesignation}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedDesignation(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">সব পদবি</option>
                  {designations.map((des: string) => (
                    <option key={des} value={des}>
                      {des}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  বিষয়
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedSubject(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">সব বিষয়</option>
                  {allSubjects.map((subject: string) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-600">
          <span>মোট {filteredTeachers.length} জন শিক্ষক</span>
          <span>সক্রিয় {filteredTeachers.length} জন</span>
        </div>
      </div>

      {/* Teachers List */}
      <div className="p-4 space-y-3">
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUser className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-600 font-medium">
              কোনো শিক্ষক পাওয়া যায়নি
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {searchTerm || selectedDesignation || selectedSubject
                ? "অন্য ফিল্টার দিয়ে চেষ্টা করুন"
                : "নতুন শিক্ষক যোগ করুন"}
            </p>
            {!searchTerm && !selectedDesignation && !selectedSubject && (
              <Link
                href="/dashboard/create-teacher"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
              >
                <FiPlus size={14} />
                <span>শিক্ষক যোগ করুন</span>
              </Link>
            )}
          </div>
        ) : (
          filteredTeachers.map((teacher: TTeacher) => {
            const isExpanded = expandedTeacher === teacher._id?.toString();

            return (
              <div
                key={teacher._id?.toString()}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Teacher Card Header */}
                <div
                  onClick={() => toggleExpand(teacher._id!.toString())}
                  className="p-4 cursor-pointer active:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      {teacher.image?.url ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200">
                          <Image
                            width={56}
                            height={56}
                            src={teacher.image.url}
                            alt={teacher.name?.englishName || "Teacher"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <span className="font-bold text-white text-lg">
                            {teacher.name?.englishName?.charAt(0) || "T"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {teacher.name?.englishName || "N/A"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ID: {teacher.id}
                          </p>
                        </div>
                        <button className="p-1">
                          {isExpanded ? (
                            <FiChevronUp size={20} className="text-gray-400" />
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
                          {teacher.designation || "Teacher"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                          {teacher.subjects?.length || 0} বিষয়
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                          {teacher.bloodGroup || "N/A"}
                        </span>
                      </div>

                      {/* Quick Contact - Updated to use TContact type */}
                      <div className="flex items-center gap-3 mt-2">
                        {teacher.contact?.whatsapp && (
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <FaWhatsapp className="text-green-500" size={12} />
                            {teacher.contact.whatsapp}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
                    {/* Contact Info - Updated to use TContact type */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <FiPhone size={12} className="text-blue-500" />
                          <span>ফোন</span>
                        </div>
                        <p className="text-sm font-medium truncate">
                          {teacher.contact?.mobile || "N/A"}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <FiPhone size={12} className="text-green-500" />
                          <span>মোবাইল</span>
                        </div>
                        <p className="text-sm font-medium truncate">
                          {teacher.contact?.mobile || "N/A"}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <FiMail size={12} className="text-red-500" />
                          <span>ইমেইল</span>
                        </div>
                        <p className="text-sm font-medium truncate">
                          {teacher.contact?.email || "N/A"}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <FaWhatsapp size={12} className="text-green-600" />
                          <span>WhatsApp</span>
                        </div>
                        <p className="text-sm font-medium truncate">
                          {teacher.contact?.whatsapp || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-white p-3 rounded-lg border mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <FiUser size={12} />
                        <span>ব্যক্তিগত তথ্য</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">জন্ম তারিখ</p>
                          <p className="font-medium">
                            {formatDate(teacher.dateOfBirth)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">রক্তের গ্রুপ</p>
                          <p className="font-medium">{teacher.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">লিঙ্গ</p>
                          <p className="font-medium">{teacher.gender}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">যোগদানের তারিখ</p>
                          <p className="font-medium">
                            {formatDate(teacher.joiningDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Info */}
                    <div className="bg-white p-3 rounded-lg border mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <FiBriefcase size={12} />
                        <span>পেশাগত তথ্য</span>
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div>
                          <p className="text-gray-500">পদবি</p>
                          <p className="font-medium">{teacher.designation}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">শিক্ষাগত যোগ্যতা</p>
                          <p className="font-medium">{teacher.qualification}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">বিষয়সমূহ</p>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects?.map(
                              (subject: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full"
                                >
                                  {subject}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    {teacher.address && (
                      <div className="bg-white p-3 rounded-lg border mb-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">
                          ঠিকানা
                        </h4>
                        <p className="text-xs">{teacher.address.district}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/dashboard/teachers/${teacher._id}`}
                        className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 active:bg-blue-600"
                      >
                        <FiEye size={14} />
                        <span>বিস্তারিত</span>
                      </Link>
                      <Link
                        href={`/dashboard/edit-teacher/${teacher._id}`}
                        className="flex-1 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 active:bg-green-600"
                      >
                        <FiEdit size={14} />
                        <span>এডিট</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(teacher.id)}
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
      </div>
    </div>
  );
};

export default AllTeachers;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
