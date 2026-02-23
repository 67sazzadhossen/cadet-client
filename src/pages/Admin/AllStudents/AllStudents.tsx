"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import {
  useDeleteStudentMutation,
  useGetAllStudentsQuery,
} from "@/redux/features/student/studentApi";
import { TStudent } from "@/types/index.type";
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
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

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
                          <p className="font-medium">{student.currentClass}</p>
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
                          <p className="text-[10px] text-gray-600">পরিশোধিত</p>
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
                      <button className="flex-1 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 active:bg-green-600">
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
  );
};

export default AllStudents;
