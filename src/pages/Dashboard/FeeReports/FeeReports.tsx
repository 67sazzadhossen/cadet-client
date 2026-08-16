"use client";

import {
  useFeeReportsQuery,
  useSavePaymentInfoMutation,
} from "@/redux/features/payment/paymentApi";
import React, { useEffect, useState } from "react";
import { Spin, Modal, message, InputNumber } from "antd";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiDownload,
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { MdSchool, MdOutlineClass, MdPerson } from "react-icons/md";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { FaGraduationCap, FaMoneyBillWave, FaDownload } from "react-icons/fa";
import dayjs from "dayjs";
import { getInvoiceHTML } from "@/components/Invoice/Invoice";
import {
  MonthlyPayment,
  PaymentModalData,
  SessionPaymentModalData,
  StudentDataType,
} from "@/types/index.type";
import {
  classOptions,
  months,
  studentTypeOptions,
  versionOptions,
} from "@/const/index.const";
import { processTableData } from "@/utils/processTableData";
import { handleExportExcel } from "@/utils/handleExport";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

// Month names array

// Class options

// Version options

const FeeReports = () => {
  const currentUser = useAppSelector(selectCurrentUser) as { role?: string } | null;
  const isAccountant = currentUser?.role === "accountant";
  const pageSize = 40;
  const [page, setPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string>(
    dayjs().format("YYYY"),
  );
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedCadet, setSelectedCadet] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [paymentModal, setPaymentModal] = useState<PaymentModalData>({
    isOpen: false,
    studentId: "",
    studentName: "",
    studentRollNo: "",
    studentClass: "",
    month: "",
    year: selectedYear,
    amount: 0,
    paymentType: "monthly",
  });
  const [sessionPaymentModal, setSessionPaymentModal] =
    useState<SessionPaymentModalData>({
      isOpen: false,
      studentId: "",
      studentName: "",
      studentRollNo: "",
      studentClass: "",
      year: selectedYear,
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentAmount: 0,
    });
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const [savePayment] = useSavePaymentInfoMutation();

  const handleSearch = () => {
    setIsSearching(true);
    setQuerySearch(searchTerm);
    setTimeout(() => setIsSearching(false), 500);
  };

  const params = {
    paymentType: "monthlyFee,annualFee",
    year: selectedYear,
    class: selectedClass,
    version: selectedVersion,
    isCadet: selectedCadet,
    search: querySearch,
  };

  const { data, isLoading, error, isFetching, refetch } = useFeeReportsQuery(
    params,
    {
      skip: !selectedYear,
    },
  );

  const reportData = data?.data?.data;
  const isLoadingState = isLoading || isSearching;

  const handleExport = () => {
    handleExportExcel(tableData, selectedClass, selectedYear);
  };

  const printInvoice = (
    student: any,
    payment: MonthlyPayment,
    invoiceNo: string,
  ) => {
    // console.log(payment);
    try {
      const studentDataForInvoice = {
        student: {
          id: student.id,
          name: {
            englishName: student.nameEnglish,
            bengaliName: student.nameBangla,
          },
          currentClass: student.class,
          rollNo: student.rollNo,
        },
        paymentInfo: {
          due: payment.due || 0,
          paidAmount: payment.paidAmount || 0,
          paybleamount: payment.amount,
          status: payment.status,
          month: payment.month,
          year: selectedYear,
          breakdown: payment.breakdown
            ? {
                baseMonthlyFee: payment.breakdown.baseMonthlyFee ?? 0,
                waiver: payment.breakdown.waiver,
                monthlyFeeAfterWaiver:
                  payment.breakdown.monthlyFeeAfterWaiver ?? 0,
                itCharge: payment.breakdown.itCharge ?? 0,
                electricityBill: payment.breakdown.electricityBill ?? 0,
                transportationFee: payment.breakdown.transportationFee ?? 0,
                othersFee: payment.breakdown.othersFee ?? 0,
                total: payment.breakdown.total ?? 0,
              }
            : undefined,
        },
        monthlyFee: {
          lastDate: new Date(),
        },
      };

      const invoiceData = {
        paybleamount: payment.amount,
        paidAmount: payment.paidAmount || 0,
        due: payment.due || 0,
        status: payment.status,
        invoiceNo: invoiceNo,
        month: payment.month,
        year: selectedYear,
        breakdown: studentDataForInvoice.paymentInfo.breakdown,
      };

      const htmlContent = getInvoiceHTML(studentDataForInvoice, invoiceData);

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        message.error("Please allow popups to print receipt");
        return;
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (error) {
      console.error("Error printing invoice:", error);
      message.error("Failed to print receipt");
    }
  };

  const printBackendReceipt = (response: any) => {
    // sendResponse wraps the service payload; always unwrap the saved record
    // instead of rebuilding financial values from stale table state.
    const receipt =
      response?.data?.data?.data || response?.data?.data || response?.data;
    const student = receipt?.student;
    const payment = receipt?.paymentInfo;
    if (!student || !payment) {
      message.error("Payment saved, but the backend receipt data is missing");
      return;
    }

    printInvoice(
      {
        id: student.id,
        nameEnglish: student.name?.englishName || "N/A",
        nameBangla: student.name?.bengaliName || "N/A",
        class: student.currentClass,
        rollNo: student.rollNo,
      },
      {
        month: payment.month || "Session Fee",
        amount: payment.breakdown?.total ?? payment.breakdown?.totalAmount ?? payment.paidAmount,
        paidAmount: payment.paidAmount,
        due: payment.due,
        status: payment.status,
        invoiceNo: payment.invoiceNo,
        date: payment.date,
        breakdown: payment.breakdown,
      },
      payment.invoiceNo,
    );
  };

  const handlePrintInvoice = (student: any, payment: MonthlyPayment) => {
    printInvoice(
      student,
      payment,
      payment.invoiceNo || `INV-${student.id}-${payment.month}`,
    );
  };

  const handleSessionReceipt = (student: StudentDataType) => {
    const payment = student.sessionPaymentHistory?.[0];
    if (!payment?.invoiceNo) {
      message.error("No backend receipt record was found for this payment");
      return;
    }
    printInvoice(
      student,
      {
        month: "Session Fee",
        amount: payment.totalAmount || payment.paidAmount,
        paidAmount: payment.paidAmount,
        due: payment.due,
        status: payment.status as "paid" | "due",
        invoiceNo: payment.invoiceNo,
        date: payment.date,
        breakdown: {
          sessionFee: payment.sessionFee || 0,
          admissionFee: payment.admissionFee || 0,
          total: payment.totalAmount || 0,
          totalAmount: payment.totalAmount || 0,
          paidNow: payment.paidAmount,
          dueAmount: payment.due,
        },
      },
      payment.invoiceNo,
    );
  };

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

  const handlePayMonthly = (student: StudentDataType, month: string) => {
    const payment = student.monthlyPayments[month];
    setPaymentModal({
      isOpen: true,
      studentId: student.id,
      studentName: student.nameEnglish,
      studentRollNo: student.rollNo,
      studentClass: student.class,
      month: month,
      year: selectedYear,
      amount: payment?.amount || 0,
      breakdown: payment?.breakdown,
      paymentType: "monthly",
    });
  };

  const handlePaySession = (student: StudentDataType) => {
    setSessionPaymentModal({
      isOpen: true,
      studentId: student.id,
      studentName: student.nameEnglish,
      studentRollNo: student.rollNo,
      studentClass: student.class,
      year: selectedYear,
      totalAmount: student.sessionTotalRequired,
      paidAmount: student.sessionPaid,
      dueAmount: student.sessionDue,
      paymentAmount: student.sessionDue,
    });
  };

  const handleConfirmMonthlyPayment = async () => {
    setConfirmingPayment(true);
    try {
      const response = await savePayment({
        id: paymentModal.studentId,
        paymentType: "monthlyFee",
        month: paymentModal.month,
        year: selectedYear,
      }).unwrap();

      if (response.success) {
        message.success(response.message);
        setPaymentModal({ ...paymentModal, isOpen: false });
        printBackendReceipt(response);
        await refetch();
      } else {
        message.error(response.message || "Payment failed");
      }
    } catch (error: any) {
      message.error(
        error?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleConfirmSessionPayment = async () => {
    const paymentAmount = Number(sessionPaymentModal.paymentAmount);

    if (paymentAmount <= 0) {
      message.error("Please enter a valid payment amount");
      return;
    }

    if (paymentAmount > sessionPaymentModal.dueAmount) {
      message.error(
        `Payment amount cannot exceed due amount of ৳${sessionPaymentModal.dueAmount}`,
      );
      return;
    }

    setConfirmingPayment(true);
    try {
      const response = await savePayment({
        id: sessionPaymentModal.studentId,
        paymentType: "annualFee",
        year: selectedYear,
        amount: paymentAmount, // Send as number
      }).unwrap();

      if (response.success) {
        message.success(response.message);
        setSessionPaymentModal({ ...sessionPaymentModal, isOpen: false });
        printBackendReceipt(response);
        await refetch();
      } else {
        message.error(response.message || "Session fee payment failed");
      }
    } catch (error: any) {
      console.error("Session payment error:", error);
      message.error(
        error?.data?.message || "Session fee payment failed. Please try again.",
      );
    } finally {
      setConfirmingPayment(false);
    }
  };

  const clearFilters = () => {
    setSelectedClass("");
    setSelectedVersion("");
    setSelectedCadet("");
    setSearchTerm("");
    setQuerySearch("");
  };

  const tableData = processTableData(reportData);
  const totalPages = Math.max(1, Math.ceil(tableData.length / pageSize));
  const visibleTableData = tableData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    setPage(1);
  }, [selectedYear, selectedClass, selectedVersion, selectedCadet, querySearch]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (isLoadingState) {
    return (
      <div className="flex justify-center items-center h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <FiAlertCircle className="text-red-500 text-2xl" />
          <p className="text-red-600 font-medium">Failed to load fee reports</p>
        </div>
      </div>
    );
  }

  const activeFilterCount = [
    selectedClass,
    selectedVersion,
    selectedCadet,
    querySearch,
  ].filter(Boolean).length;
  const currentMonthName = dayjs().format("MMMM");
  const currentMonthIndex = months.indexOf(currentMonthName);

  return (
    <div className="dashboard-page fee-dashboard min-h-screen bg-transparent p-2 md:p-4">
      <div className="max-w-[1600px] mx-auto relative">
        {/* Header Section */}
        <div className="bg-gradient-to-r hidden from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <FaGraduationCap className="text-yellow-300" />
                  Fee Management Dashboard
                </h1>
                <p className="text-blue-100 mt-1 text-sm">
                  Manage and track all fee collections
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {!isAccountant && <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs uppercase font-semibold">
                  Total Students
                </p>
                <p className="text-white text-2xl font-bold">
                  {summary.totalStudents}
                </p>
              </div>
              <FiUsers className="text-blue-200 text-3xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs uppercase font-semibold">
                  Monthly Due
                </p>
                <p className="text-white text-xl font-bold">
                  ৳{summary.due.monthly.total.toLocaleString()}
                </p>
                <p className="text-orange-200 text-xs">
                  {summary.due.monthly.studentsWithDue} students
                </p>
              </div>
              <FaMoneyBillWave className="text-orange-200 text-3xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs uppercase font-semibold">
                  Session Due
                </p>
                <p className="text-white text-xl font-bold">
                  ৳{summary.due.session.total.toLocaleString()}
                </p>
                <p className="text-purple-200 text-xs">
                  {summary.due.session.studentsWithDue} students
                </p>
              </div>
              <HiOutlineAcademicCap className="text-purple-200 text-3xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs uppercase font-semibold">
                  Total Due
                </p>
                <p className="text-white text-xl font-bold">
                  ৳{summary.due.overall.total.toLocaleString()}
                </p>
              </div>
              <FiAlertCircle className="text-red-200 text-3xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs uppercase font-semibold">
                  Monthly Paid
                </p>
                <p className="text-white text-xl font-bold">
                  {summary.studentsWithPayments.monthly}
                </p>
                <p className="text-green-200 text-xs">students</p>
              </div>
              <FiCheckCircle className="text-green-200 text-3xl" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-xs uppercase font-semibold">
                  Collection Rate
                </p>
                <p className="text-white text-xl font-bold">
                  {summary.payments?.monthly?.totalCollected &&
                  summary.payments?.monthly?.totalDue
                    ? Math.round(
                        (summary.payments.monthly.totalCollected /
                          (summary.payments.monthly.totalCollected +
                            summary.payments.monthly.totalDue)) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
              <FiTrendingUp className="text-teal-200 text-3xl" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
            <button
              onClick={handleExport}
              className="flex flex-col items-center"
            >
              <FiDownload className="text-xl text-white" />
              Export
            </button>
          </div>
        </div>}

        {/* Filter & Search Section */}
        <div className="dashboard-glass mb-4 overflow-hidden">
          {/* Desktop Filters */}
          <div className="hidden md:block p-5 border-b border-gray-100">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <FiCalendar className="text-sm" /> Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="dashboard-input text-sm"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <MdOutlineClass className="text-sm" /> Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="dashboard-input text-sm"
                >
                  <option value="">All Classes</option>
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <MdSchool className="text-sm" /> Version
                </label>
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="dashboard-input text-sm"
                >
                  {versionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <MdPerson className="text-sm" /> Type
                </label>
                <select
                  value={selectedCadet}
                  onChange={(e) => setSelectedCadet(e.target.value)}
                  className="dashboard-input text-sm"
                >
                  {studentTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-[2] min-w-[250px]">
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <FiSearch className="text-sm" /> Search
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ID, Name, Phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="dashboard-input flex-1 text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
                  >
                    <FiSearch /> Search
                  </button>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <FiX /> Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden p-4 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium"
              >
                <FiSearch /> Search
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                <FiFilter /> Filter
                {activeFilterCount > 0 && (
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {showSearch && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
                  >
                    Go
                  </button>
                </div>
              </div>
            )}

            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">All Classes</option>
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  {versionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCadet}
                  onChange={(e) => setSelectedCadet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  {studentTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Search Indicator */}
        {querySearch && (
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
              <FiSearch className="text-sm" />
              <span>
                Searching for:{" "}
                <strong className="font-semibold">{querySearch}</strong>
              </span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setQuerySearch("");
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          </div>
        )}

        {/* Table Section */}
        {tableData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <FiAlertCircle className="text-gray-400 text-5xl" />
              <p className="text-gray-500 text-lg">No data found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        ) : (
          <div className="dashboard-glass relative overflow-hidden">
            <div className="fee-table-scroll relative max-h-[calc(100vh-15rem)] min-h-96 overflow-auto">
              <table className="fee-student-table w-full min-w-[1500px] border-separate border-spacing-0">
                <thead className="sticky top-0 z-30">
                  <tr>
                    <th
                      className="fee-student-column sticky left-0 z-40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ minWidth: "200px" }}
                    >
                      Student Info
                    </th>
                    {months.map((month, idx) => (
                      <th
                        key={month}
                        className={`px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
                          idx === currentMonthIndex
                            ? "fee-current-month"
                            : ""
                        }`}
                        style={{ minWidth: "75px" }}
                      >
                        {month.slice(0, 3)}
                      </th>
                    ))}
                    <th
                      className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider"
                      style={{ minWidth: "140px" }}
                    >
                      Session Fee
                    </th>
                    <th
                      className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-red-100"
                      style={{ minWidth: "90px" }}
                    >
                      Total Due
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTableData.map((student) => (
                    <tr key={student.key}>
                      <td className="fee-student-column sticky left-0 z-20 px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {student.nameEnglish}
                          </span>
                          <span className="text-blue-100/65 text-xs">
                            ID: {student.id} | Roll: {student.rollNo}
                          </span>
                          <span className="text-blue-100/65 text-xs">
                            Class: {student.class} |{" "}
                            {student.version === "bangla" ? "বাংলা" : "English"}
                          </span>
                          {student.waiver > 0 && (
                            <span className="inline-flex mt-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full w-fit">
                              Waiver: {student.waiver}%
                            </span>
                          )}
                        </div>
                      </td>
                      {months.map((month) => {
                        const payment = student.monthlyPayments[month];
                        return (
                          <td
                            key={month}
                            className="px-2 py-3 text-center"
                          >
                            {payment?.status === "paid" ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs font-semibold text-emerald-100">
                                  Paid
                                </span>
                                <span className="text-blue-100/70 text-xs">
                                  ৳{payment.paidAmount}
                                </span>
                                <button
                                  onClick={() =>
                                    handlePrintInvoice(student, payment)
                                  }
                                  className="mt-1 flex items-center gap-1 rounded-md bg-blue-400/15 px-2 py-1 text-xs text-blue-100 transition hover:bg-blue-400/25"
                                >
                                  <FaDownload className="text-xs" /> Receipt
                                </button>
                              </div>
                            ) : payment?.amount > 0 ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="rounded-full bg-red-400/15 px-2 py-0.5 text-xs font-semibold text-red-100">
                                  ৳{payment.amount}
                                </span>
                                <button
                                  onClick={() =>
                                    handlePayMonthly(student, month)
                                  }
                                  disabled={confirmingPayment}
                                  className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                                >
                                  {isFetching ? (
                                    <div className="loading"></div>
                                  ) : (
                                    "Pay Now"
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="rounded-full bg-slate-400/15 px-2 py-0.5 text-xs text-blue-100/60">
                                No Fee
                              </span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-center">
                        {student.sessionTotalRequired > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            {student.sessionStatus === "paid" ? (
                              <>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Paid
                                </span>
                                <button
                                  onClick={() => handleSessionReceipt(student)}
                                  className="mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1"
                                >
                                  <FaDownload className="text-xs" /> Receipt
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col items-center">
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    Due: ৳{student.sessionDue}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Paid: ৳{student.sessionPaid} / Total: ৳
                                    {student.sessionTotalRequired}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handlePaySession(student)}
                                  disabled={confirmingPayment}
                                  className="mt-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-md hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                                >
                                  Pay Now
                                </button>
                                {!!student.sessionPaymentHistory?.length && (
                                  <button
                                    onClick={() => handleSessionReceipt(student)}
                                    className="mt-1 flex items-center gap-1 rounded-md bg-blue-500/20 px-2 py-1 text-xs text-blue-100 hover:bg-blue-500/30"
                                  >
                                    <FaDownload className="text-xs" /> Latest Receipt
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                            No Fee
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-red-200">
                        ৳{student.totalDue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {!isAccountant && <tr className="fee-summary-row font-bold">
                    <td className="fee-student-column sticky left-0 px-4 py-3">
                      <span className="text-blue-50">Total Summary</span>
                    </td>
                    {months.map((month) => (
                      <td
                        key={month}
                        className="px-2 py-3 text-center text-blue-100/40"
                      >
                        -
                      </td>
                    ))}
                    <td className="px-3 py-3 text-center border-r border-gray-200 text-purple-700 font-bold">
                      ৳{summary.due.session.total.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-center text-red-700 font-bold">
                      ৳{summary.due.overall.total.toLocaleString()}
                    </td>
                  </tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tableData.length > 0 && (
          <div className="dashboard-glass mt-3 flex flex-col gap-2 px-4 py-3 text-xs text-blue-100 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, tableData.length)} of {tableData.length} students
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="dashboard-button dashboard-button-muted disabled:opacity-40"
              >
                Previous
              </button>
              <span className="min-w-20 text-center">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((value) => value + 1)}
                className="dashboard-button dashboard-button-muted disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Monthly Payment Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FaMoneyBillWave className="text-blue-500" />
              Confirm Monthly Fee Payment
            </div>
          }
          open={paymentModal.isOpen}
          onCancel={() => setPaymentModal({ ...paymentModal, isOpen: false })}
          footer={null}
          width={500}
          className="rounded-xl"
        >
          <div className="space-y-4 p-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Student Name:</span>
                  <span className="font-semibold text-gray-800">
                    {paymentModal.studentName}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Student ID:</span>
                  <span className="font-semibold text-gray-800">
                    {paymentModal.studentId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Roll No:</span>
                  <span className="font-semibold text-gray-800">
                    {paymentModal.studentRollNo}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-semibold text-gray-800">
                    {paymentModal.studentClass}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Month:</span>
                  <span className="font-semibold text-gray-800">
                    {paymentModal.month}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold text-gray-800">
                    {paymentModal.year}
                  </span>
                </div>

                {paymentModal.breakdown && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Fee Breakdown:
                    </div>
                    <div className="space-y-2">
                      {paymentModal.breakdown.baseMonthlyFee !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Base Monthly Fee:
                          </span>
                          <span>৳{paymentModal.breakdown.baseMonthlyFee}</span>
                        </div>
                      )}
                      {paymentModal.breakdown.waiver &&
                        paymentModal.breakdown.waiver.percentage > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>
                              Waiver ({paymentModal.breakdown.waiver.percentage}
                              %):
                            </span>
                            <span>
                              - ৳{paymentModal.breakdown.waiver.amount}
                            </span>
                          </div>
                        )}
                      {paymentModal.breakdown.monthlyFeeAfterWaiver !==
                        undefined && (
                        <div className="flex justify-between text-sm">
                          <span>After Waiver:</span>
                          <span>
                            ৳{paymentModal.breakdown.monthlyFeeAfterWaiver}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IT Charge:</span>
                        <span>৳{paymentModal.breakdown.itCharge}</span>
                      </div>
                      {paymentModal.breakdown.transportationFee !== undefined &&
                        paymentModal.breakdown.transportationFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Transportation Fee:
                            </span>
                            <span>
                              ৳{paymentModal.breakdown.transportationFee}
                            </span>
                          </div>
                        )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold">
                            Total Amount:
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            ৳{paymentModal.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-200">
              <p>⚠️ Please verify the payment details before confirming.</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setPaymentModal({ ...paymentModal, isOpen: false })
                }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={confirmingPayment}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMonthlyPayment}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                disabled={confirmingPayment}
              >
                {confirmingPayment ? (
                  <span className="flex items-center gap-2">
                    <Spin size="small" />
                    Processing...
                  </span>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Session Payment Modal with Partial Payment Support */}
        <Modal
          title={
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <HiOutlineAcademicCap className="text-purple-500" />
              Confirm Session Fee Payment
            </div>
          }
          open={sessionPaymentModal.isOpen}
          onCancel={() =>
            setSessionPaymentModal({ ...sessionPaymentModal, isOpen: false })
          }
          footer={null}
          width={500}
          className="rounded-xl"
        >
          <div className="space-y-4 p-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Student Name:</span>
                  <span className="font-semibold text-gray-800">
                    {sessionPaymentModal.studentName}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Student ID:</span>
                  <span className="font-semibold text-gray-800">
                    {sessionPaymentModal.studentId}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Roll No:</span>
                  <span className="font-semibold text-gray-800">
                    {sessionPaymentModal.studentRollNo}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-semibold text-gray-800">
                    {sessionPaymentModal.studentClass}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold text-gray-800">
                    {sessionPaymentModal.year}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Fee Details:
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Session Fee:</span>
                      <span>
                        ৳{sessionPaymentModal.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Previously Paid:</span>
                      <span className="text-green-600">
                        ৳{sessionPaymentModal.paidAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Due Amount:</span>
                      <span className="font-semibold text-red-600">
                        ৳{sessionPaymentModal.dueAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Payment Amount:
                  </div>
                  <div className="flex items-center gap-3">
                    <InputNumber
                      min={1}
                      max={sessionPaymentModal.dueAmount}
                      value={sessionPaymentModal.paymentAmount}
                      onChange={(value) =>
                        setSessionPaymentModal({
                          ...sessionPaymentModal,
                          paymentAmount: Number(value) || 0,
                        })
                      }
                      className="flex-1"
                      size="large"
                      formatter={(value) =>
                        `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) =>
                        Number(value?.replace(/৳\s?|(,*)/g, "")) || 0
                      }
                      disabled={confirmingPayment}
                    />
                    <button
                      onClick={() =>
                        setSessionPaymentModal({
                          ...sessionPaymentModal,
                          paymentAmount: sessionPaymentModal.dueAmount,
                        })
                      }
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                      disabled={confirmingPayment}
                    >
                      Full Amount
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the amount you want to pay (max: ৳
                    {sessionPaymentModal.dueAmount.toLocaleString()})
                  </p>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">
                      Payment to be made:
                    </span>
                    <span className="text-xl font-bold text-purple-600">
                      ৳{sessionPaymentModal.paymentAmount.toLocaleString()}
                    </span>
                  </div>
                  {sessionPaymentModal.paymentAmount <
                    sessionPaymentModal.dueAmount && (
                    <p className="text-xs text-orange-600 mt-1">
                      * Remaining due after this payment: ৳
                      {(
                        sessionPaymentModal.dueAmount -
                        sessionPaymentModal.paymentAmount
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-200">
              <p>⚠️ Please verify the payment details before confirming.</p>
              <p className="text-xs mt-1">
                * You can make partial payments. The remaining amount will be
                shown as due.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setSessionPaymentModal({
                    ...sessionPaymentModal,
                    isOpen: false,
                  })
                }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={confirmingPayment}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSessionPayment}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                disabled={confirmingPayment}
              >
                {confirmingPayment ? (
                  <span className="flex items-center gap-2">
                    <Spin size="small" />
                    Processing...
                  </span>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default FeeReports;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
