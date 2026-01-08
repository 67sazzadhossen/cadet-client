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
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const AllStudents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<
    "bangla" | "english" | ""
  >("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedVersion("");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate showing range
  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, meta?.totalStudents || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Filters */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage all student records
              </p>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Input - Always visible */}
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
              >
                <FiFilter size={16} />
                Filters
                {(selectedClass || selectedVersion) && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(selectedClass ? 1 : 0) + (selectedVersion ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel (Collapsible) */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Classes</option>
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
                </div>

                {/* Version Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVersion === "bangla"}
                        onChange={() =>
                          setSelectedVersion(
                            selectedVersion === "bangla" ? "" : "bangla"
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">বাংলা</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVersion === "english"}
                        onChange={() =>
                          setSelectedVersion(
                            selectedVersion === "english" ? "" : "english"
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">English</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Filters Tags */}
              {(selectedClass || selectedVersion) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {selectedClass && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Class: {selectedClass}
                        <button
                          onClick={() => setSelectedClass("")}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    )}
                    {selectedVersion && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Version: {selectedVersion}
                        <button
                          onClick={() => setSelectedVersion("")}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Loading State */}
        {isLoading && (
          <div className="mb-4">
            <LoadingAnimation />
          </div>
        )}

        {/* Stats Summary */}
        {!isLoading && (
          <div className="mb-6 hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {startItem}-{endItem}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {meta?.totalStudents || 0}
                </span>{" "}
                students
                {searchTerm && (
                  <span className="ml-2">
                    • Searching: &quot;{searchTerm}&quot;
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{meta?.totalPages || 1}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm ">
          {/* Table Header */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">
                Total Students ({meta.totalStudents})
              </h3>
              {deleting && (
                <span className="text-sm text-amber-600 animate-pulse">
                  Deleting student...
                </span>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Academic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Admission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!isLoading && allStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiSearch className="text-gray-300 text-4xl mb-3" />
                        <div className="text-lg font-medium text-gray-700 mb-2">
                          No students found
                        </div>
                        <p className="text-gray-500 text-sm max-w-md">
                          {searchTerm || selectedClass || selectedVersion
                            ? "Try adjusting your search or filters"
                            : "No student records available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {student.image?.url ? (
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <Image
                                  width={40}
                                  height={40}
                                  src={student.image.url}
                                  alt={student.name.englishName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="font-semibold text-blue-600 text-sm">
                                  {student.name.englishName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name.englishName} ({student.user.status})
                            </div>

                            <div className="text-md text-gray-900 font-bold mt-0.5">
                              ID: {student.id} (
                              <span
                                className={`text-md px-2 py-0.5 rounded-full ${
                                  student.version === "bangla"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {student.version === "bangla"
                                  ? "Bangla"
                                  : "English"}
                              </span>
                              )
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Academic Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-700">
                              Class:
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                              {student.currentClass}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-700">Roll:</span>
                            <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-800 rounded">
                              {student.rollNo}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-blue-600 truncate max-w-[180px]">
                            {student.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-700">
                            <FaWhatsapp className="text-green-500" size={12} />
                            {student.WhatsappNumber}
                          </div>
                        </div>
                      </td>

                      {/* Admission Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            {formatDate(student.admissionDate)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Class: {student.admissionClass}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                            disabled={deleting}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && meta?.totalPages && meta.totalPages > 1 && (
            <div className="px-6 py-4 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {meta.totalPages}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (meta.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= meta.totalPages - 2) {
                        pageNum = meta.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1.5 text-sm border-t border-b ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.totalPages}
                    className="px-3 py-1.5 text-sm border rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {meta.totalStudents} total records
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
