"use client";

import { useFeeReportsQuery } from "@/redux/features/payment/paymentApi";
import React, { useState } from "react";
import { Spin } from "antd";
import dayjs from "dayjs";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

// Class options
const classOptions = [
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
];

interface StudentDataType {
  key: string;
  id: string;
  nameBangla: string;
  nameEnglish: string;
  rollNo: string;
  class: string;
  sessionFee: number;
  admissionFee: number;
  totalRequired: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
}

interface SessionFeeReportResponse {
  totalRecords: number;
  totalStudents: number;
  filters?: {
    search?: string;
    className?: string;
    version?: string;
    isCadet?: boolean;
    paymentType?: string;
    year?: string;
  };
  students: Array<{
    studentInfo: any;
    payments: any[];
    sessionFeeInfo: {
      sessionFee: number;
      admissionFee: number;
      totalRequired: number;
      paidAmount: number;
      dueAmount: number;
      status: string;
      hasDue: boolean;
      isPaid: boolean;
      year: string;
    };
  }>;
  summary: {
    totalStudents: number;
    studentsWithPayments: number;
    studentsWithoutPayments: number;
    studentsWithDue: number;
    studentsPaid: number;
    totalSessionFee: number;
    totalAdmissionFee: number;
    totalRequired: number;
    totalPaid: number;
    totalDue: number;
    collectionRate: number;
  };
}

