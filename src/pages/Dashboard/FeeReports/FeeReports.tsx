"use client";

import { useFeeReportsQuery } from "@/redux/features/payment/paymentApi";
import React, { useState } from "react";
import { Spin } from "antd";
import dayjs from "dayjs";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

// মাসের নাম অ্যারে
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ক্লাস অপশন
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
  [key: string]: any;
}

interface FeeReportResponse {
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
  }>;
}

const FeeReports = () => {
  const [selectedYear, setSelectedYear] = useState<string>(
    dayjs().format("YYYY"),
  );
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedCadet, setSelectedCadet] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // API প্যারামিটার তৈরি
  const params = {
    paymentType: "monthlyFee",
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

  // টাইপ কাস্টিং সহ ডাটা
  const reportData = data?.data?.data as FeeReportResponse | undefined;

  // ডাটা প্রসেস করে টেবিলের জন্য ফরম্যাট করা
  const processTableData = (): StudentDataType[] => {
    if (!reportData?.students) return [];

    return reportData.students.map((studentGroup: any) => {
      const student = studentGroup.studentInfo;
      const payments = studentGroup.payments || [];

      // মাস অনুযায়ী পেমেন্ট গ্রুপ করা
      const monthWisePayments: any = {};

      payments.forEach((payment: any) => {
        if (payment.paymentType === "monthlyFee" && payment.month) {
          const monthName = payment.month.split("-")[0];
          monthWisePayments[monthName] = payment;
        }
      });

      return {
        key: student?.id || Math.random().toString(),
        id: student?.id || "N/A",
        nameBangla: student?.name?.bengaliName || "N/A",
        nameEnglish: student?.name?.englishName || "N/A",
        rollNo: student?.rollNo || "N/A",
        class: student?.currentClass || "N/A",
        ...monthWisePayments,
      };
    });
  };

  const handlePayNow = (studentId: string, month: string) => {
    console.log(`Pay for student ${studentId} in ${month} ${selectedYear}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedClass("");
    setSelectedVersion("");
    setSelectedCadet("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // লোডিং স্টেট
  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // এরর স্টেট
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load fee reports</p>
      </div>
    );
  }

  // ফিল্টার অবজেক্ট নিরাপদে এক্সেস করা
  const filters = reportData?.filters || {};
  const totalStudents = reportData?.totalStudents || 0;
  const totalRecords = reportData?.totalRecords || 0;
  const tableData = processTableData();

  // সক্রিয় ফিল্টারের সংখ্যা গণনা
  const activeFilterCount = [
    selectedClass,
    selectedVersion,
    selectedCadet,
    searchTerm,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4">
      {/* হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h1 className="text-lg md:text-xl font-bold">
          Monthly Fee Reports - {selectedYear}
        </h1>

        {/* মোবাইল ফিল্টার ও সার্চ বাটন */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium md:hidden"
          >
            <FiSearch className="text-gray-600" />
            <span>সার্চ</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium md:hidden"
          >
            <FiFilter className="text-white" />
            <span>ফিল্টার</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* মোবাইল সার্চ সেকশন */}
      {showSearch && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg md:hidden">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">
              সার্চ (আইডি, নাম, ফোন নম্বর)
            </label>
            <button onClick={() => setShowSearch(false)}>
              <FiX className="text-gray-500" />
            </button>
          </div>
          <input
            type="text"
            placeholder="সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      )}

      {/* মোবাইল ফিল্টার সেকশন */}
      {showFilters && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg md:hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">ফিল্টার অপশন</h3>
            <button onClick={() => setShowFilters(false)}>
              <FiX className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Year Filter - সবসময় দেখাবে */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                বছর
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
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
                ভার্সন
              </label>
              <select
                value={selectedVersion}
                onChange={(e) => {
                  setSelectedVersion(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">সব ভার্সন</option>
                <option value="bangla">বাংলা</option>
                <option value="english">ইংলিশ</option>
              </select>
            </div>

            {/* Student Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                স্টুডেন্ট টাইপ
              </label>
              <select
                value={selectedCadet}
                onChange={(e) => {
                  setSelectedCadet(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">সব স্টুডেন্ট</option>
                <option value="false">রেগুলার</option>
                <option value="true">ক্যাডেট</option>
              </select>
            </div>

            {/* ক্লিয়ার ফিল্টার বাটন */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full mt-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                সব ফিল্টার ক্লিয়ার করুন
              </button>
            )}
          </div>
        </div>
      )}

      {/* ডেস্কটপ ফিল্টার সেকশন - md এবং বড় স্ক্রিনে দেখাবে */}
      <div className="hidden md:block bg-gray-50 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Year Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              বছর
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
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
              {classOptions.map((cls) => (
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
            <select
              value={selectedVersion}
              onChange={(e) => {
                setSelectedVersion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">সব ভার্সন</option>
              <option value="bangla">বাংলা</option>
              <option value="english">ইংলিশ</option>
            </select>
          </div>

          {/* Student Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              স্টুডেন্ট টাইপ
            </label>
            <select
              value={selectedCadet}
              onChange={(e) => {
                setSelectedCadet(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">সব স্টুডেন্ট</option>
              <option value="false">রেগুলার</option>
              <option value="true">ক্যাডেট</option>
            </select>
          </div>
        </div>

        {/* Search Filter - ডেস্কটপ */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            সার্চ (আইডি, নাম, ফোন নম্বর)
          </label>
          <input
            type="text"
            placeholder="সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* ক্লিয়ার ফিল্টার বাটন - ডেস্কটপ */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors"
            >
              ফিল্টার ক্লিয়ার
            </button>
          </div>
        )}
      </div>

      {/* সামারি কার্ড */}
      {reportData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <span className="text-xs text-gray-600">মোট স্টুডেন্ট</span>
            <div className="text-lg font-bold">{totalStudents}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <span className="text-xs text-gray-600">মোট রেকর্ড</span>
            <div className="text-lg font-bold">{totalRecords}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <span className="text-xs text-gray-600">ফিল্টার</span>
            <div className="text-xs">
              {Object.keys(filters).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(filters)
                    .filter(
                      ([_, value]) =>
                        value !== undefined && value !== null && value !== "",
                    )
                    .map(([key, value]) => {
                      const displayValue =
                        typeof value === "boolean"
                          ? value
                            ? "হ্যাঁ"
                            : "না"
                          : String(value);
                      return (
                        <span
                          key={key}
                          className="inline-block bg-white px-1.5 py-0.5 rounded text-xs"
                        >
                          <span className="font-medium">{key}:</span>{" "}
                          {displayValue}
                        </span>
                      );
                    })}
                </div>
              ) : (
                <span className="text-gray-500">
                  কোন ফিল্টার প্রয়োগ করা হয়নি
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* টেবিল সেকশন */}
      {tableData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          কোনো ডাটা পাওয়া যায়নি
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-3 md:-mx-4">
            <div className="inline-block min-w-full align-middle px-3 md:px-4">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-500">
                    <tr>
                      <th
                        scope="col"
                        className="sticky left-0 bg-blue-500 px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-r"
                      >
                        Student Info
                      </th>
                      {months.map((month) => (
                        <th
                          key={month}
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-r whitespace-nowrap"
                        >
                          {month.slice(0, 3)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((student, index) => (
                      <tr
                        key={student.key}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="sticky left-0 bg-inherit px-4 py-3 border-r text-sm">
                          <div className="flex flex-col min-w-[150px]">
                            <span className="font-medium text-gray-900">
                              {student.nameEnglish}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {student.id} | Roll: {student.rollNo}
                            </span>
                            <span className="text-xs text-gray-500">
                              Class: {student.class}
                            </span>
                          </div>
                        </td>
                        {months.map((month) => {
                          const payment = student[month];
                          return (
                            <td
                              key={month}
                              className="px-4 py-3 text-center border-r text-sm whitespace-nowrap"
                            >
                              {!payment ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="px-2 py-0.5 bg-red-700 text-white rounded-full text-xs">
                                    Pending
                                  </span>
                                  <button
                                    className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                    onClick={() =>
                                      handlePayNow(student.id, month)
                                    }
                                  >
                                    Pay
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                      payment.status === "paid"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-yellow-100 text-yellow-600"
                                    }`}
                                  >
                                    {payment.status === "paid" ? "Paid" : "Due"}
                                  </span>
                                  {payment.status === "paid" ? (
                                    <div className="text-xs text-gray-600 mt-1">
                                      <div>৳{payment.paidAmount}</div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-600 mt-1">
                                      <div>Due: ৳{payment.due}</div>
                                      <button
                                        className="text-blue-500 hover:text-blue-700 text-xs"
                                        onClick={() =>
                                          handlePayNow(student.id, month)
                                        }
                                      >
                                        Pay
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* প্যাগিনেশন */}
          {totalStudents > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-gray-600 order-2 sm:order-1">
                <span className="hidden sm:inline">Showing </span>
                {(currentPage - 1) * 20 + 1} -{" "}
                {Math.min(currentPage * 20, totalStudents)} of {totalStudents}
              </div>
              <div className="flex gap-2 order-1 sm:order-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  <FiChevronLeft className="text-lg" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage * 20 >= totalStudents}
                  className="flex items-center gap-1 px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  <span className="hidden sm:inline">Next</span>
                  <FiChevronRight className="text-lg" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeeReports;
