"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useGetCurrentMonthPaymentsMutation } from "@/redux/features/accounts/accountsApi";

// ১. ব্যাকএন্ডের নতুন ফিল্ডসহ টাইপ ইন্টারফেস আপডেট
interface StudentName {
  bengaliName: string;
  englishName: string;
  _id: string;
}

interface PaymentItem {
  _id: string;
  id: string;
  invoiceNo: string;
  studentName: StudentName;
  studentClass: string;
  studentRoll: string;
  paymentType: string;
  monthlyFee: number;
  paidAmount: number;
  totalAmount: number;
  due: number;
  status: "paid" | "partial" | "unpaid";
  month: string;
  year: string;
  date: string;
  createdAt: string;
}

interface PaymentDataPayload {
  result: PaymentItem[];
  totalCollection: number;
}

interface ApiResponseWrapper {
  success: boolean;
  message: string;
  data: {
    data: PaymentDataPayload;
  };
}

const CurrentMonthCollection: React.FC = () => {
  // কারেন্ট মান্থ এবং ইয়ার ফিল্টারের স্টেট (ডিফল্ট March 2026)
  const [monthlyFilter, setMonthlyFilter] = useState({
    month: "March",
    year: "2026",
  });

  // মিউটেশন হুক ইনিশিয়ালাইজেশন
  const [
    getCurrentMonthPayments,
    { data: monthlyMutationResponse, isLoading, isError },
  ] = useGetCurrentMonthPaymentsMutation();

  // API কল করার হ্যান্ডলার
  const handleFetchMonthlyHistory = useCallback(async () => {
    try {
      await getCurrentMonthPayments({
        month: monthlyFilter.month,
        year: monthlyFilter.year,
      }).unwrap();
    } catch (err) {
      console.error("Monthly fetch failed:", err);
    }
  }, [monthlyFilter, getCurrentMonthPayments]);

  // ফিল্টার চেঞ্জ বা পেজ লোডে অটো ফেচ
  useEffect(() => {
    handleFetchMonthlyHistory();
  }, [handleFetchMonthlyHistory]);

  // ডেটা ম্যাপ করা
  const rawData = (monthlyMutationResponse as unknown as ApiResponseWrapper)
    ?.data?.data;

  const paymentsList = rawData?.result || [];
  const totalCollection = rawData?.totalCollection || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-6">
        <p>Error loading current month payments. Please try again.</p>
        <button
          onClick={handleFetchMonthlyHistory}
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
        {/* ফিল্টার কন্ট্রোল হেডার */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Current Month Collection
          </h1>

          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200 w-fit">
            <select
              value={monthlyFilter.month}
              onChange={(e) =>
                setMonthlyFilter((prev) => ({ ...prev, month: e.target.value }))
              }
              className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer p-1"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>

            <select
              value={monthlyFilter.year}
              onChange={(e) =>
                setMonthlyFilter((prev) => ({ ...prev, year: e.target.value }))
              }
              className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer border-l pl-2 p-1"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>

            <button
              onClick={handleFetchMonthlyHistory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition font-medium"
            >
              Check
            </button>
          </div>
        </div>

        {/* সামারি কার্ডস */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Collection
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              ৳ {totalCollection.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total Transactions
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {paymentsList.length}
            </p>
          </div>
        </div>

        {/* নতুন কলামসহ পেমেন্ট রেকর্ডস টেবিল */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Collection Breakdown ({monthlyFilter.month} {monthlyFilter.year})
            </h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Records: {paymentsList.length}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Roll
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentsList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No data found for the selected month.
                    </td>
                  </tr>
                ) : (
                  paymentsList.map((fee: PaymentItem) => (
                    <tr
                      key={fee._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {fee.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {fee.studentName?.englishName || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {fee.invoiceNo}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {fee.studentClass}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {fee.studentRoll}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ৳{fee.paidAmount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            fee.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : fee.status === "partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {fee.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentMonthCollection;
