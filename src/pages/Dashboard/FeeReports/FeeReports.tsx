"use client";

import { useFeeReportsQuery } from "@/redux/features/payment/paymentApi";
import React, { useState } from "react";
import { Spin } from "antd";
import dayjs from "dayjs";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

// Month names array
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
  sessionTotalRequired: number;
  sessionPaid: number;
  sessionDue: number;
  sessionStatus: string;
  monthlyDue: number;
  totalDue: number;
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
    payments: {
      monthly: any[];
      annual: any[];
    };
    monthlyFeeInfo?: {
      totalDue: number;
      currentMonthDue: number;
      previousMonthsDue: number;
      dueMonths: Array<{
        month: string;
        amount: number;
        status: string;
      }>;
      paidMonths: Array<{
        month: string;
        amount: number;
        paidAmount: number;
        due: number;
        status: string;
        date?: string;
        invoiceNo?: string;
      }>;
      hasDue: boolean;
      summary: {
        totalPaidMonths: number;
        totalDueMonths: number;
        paidAmount: number;
        dueAmount: number;
      };
    };
    sessionFeeInfo?: {
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
    totalDue: number;
  }>;
  summary: {
    totalStudents: number;
    studentsWithPayments: {
      monthly: number;
      annual: number;
    };
    studentsWithoutPayments: {
      monthly: number;
      annual: number;
    };
    due: {
      monthly: {
        total: number;
        currentMonth: number;
        previousMonths: number;
        studentsWithDue: number;
      };
      session: {
        total: number;
        studentsWithDue: number;
      };
      overall: {
        total: number;
      };
    };
  };
}

