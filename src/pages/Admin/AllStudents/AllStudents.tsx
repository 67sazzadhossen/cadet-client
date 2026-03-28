"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import {
  useDeleteStudentMutation,
  useGetAllStudentsQuery,
  useUpdateStudentMutation,
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
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlinePayments, MdCreditCard } from "react-icons/md";
import EditStudentModal from "@/components/EditStudentModal/EditStudentModal";
import StudentIdCardModal from "@/components/IdCard/IdCard";

// Main AllStudents Component
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
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] =
    useState<TStudent | null>(null);

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

  const handleViewIdCard = (student: TStudent) => {
    setSelectedStudentForIdCard(student);
    setIsIdCardModalOpen(true);
  };

  const handleCloseIdCardModal = () => {
    setIsIdCardModalOpen(false);
    setSelectedStudentForIdCard(null);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
        {/* Header - Enhanced Design */}
        <div className="bg-white shadow-md border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    ছাত্রছাত্রী
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    সকল ছাত্রছাত্রীর তথ্য ব্যবস্থাপনা
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiUser className="text-white text-lg" />
                </div>
              </div>

              {/* Search Bar - Enhanced */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="নাম, আইডি বা ফোন নম্বর দিয়ে খুঁজুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 border rounded-xl relative transition-all ${
                    showFilters
                      ? "bg-blue-500 text-white border-blue-500 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <FiFilter size={18} />
                  {(selectedClass || selectedVersion) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                      {(selectedClass ? 1 : 0) + (selectedVersion ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Panel - Enhanced */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">ফিল্টার অপশন</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    সব রিসেট
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Class Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      ক্লাস নির্বাচন করুন
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">English</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar - Enhanced */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                মোট {meta?.totalStudents || 0} জন
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">
                পৃষ্ঠা {currentPage}/{meta?.totalPages || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="p-4 space-y-4">
          {allStudents.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                কোনো ছাত্র পাওয়া যায়নি
              </p>
              <p className="text-sm text-gray-500 mt-2">
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
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Student Card Header */}
                  <div
                    onClick={() => toggleExpand(student._id!)}
                    className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {student.image?.url ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-100 shadow-sm">
                            <Image
                              width={64}
                              height={64}
                              src={student.image.url}
                              alt={student.name.englishName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <span className="font-bold text-white text-xl">
                              {student.name.englishName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Basic Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {student.name.englishName}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              ID: {student.id}
                            </p>
                          </div>
                          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
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

                        {/* Tags - Enhanced */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[11px] px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                            ক্লাস {student.currentClass}
                          </span>
                          <span className="text-[11px] px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                            {student.version === "bangla" ? "বাংলা" : "English"}
                          </span>
                          <span className="text-[11px] px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            রোল {student.rollNo}
                          </span>
                        </div>

                        {/* Payment Status Summary */}
                        <div className="flex items-center gap-3 mt-3">
                          <span
                            className={`text-[11px] px-3 py-1 rounded-full font-medium border ${getStatusColor(
                              student.paymentInfo.status,
                            )}`}
                          >
                            {student.paymentInfo.status === "paid"
                              ? "পরিশোধিত"
                              : student.paymentInfo.status === "partial"
                                ? "আংশিক"
                                : "বকেয়া"}
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            ৳ {student.paymentInfo.paidAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <FiPhone size={12} className="text-blue-500" />
                            <span className="font-medium">ফোন</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {student.WhatsappNumber}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                            <FaWhatsapp size={12} className="text-green-500" />
                            <span className="font-medium">WhatsApp</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {student.WhatsappNumber}
                          </p>
                        </div>
                      </div>

                      {/* Academic Details */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiBookOpen size={14} className="text-blue-500" />
                          <span>একাডেমিক তথ্য</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">
                              ভর্তির তারিখ
                            </p>
                            <p className="font-semibold text-gray-800">
                              {formatDate(student.admissionDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ভর্তি ক্লাস</p>
                            <p className="font-semibold text-gray-800">
                              {student.admissionClass}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              বর্তমান ক্লাস
                            </p>
                            <p className="font-semibold text-gray-800">
                              {student.currentClass}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">রোল নং</p>
                            <p className="font-semibold text-gray-800">
                              {student.rollNo}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <MdOutlinePayments
                            size={14}
                            className="text-green-500"
                          />
                          <span>পেমেন্ট তথ্য</span>
                        </h4>

                        {/* Payment Summary */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
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
                            <p className="text-[10px] text-gray-500 mb-2">
                              পরিশোধিত মাস ({paidMonths}):
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {student.paymentInfo.payments
                                ?.filter((p) => p.status === "paid")
                                .slice(0, 5)
                                .map((payment, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium"
                                    title={`${payment.paidAmount} Tk - ${new Date(
                                      payment.date,
                                    ).toLocaleDateString("bn-BD")}`}
                                  >
                                    {payment.month}
                                  </span>
                                ))}
                              {paidMonths > 5 && (
                                <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                                  +{paidMonths - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Enhanced */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleViewIdCard(student)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-md transition-all"
                        >
                          <MdCreditCard size={16} />
                          <span>আইডি কার্ড</span>
                        </button>
                        <button
                          onClick={() => handleEditClick(student)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-md transition-all"
                        >
                          <FiEdit size={14} />
                          <span>এডিট</span>
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-md transition-all"
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
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                >
                  আগে
                </button>
                <span className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg font-semibold">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.totalPages}
                  className="px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
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
