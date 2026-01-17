"use client";

import React, { useState } from "react";
import {
  Search,
  User,
  Calendar,
  BookOpen,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  useGetPaymentInfoQuery,
  useSavePaymentInfoMutation,
} from "@/redux/features/payment/paymentApi";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { getInvoiceHTML } from "@/components/Invoice/Invoice";

const SelfPay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [savePayment, { isLoading: savingPayment }] =
    useSavePaymentInfoMutation();

  const payload = {
    id: searchedId,
  };

  const { data, isLoading, isError, refetch } = useGetPaymentInfoQuery(
    payload,
    {
      skip: !searchedId, // শুধুমাত্র সার্চ করলে query চালাবে
    },
  );

  const paymentInfo = data?.data?.data;
  console.log(paymentInfo);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchedId(searchTerm.trim());
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayNow = async (paymentType: string, id: string) => {
    const payload = {
      paymentType,
      id,
    };
    console.log(payload);
    const res = await savePayment(payload).unwrap();
    console.log(res.data.data);
    if (res.data.success) {
      refetch();
      handlePrintInvoice(res.data.data.paymentInfo);
    }
  };

  const handlePrintInvoice = (result: {
    paybleamount: number;
    paidAmount: number;
    due: number;
    status: string;
    invoiceNo: string;
  }) => {
    if (!paymentInfo?.student) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = getInvoiceHTML(paymentInfo, result);

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (isLoading || savingPayment) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-2">
      <div className="">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Self Pay Portal
          </h1>
          <p className="text-gray-600">
            Search student by ID and manage payments
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Enter Student ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              Search Student
            </button>
          </form>

          {isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Error loading student data. Please check the ID and try again.
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading student information...</p>
          </div>
        )}

        {/* Student Details and Payment Info */}
        {paymentInfo && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Information Card */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Student Details
                  </h2>
                  <p className="text-sm text-gray-500">Personal Information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Student ID</p>
                  <p className="font-medium text-gray-800">
                    {paymentInfo.student.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800">
                      {paymentInfo.student.name?.englishName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {paymentInfo.student.name?.bengaliName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Class</p>
                    <p className="font-medium text-gray-800">
                      {paymentInfo.student.currentClass}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Version</p>
                    <p className="font-medium text-gray-800 capitalize">
                      {paymentInfo.student.version}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cadet</p>
                    <p
                      className={`font-medium ${paymentInfo.student.isCadet ? "text-green-600" : "text-gray-800"}`}
                    >
                      {paymentInfo.student.isCadet ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Waiver</p>
                    <p className="font-medium text-blue-600">
                      {paymentInfo.student.waiver}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Monthly Fee Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-full ${paymentInfo.monthlyFee.status === "paid" ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      <Calendar
                        className={`h-6 w-6 ${paymentInfo.monthlyFee.status === "paid" ? "text-green-600" : "text-yellow-600"}`}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Monthly Fee
                      </h2>
                      <p className="text-sm text-gray-500">
                        Current Month Payment
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${paymentInfo.monthlyFee.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {paymentInfo.monthlyFee.status === "paid" ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {paymentInfo.monthlyFee.status === "paid" ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Monthly Fee Already Paid
                    </h3>
                    <p className="text-gray-600">
                      No due amount for current month
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">
                          Monthly Fee
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          ৳
                          {formatCurrency(
                            paymentInfo.monthlyFee.monthlyFee || 0,
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">IT Charge</p>
                        <p className="text-lg font-bold text-gray-800">
                          ৳
                          {formatCurrency(paymentInfo.monthlyFee.itCharge || 0)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">
                          Electricity
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          ৳
                          {formatCurrency(
                            paymentInfo.monthlyFee.electricityFee || 0,
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Others</p>
                        <p className="text-lg font-bold text-gray-800">
                          ৳
                          {formatCurrency(
                            paymentInfo.monthlyFee.othersFee || 0,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 mb-1">
                          Total Amount
                        </p>
                        <p className="text-xl font-bold text-blue-700">
                          ৳
                          {formatCurrency(
                            paymentInfo.monthlyFee.totalAmount || 0,
                          )}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">
                          Paid Amount
                        </p>
                        <p className="text-xl font-bold text-green-700">
                          ৳
                          {formatCurrency(
                            paymentInfo.monthlyFee.paidAmount || 0,
                          )}
                        </p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-600 mb-1">Due Amount</p>
                        <p className="text-xl font-bold text-red-700">
                          ৳{formatCurrency(paymentInfo.monthlyFee.due || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="text-lg font-bold text-red-500 mt-2">
                      <p>
                        Last Date:{" "}
                        {formatDate(paymentInfo.monthlyFee?.lastDate)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handlePayNow("monthlyFee", paymentInfo?.student?.id)
                      }
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium mt-4"
                    >
                      Pay Monthly Fee
                    </button>
                  </div>
                )}
              </div>

              {/* Annual Fee Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-full ${paymentInfo.annualFee.status === "paid" ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      <BookOpen
                        className={`h-6 w-6 ${paymentInfo.annualFee.status === "paid" ? "text-green-600" : "text-yellow-600"}`}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Session Fee {paymentInfo.annualFee.year}
                      </h2>
                      <p className="text-sm text-gray-500">Annual Payment</p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${paymentInfo.annualFee.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {paymentInfo.annualFee.status === "paid" ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Session Fee</p>
                      <p className="text-lg font-bold text-gray-800">
                        ৳{formatCurrency(paymentInfo.annualFee.sessionFee || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">
                        Admission Fee
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        ৳
                        {formatCurrency(
                          paymentInfo.annualFee.admissionFee || 0,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-blue-700">
                        ৳
                        {formatCurrency(paymentInfo.annualFee.totalAmount || 0)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Paid Amount</p>
                      <p className="text-xl font-bold text-green-700">
                        ৳{formatCurrency(paymentInfo.annualFee.paidAmount || 0)}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 mb-1">Due Amount</p>
                      <p className="text-xl font-bold text-red-700">
                        ৳{formatCurrency(paymentInfo.annualFee.due || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mt-2">
                    <p>Date: {formatDate(paymentInfo.annualFee.date)}</p>
                  </div>

                  {paymentInfo.annualFee.status === "pending" && (
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium">
                      Pay Session Fee
                    </button>
                  )}
                </div>
              </div>

              {/* Semester Fee Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-full ${paymentInfo.semesterFee.status === "paid" ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      <CreditCard
                        className={`h-6 w-6 ${paymentInfo.semesterFee.status === "paid" ? "text-green-600" : "text-gray-600"}`}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Semester Fee
                      </h2>
                      <p className="text-sm text-gray-500">
                        {paymentInfo.semesterFee.month}{" "}
                        {paymentInfo.semesterFee.year}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${paymentInfo.semesterFee.status === "paid" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {paymentInfo.semesterFee.status === "paid"
                      ? "Paid"
                      : "Not Set"}
                  </div>
                </div>

                <div className="text-center py-8">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Semester Fee Information
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Semester fee structure will be updated soon
                  </p>
                  <div className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    Amount: ৳
                    {formatCurrency(paymentInfo.semesterFee.semesterFee || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {searchedId && !paymentInfo && !isLoading && !isError && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Student Found
            </h3>
            <p className="text-gray-500 mb-4">
              No student found with ID:{" "}
              <span className="font-medium">{searchedId}</span>
            </p>
            <p className="text-sm text-gray-400">
              Please check the Student ID and try again
            </p>
          </div>
        )}

        {/* Initial State */}
        {!searchedId && !isLoading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Search for a Student
            </h3>
            <p className="text-gray-500">
              Enter a Student ID in the search bar above to view payment details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfPay;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