const FeeReports = () => {
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
    paymentType: "monthlyFee,annualFee",
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
  const reportData = data?.data?.data as FeeReportResponse | undefined;

  // Process data for table format
  const processTableData = (): StudentDataType[] => {
    if (!reportData?.students) return [];

    return reportData.students.map((studentGroup: any) => {
      const student = studentGroup.studentInfo;
      const monthlyPayments = studentGroup.payments?.monthly || [];
      const monthlyInfo = studentGroup.monthlyFeeInfo;
      const sessionInfo = studentGroup.sessionFeeInfo;

      // Group monthly payments by month
      const monthWisePayments: any = {};

      // Set default object for all months
      months.forEach((month) => {
        monthWisePayments[month] = {
          status: "due",
          due: 0,
          paidAmount: 0,
          monthlyFee: 0,
          month: month,
        };
      });

      // Set paid months from monthly payments
      monthlyPayments.forEach((payment: any) => {
        if (payment.paymentType === "monthlyFee" && payment.month) {
          const monthName = payment.month;
          monthWisePayments[monthName] = {
            status: payment.status || "paid",
            due: payment.due || 0,
            paidAmount: payment.paidAmount || 0,
            monthlyFee: payment.monthlyFee || 0,
            month: monthName,
            invoiceNo: payment.invoiceNo,
            date: payment.date,
            ...payment,
          };
        }
      });

      // Set due months from monthlyInfo (months with no payment)
      if (
        monthlyInfo &&
        monthlyInfo.dueMonths &&
        monthlyInfo.dueMonths.length > 0
      ) {
        monthlyInfo.dueMonths.forEach((dueMonth: any) => {
          const monthName = dueMonth.month;
          // Only if no payment exists
          if (
            monthWisePayments[monthName] &&
            monthWisePayments[monthName].status === "due" &&
            monthWisePayments[monthName].paidAmount === 0
          ) {
            monthWisePayments[monthName] = {
              ...monthWisePayments[monthName],
              status: "due",
              due: dueMonth.amount || 0,
              amount: dueMonth.amount || 0,
              monthlyFee: dueMonth.amount || 0,
            };
          }
        });
      }

      // Override with paidMonths from monthlyInfo
      if (
        monthlyInfo &&
        monthlyInfo.paidMonths &&
        monthlyInfo.paidMonths.length > 0
      ) {
        monthlyInfo.paidMonths.forEach((paidMonth: any) => {
          const monthName = paidMonth.month;
          monthWisePayments[monthName] = {
            status: "paid",
            due: 0,
            paidAmount: paidMonth.paidAmount || paidMonth.amount || 0,
            monthlyFee: paidMonth.amount || 0,
            month: monthName,
            invoiceNo: paidMonth.invoiceNo,
            date: paidMonth.date,
            ...paidMonth,
          };
        });
      }

      return {
        key: student?.id || Math.random().toString(),
        id: student?.id || "N/A",
        nameBangla: student?.name?.bengaliName || "N/A",
        nameEnglish: student?.name?.englishName || "N/A",
        rollNo: student?.rollNo || "N/A",
        class: student?.currentClass || "N/A",
        // Session fee data
        sessionFee: sessionInfo?.sessionFee || 0,
        admissionFee: sessionInfo?.admissionFee || 0,
        sessionTotalRequired: sessionInfo?.totalRequired || 0,
        sessionPaid: sessionInfo?.paidAmount || 0,
        sessionDue: sessionInfo?.dueAmount || 0,
        sessionStatus: sessionInfo?.status || "due",
        // Monthly total due
        monthlyDue: monthlyInfo?.totalDue || 0,
        // Overall total due
        totalDue: studentGroup.totalDue || 0,
        ...monthWisePayments,
      };
    });
  };

  // Calculate totals from summary
  const summary = reportData?.summary || {
    totalStudents: 0,
    studentsWithPayments: { monthly: 0, annual: 0 },
    studentsWithoutPayments: { monthly: 0, annual: 0 },
    due: {
      monthly: {
        total: 0,
        currentMonth: 0,
        previousMonths: 0,
        studentsWithDue: 0,
      },
      session: { total: 0, studentsWithDue: 0 },
      overall: { total: 0 },
    },
  };

  const handlePayMonthly = (studentId: string, month: string) => {
    console.log(
      `Pay monthly fee for student ${studentId} in ${month} ${selectedYear}`,
    );
  };

  const handlePaySession = (studentId: string) => {
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
        <p className="text-red-600">Failed to load fee reports</p>
      </div>
    );
  }

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
          Fee Reports - {selectedYear}
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
      <div className="hidden md:block bg-gray-50 p-3 rounded-lg mb-4 sticky top-0 z-50">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Total Students</span>
            <div className="text-base font-bold">{summary.totalStudents}</div>
          </div>
          <div className="bg-purple-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Monthly Due</span>
            <div className="text-base font-bold text-orange-600">
              ৳{summary.due.monthly.total}
            </div>
            <div className="text-xs text-gray-500">
              Students: {summary.due.monthly.studentsWithDue}
            </div>
          </div>
          <div className="bg-red-50 p-2 rounded-lg">
            <span className="text-xs text-gray-600">Session Due</span>
            <div className="text-base font-bold text-red-600">
              ৳{summary.due.session.total}
            </div>
            <div className="text-xs text-gray-500">
              Students: {summary.due.session.studentsWithDue}
            </div>
          </div>
          <div className="bg-green-600 p-2 rounded-lg">
            <span className="text-xs text-white">Total Due</span>
            <div className="text-base font-bold text-white">
              ৳{summary.due.overall.total}
            </div>
          </div>
          <div className="bg-indigo-600 p-2 rounded-lg">
            <span className="text-xs text-white">Monthly Paid</span>
            <div className="text-base font-bold text-white">
              {summary.studentsWithPayments.monthly} students
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
                    {months.map((month) => (
                      <th
                        key={month}
                        scope="col"
                        className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r whitespace-nowrap"
                      >
                        {month.slice(0, 3)}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r whitespace-nowrap bg-purple-600"
                    >
                      Session
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider border-r whitespace-nowrap bg-blue-600"
                    >
                      Monthly Due
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-center text-xs font-medium text-white uppercase tracking-wider bg-green-600"
                    >
                      Total Due
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
                      {months.map((month) => {
                        const payment = student[month];
                        return (
                          <td
                            key={month}
                            className="px-3 py-2 text-center border-r text-xs"
                          >
                            {payment?.status === "paid" ? (
                              <div className="flex flex-col items-center">
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                                  Paid
                                </span>
                                <div className="text-gray-600 mt-0.5">
                                  ৳{payment.paidAmount}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-0.5">
                                {payment?.due > 0 ? (
                                  <>
                                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                      Due: ৳{payment.due}
                                    </span>
                                    <button
                                      className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                      onClick={() =>
                                        handlePayMonthly(student.id, month)
                                      }
                                    >
                                      Pay
                                    </button>
                                  </>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                    No Fee
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      {/* Session Fee Column */}
                      <td className="px-3 py-2 text-center border-r text-xs">
                        {student.sessionTotalRequired > 0 ? (
                          <div className="flex flex-col items-center gap-0.5">
                            {student.sessionStatus === "paid" ? (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                                Paid: ৳{student.sessionPaid}
                              </span>
                            ) : (
                              <>
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                  Due: ৳{student.sessionDue}
                                </span>
                                <div className="text-xs text-gray-500">
                                  S: ৳{student.sessionFee} | A: ৳
                                  {student.admissionFee}
                                </div>
                                <button
                                  className="px-1.5 py-0.5 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
                                  onClick={() => handlePaySession(student.id)}
                                >
                                  Pay Session
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            No Session Fee
                          </span>
                        )}
                      </td>
                      {/* Monthly Due Column */}
                      <td className="px-3 py-2 text-center border-r text-xs font-bold text-orange-600">
                        ৳{student.monthlyDue}
                      </td>
                      {/* Total Due Column */}
                      <td className="px-3 py-2 text-center text-xs font-bold text-red-600">
                        ৳{student.totalDue}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-blue-50 font-bold">
                    <td className="sticky left-0 bg-blue-50 px-3 py-2 border-r text-xs">
                      <span className="font-bold">Total</span>
                    </td>
                    {months.map((month) => (
                      <td
                        key={month}
                        className="px-3 py-2 text-center border-r text-xs"
                      >
                        -
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center border-r text-xs font-bold text-purple-600">
                      ৳{summary.due.session.total}
                    </td>
                    <td className="px-3 py-2 text-center border-r text-xs font-bold text-orange-600">
                      ৳{summary.due.monthly.total}
                    </td>
                    <td className="px-3 py-2 text-center text-xs font-bold text-red-600">
                      ৳{summary.due.overall.total}
                    </td>
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

export default FeeReports;