const SessionFeeReports = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    dayjs().format("YYYY"),
  );
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedCadet, setSelectedCadet] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // API parameters
  const params = {
    paymentType: "annualFee",
    year: selectedYear,
    class: selectedClass,
    version: selectedVersion,
    isCadet: selectedCadet,
    search: searchTerm,
  };

  const { data, isLoading, error, isFetching } = useFeeReportsQuery(params, {
    skip: !selectedYear,
  });

  console.log(data?.data?.data);

  // Type casting data
  const reportData = data?.data?.data as SessionFeeReportResponse | undefined;

  // Process data for table format
  const processTableData = (): StudentDataType[] => {
    if (!reportData?.students) return [];

    return reportData.students.map((studentGroup: any) => {
      const student = studentGroup.studentInfo;
      const sessionInfo = studentGroup.sessionFeeInfo || {
        sessionFee: 0,
        admissionFee: 0,
        totalRequired: 0,
        paidAmount: 0,
        dueAmount: 0,
        status: "due",
      };

      return {
        key: student?.id || Math.random().toString(),
        id: student?.id || "N/A",
        nameBangla: student?.name?.bengaliName || "N/A",
        nameEnglish: student?.name?.englishName || "N/A",
        rollNo: student?.rollNo || "N/A",
        class: student?.currentClass || "N/A",
        sessionFee: sessionInfo.sessionFee || 0,
        admissionFee: sessionInfo.admissionFee || 0,
        totalRequired: sessionInfo.totalRequired || 0,
        paidAmount: sessionInfo.paidAmount || 0,
        dueAmount: sessionInfo.dueAmount || 0,
        status: sessionInfo.status || "due",
      };
    });
  };

  const handlePayNow = (studentId: string) => {
    console.log(
      `Pay session fee for student ${studentId} for year ${selectedYear}`,
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const clearFilters = () => {
    setSelectedClass("");
    setSelectedVersion("");
    setSelectedCadet("");
    setSearchTerm("");
  };

  // Loading state
  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load session fee reports</p>
      </div>
    );
  }

  // Safely access data
  const filters = reportData?.filters || {};
  const totalStudents = reportData?.totalStudents || 0;
  const totalRecords = reportData?.totalRecords || 0;
  const summary = reportData?.summary || {
    totalSessionFee: 0,
    totalAdmissionFee: 0,
    totalRequired: 0,
    totalPaid: 0,
    totalDue: 0,
    collectionRate: 0,
    studentsWithDue: 0,
    studentsPaid: 0,
  };

  const tableData = processTableData();

  // Count active filters
  const activeFilterCount = [
    selectedClass,
    selectedVersion,
    selectedCadet,
    searchTerm,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-lg md:text-xl font-bold">
          Session Fee Reports - {selectedYear}
        </h1>

        {/* Mobile filter & search buttons */}
        <div className="flex gap-2 w-full sm:w-auto md:hidden">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium"
          >
            <FiSearch className="text-gray-600" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
          >
            <FiFilter className="text-white" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Section */}
      {showSearch && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg md:hidden">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">
              Search (ID, Name, Phone)
            </label>
            <button onClick={() => setShowSearch(false)}>
              <FiX className="text-gray-500" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      {/* Mobile Filter Section */}
      {showFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg md:hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Filter Options</h3>
            <button onClick={() => setShowFilters(false)}>
              <FiX className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Year Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Classes</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Version Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Version
              </label>
              <select
                value={selectedVersion}
                onChange={(e) => {
                  setSelectedVersion(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Versions</option>
                <option value="bangla">Bangla</option>
                <option value="english">English</option>
              </select>
            </div>

            {/* Student Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Student Type
              </label>
              <select
                value={selectedCadet}
                onChange={(e) => {
                  setSelectedCadet(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Students</option>
                <option value="false">Regular</option>
                <option value="true">Cadet</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full mt-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Filters - Compact Single Line */}
      <div className="hidden md:block bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex flex-wrap items-end gap-2">
          {/* Year Filter */}
          <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="">All</option>
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Version Filter */}
          <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Version
            </label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="">All</option>
              <option value="bangla">Bangla</option>
              <option value="english">English</option>
            </select>
          </div>

          {/* Student Type Filter */}
          <div className="flex-1 min-w-[100px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={selectedCadet}
              onChange={(e) => setSelectedCadet(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="">All</option>
              <option value="false">Regular</option>
              <option value="true">Cadet</option>
            </select>
          </div>

          {/* Search Filter */}
          <div className="flex-[2] min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="ID, Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Total Students</span>
            <div className="text-base font-bold">{summary.totalStudents}</div>
          </div>
          <div className="bg-purple-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">With Due</span>
            <div className="text-base font-bold text-orange-600">
              {summary.studentsWithDue}
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Paid</span>
            <div className="text-base font-bold text-green-600">
              {summary.studentsPaid}
            </div>
          </div>
          <div className="bg-indigo-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Session Fee</span>
            <div className="text-base font-bold">
              ৳{summary.totalSessionFee}
            </div>
          </div>
          <div className="bg-yellow-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Admission Fee</span>
            <div className="text-base font-bold">
              ৳{summary.totalAdmissionFee}
            </div>
          </div>
          <div className="bg-red-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Total Required</span>
            <div className="text-base font-bold">৳{summary.totalRequired}</div>
          </div>
          <div className="bg-green-600 p-2 rounded-lg">
            <span className="text-xs text-white">Total Paid</span>
            <div className="text-base font-bold text-white">
              ৳{summary.totalPaid}
            </div>
          </div>
          <div className="bg-red-600 p-2 rounded-lg">
            <span className="text-xs text-white">Total Due</span>
            <div className="text-base font-bold text-white">
              ৳{summary.totalDue}
            </div>
          </div>
          <div className="bg-blue-600 p-2 rounded-lg">
            <span className="text-xs text-white">Collection Rate</span>
            <div className="text-base font-bold text-white">
              {summary.collectionRate}%
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      {tableData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data found</div>
      ) : (
        <div className="overflow-x-auto -mx-3 md:-mx-4">
          <div className="inline-block min-w-full align-middle px-3 md:px-4">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500">
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 bg-blue-500 px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider border-r"
                    >
                      Student Info
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r"
                    >
                      Session Fee
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r"
                    >
                      Admission Fee
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r"
                    >
                      Total Required
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r"
                    >
                      Paid
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r"
                    >
                      Due
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider bg-blue-600"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((student, index) => (
                    <tr
                      key={student.key}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="sticky left-0 bg-inherit px-3 py-2 border-r text-xs">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {student.nameEnglish}
                          </span>
                          <span className="text-gray-500">
                            ID: {student.id} | Roll: {student.rollNo}
                          </span>
                          <span className="text-gray-500">
                            Class: {student.class}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center border-r text-xs font-medium">
                        ৳{student.sessionFee}
                      </td>
                      <td className="px-3 py-2 text-center border-r text-xs font-medium">
                        ৳{student.admissionFee}
                      </td>
                      <td className="px-3 py-2 text-center border-r text-xs font-medium">
                        ৳{student.totalRequired}
                      </td>
                      <td className="px-3 py-2 text-center border-r text-xs font-medium text-green-600">
                        ৳{student.paidAmount}
                      </td>
                      <td className="px-3 py-2 text-center border-r text-xs font-medium text-red-600">
                        ৳{student.dueAmount}
                      </td>
                      <td className="px-3 py-2 text-center border-r text-xs">
                        {student.status === "paid" ? (
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                            Paid
                          </span>
                        ) : student.dueAmount > 0 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                            Due
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            No Fee
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center text-xs">
                        {student.dueAmount > 0 && (
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={() => handlePayNow(student.id)}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-blue-50 font-bold">
                    <td className="sticky left-0 bg-blue-50 px-3 py-2 border-r text-xs">
                      <span className="font-bold">Total</span>
                    </td>
                    <td className="px-3 py-2 text-center border-r text-xs">
                      ৳{summary.totalSessionFee}
                    </td>
                    <td className="px-3 py-2 text-center border-r text-xs">
                      ৳{summary.totalAdmissionFee}
                    </td>
                    <td className="px-3 py-2 text-center border-r text-xs">
                      ৳{summary.totalRequired}
                    </td>
                    <td className="px-3 py-2 text-center border-r text-xs text-green-600">
                      ৳{summary.totalPaid}
                    </td>
                    <td className="px-3 py-2 text-center border-r text-xs text-red-600">
                      ৳{summary.totalDue}
                    </td>
                    <td className="px-3 py-2 text-center border-r text-xs"></td>
                    <td className="px-3 py-2 text-center text-xs"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionFeeReports;
