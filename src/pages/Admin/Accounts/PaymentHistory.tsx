"use client";

import React, { useState, useCallback } from "react";
import { useGetPaymentHistoryQuery } from "@/redux/features/accounts/accountsApi";

import DateFilter from "@/components/paymentHistory/DateFilter";
import PaymentSummary from "@/components/paymentHistory/PaymentSummary";
import StudentPaymentTable from "@/components/paymentHistory/StudentPaymentTable";
import PaymentDetailsModal from "@/components/paymentHistory/PaymentDetailsModal";

import {
  Filters,
  Payment,
  StudentWisePayment,
  PaymentHistoryData,
} from "@/types/payment.types";

// Wrapper interface for the actual API response structure
interface ApiResponseWrapper {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: PaymentHistoryData;
}

interface RTKQueryResponse {
  data?: ApiResponseWrapper;
}

const PaymentHistory: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    fromDate: "",
    toDate: "",
    exactDate: "",
  });
  const [selectedPayment, setSelectedPayment] = useState<
    Payment | StudentWisePayment | null
  >(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Build query params
  const getQueryParams = useCallback((): string => {
    const params = new URLSearchParams();
    if (filters.exactDate) {
      params.append("exactDate", filters.exactDate);
    } else {
      if (filters.fromDate) params.append("fromDate", filters.fromDate);
      if (filters.toDate) params.append("toDate", filters.toDate);
    }
    return params.toString();
  }, [filters]);

  const { data, isLoading, isError, refetch } = useGetPaymentHistoryQuery(
    getQueryParams(),
    {
      skip: false,
    },
  );

  // Your data structure: data.data.data
  const responseData = data as RTKQueryResponse | undefined;
  const paymentHistoryData = (responseData?.data as ApiResponseWrapper)?.data;

  const summary = paymentHistoryData?.summary;
  const studentWisePayments = paymentHistoryData?.studentWisePayments || [];
  const monthlyFees = paymentHistoryData?.monthlyFees || [];
  const semesterFee = paymentHistoryData?.semesterFee || [];
  const annualFee = paymentHistoryData?.annualFee || [];

  console.log("Payment Data:", paymentHistoryData);

  const handleFilterChange = useCallback((newFilters: Filters): void => {
    setFilters(newFilters);
  }, []);

  const handleViewDetails = useCallback((payment: Payment): void => {
    setSelectedPayment(payment);
    setModalOpen(true);
  }, []);

  const handleViewStudentDetails = useCallback(
    (studentWisePayment: StudentWisePayment): void => {
      setSelectedPayment(studentWisePayment);
      setModalOpen(true);
    },
    [],
  );

  const handleClearFilters = useCallback((): void => {
    setFilters({
      fromDate: "",
      toDate: "",
      exactDate: "",
    });
  }, []);

  const handleCloseModal = useCallback((): void => {
    setModalOpen(false);
    setSelectedPayment(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading payment history. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Payment History
        </h1>

        {/* Date Filter Component */}
        <DateFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Summary Cards */}
        {summary && <PaymentSummary summary={summary} />}

        {/* Student Wise Payment Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Student-wise Payment Summary
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Students: {studentWisePayments.length}
            </p>
          </div>
          <StudentPaymentTable studentWisePayments={studentWisePayments} />
        </div>

        {/* Rest of your component remains the same */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Fees */}
          {monthlyFees.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-800">
                  Monthly Fees ({monthlyFees.length})
                </h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Month
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyFees.slice(0, 5).map((fee: Payment) => (
                      <tr
                        key={fee._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewDetails(fee)}
                      >
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {fee.id}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {fee.month} {fee.year}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ৳{fee.totalAmount}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              fee.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : fee.status === "partial"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Annual Fees */}
          {annualFee.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <h3 className="text-lg font-semibold text-green-800">
                  Annual Fees ({annualFee.length})
                </h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Year
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {annualFee.slice(0, 5).map((fee: Payment) => (
                      <tr
                        key={fee._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewDetails(fee)}
                      >
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {fee.id}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {fee.year}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ৳{fee.totalAmount}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              fee.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : fee.status === "partial"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Semester Fees */}
          {semesterFee.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
                <h3 className="text-lg font-semibold text-purple-800">
                  Semester Fees ({semesterFee.length})
                </h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Month
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {semesterFee.slice(0, 5).map((fee: Payment) => (
                      <tr
                        key={fee._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewDetails(fee)}
                      >
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {fee.id}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {fee.month} {fee.year}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ৳{fee.totalAmount}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              fee.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : fee.status === "partial"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
