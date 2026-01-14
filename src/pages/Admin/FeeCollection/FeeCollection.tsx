"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Search,
  UserX,
  AlertCircle,
  BookOpen,
  Hash,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useGetPaymentInfoMutation } from "@/redux/features/payment/paymentApi";

interface Student {
  id: string;
  name: {
    englishName: string;
    bengaliName: string;
  };
  currentClass: string;
  rollNo: string;
  image?: {
    url: string;
  };
  isCadet?: boolean;
  version?: string;
  bloodGroup?: string;
}

interface PaymentInfo {
  due: number;
  paidAmount: number;
  paybleamount: number;
  status: string;
}

interface ApiResponse {
  student: Student;
  paymentInfo: PaymentInfo;
}

const FeeCollection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [paymentInfo, { isLoading }] = useGetPaymentInfoMutation();

  const studentData = data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const payload = {
      id: searchTerm,
      paymentType: "monthlyPayment" as const,
    };
    try {
      const res = await paymentInfo(payload).unwrap();
      setData(res.data?.data);
    } catch (error) {
      setData(null);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setData(null);
  };

  const handlePayNow = () => {
    if (studentData && studentData.paymentInfo?.due > 0) {
      handlePrintInvoice();
    }
  };

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !studentData) return;

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Invoice - ${studentData.student.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
              font-size: 11px;
              line-height: 1.3;
              color: #000;
              background: #fff;
              padding: 5mm;
            }
            
            .invoice-container {
              width: 148mm;
              height: 105mm; /* A4 half height */
              margin: 0 auto;
              padding: 4mm;
              border: 1px solid #ddd;
              position: relative;
              page-break-inside: avoid;
            }
            
            /* Header */
            .header {
              text-align: center;
              margin-bottom: 3mm;
              padding-bottom: 2mm;
              border-bottom: 1.5px solid #000;
            }
            
            .school-name {
              font-size: 14px;
              font-weight: 700;
              margin-bottom: 1mm;
              text-transform: uppercase;
            }
            
            .school-address {
              font-size: 9px;
              margin-bottom: 1mm;
            }
            
            .invoice-title {
              font-size: 12px;
              font-weight: 600;
              margin: 2mm 0;
            }
            
            /* Invoice Info */
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3mm;
              font-size: 9px;
            }
            
            .info-left, .info-right {
              display: flex;
              flex-direction: column;
              gap: 1mm;
            }
            
            .info-item {
              display: flex;
              gap: 2mm;
            }
            
            .label {
              font-weight: 600;
              min-width: 40mm;
            }
            
            .value {
              flex: 1;
            }
            
            /* Fee Table */
            .fee-table {
              width: 100%;
              border-collapse: collapse;
              margin: 3mm 0;
              font-size: 9px;
            }
            
            .fee-table th {
              background: #f0f0f0;
              padding: 1.5mm;
              border: 0.5px solid #000;
              text-align: left;
              font-weight: 600;
            }
            
            .fee-table td {
              padding: 1.5mm;
              border: 0.5px solid #000;
            }
            
            .fee-table td:first-child {
              width: 70mm;
            }
            
            .fee-table td:last-child {
              text-align: right;
              width: 25mm;
            }
            
            .total-row td {
              font-weight: 700;
              background: #f0f0f0;
            }
            
            /* Summary */
            .summary {
              margin-top: 3mm;
              display: flex;
              justify-content: space-between;
            }
            
            .summary-left {
              flex: 1;
            }
            
            .summary-right {
              width: 50mm;
            }
            
            .amount-in-words {
              font-size: 8.5px;
              margin-top: 2mm;
              font-style: italic;
            }
            
            /* Footer */
            .footer {
              margin-top: 4mm;
              padding-top: 2mm;
              border-top: 1px solid #000;
              font-size: 8px;
            }
            
            .footer-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 3mm;
            }
            
            .footer-section h4 {
              font-size: 9px;
              margin-bottom: 1mm;
              font-weight: 600;
            }
            
            .signature {
              text-align: center;
              margin-top: 5mm;
            }
            
            .signature-line {
              width: 40mm;
              border-top: 1px solid #000;
              margin: 2mm auto;
            }
            
            /* Print Styles */
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              
              .invoice-container {
                width: 148mm;
                height: 105mm;
                border: none;
                padding: 5mm;
                margin: 0;
              }
              
              .no-print {
                display: none;
              }
            }
            
            /* Helper Classes */
            .text-right {
              text-align: right;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-bold {
              font-weight: 700;
            }
            
            .mb-1 {
              margin-bottom: 1mm;
            }
            
            .mb-2 {
              margin-bottom: 2mm;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="header">
              <div class="school-name">গাজীপুর শাহীন ক্যাডেট স্কুল</div>
              <div class="school-address">গাজীপুর, ঢাকা, বাংলাদেশ | ফোন: ০১৭১২-৩৪৫৬৭৮</div>
              <div class="invoice-title">ফি রসিদ / FEE RECEIPT</div>
            </div>
            
            <!-- Invoice Info -->
            <div class="invoice-info">
              <div class="info-left">
                <div class="info-item">
                  <span class="label">ছাত্র/ছাত্রীর আইডি:</span>
                  <span class="value">${studentData.student.id}</span>
                </div>
                <div class="info-item">
                  <span class="label">নাম (ইংরেজি):</span>
                  <span class="value">${
                    studentData.student.name.englishName
                  }</span>
                </div>
                <div class="info-item">
                  <span class="label">নাম (বাংলা):</span>
                  <span class="value">${
                    studentData.student.name.bengaliName
                  }</span>
                </div>
              </div>
              <div class="info-right">
                <div class="info-item">
                  <span class="label">রোল নং:</span>
                  <span class="value">${studentData.student.rollNo}</span>
                </div>
                <div class="info-item">
                  <span class="label">ক্লাস:</span>
                  <span class="value">${studentData.student.currentClass}</span>
                </div>
                <div class="info-item">
                  <span class="label">ইনভয়েস নং:</span>
                  <span class="value">INV-${Date.now()
                    .toString()
                    .slice(-6)}</span>
                </div>
                <div class="info-item">
                  <span class="label">তারিখ:</span>
                  <span class="value">${new Date().toLocaleDateString(
                    "bn-BD"
                  )}</span>
                </div>
              </div>
            </div>
            
            <!-- Fee Table -->
            <table class="fee-table">
              <thead>
                <tr>
                  <th>বিবরণ / Description</th>
                  <th class="text-right">টাকার পরিমাণ / Amount (৳)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>মাসিক বেতন / Monthly Tuition Fee</td>
                  <td class="text-right">${studentData.paymentInfo.paybleamount.toFixed(
                    2
                  )}</td>
                </tr>
                <tr>
                  <td>বিদ্যুৎ বিল / Electricity Bill</td>
                  <td class="text-right">500.00</td>
                </tr>
                <tr>
                  <td>আইটি চার্জ / IT Charge</td>
                  <td class="text-right">300.00</td>
                </tr>
                <tr>
                  <td>অন্যান্য চার্জ / Others Charge</td>
                  <td class="text-right">200.00</td>
                </tr>
                <tr class="total-row">
                  <td>সর্বমোট / Total Amount</td>
                  <td class="text-right">${(
                    studentData.paymentInfo.paybleamount +
                    500 +
                    300 +
                    200
                  ).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>পূর্বে প্রদত্ত / Previously Paid</td>
                  <td class="text-right">${studentData.paymentInfo.paidAmount.toFixed(
                    2
                  )}</td>
                </tr>
                <tr class="total-row">
                  <td>বকেয়া / Due Amount</td>
                  <td class="text-right">${studentData.paymentInfo.due.toFixed(
                    2
                  )}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- Summary -->
            <div class="summary">
              <div class="summary-left">
                <div class="amount-in-words mb-2">
                  <span class="text-bold">অঙ্কে লেখা:</span> 
                  ${numberToWords(studentData.paymentInfo.due)} টাকা মাত্র
                </div>
                <div class="mb-1">
                  <span class="text-bold">পরিশোধের শেষ তারিখ:</span> 
                  ${new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("bn-BD")}
                </div>
                <div>
                  <span class="text-bold">মন্তব্য:</span> বিলম্বে জমা দিলে জরিমানা আরোপ করা হবে
                </div>
              </div>
              <div class="summary-right">
                <div class="mb-1">
                  <span class="text-bold">পেমেন্ট মেথড:</span> ক্যাশ পেমেন্ট
                </div>
               
               
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="grid grid-cols-3">
                <div class="footer-section">
                  <h4>শর্তাবলী / Terms & Conditions:</h4>
                  <p>১. রসিদ হারিয়ে গেলে স্কুল দায়ী নয়</p>
                  <p>২. এই রসিদ কম্পিউটার দ্বারা তৈরিকৃত</p>
                  <p>৩. তারিখ পরিবর্তনের সুযোগ নেই</p>
                </div>

                <div class="footer-section">
                  <h4>যোগাযোগ / Contact:</h4>
                  <p>হেল্পলাইন: ০৯৬৩৮-৭৭৭৮৮৮</p>
                  <p>ইমেইল: accounts@gazipurcadet.edu.bd</p>
                  <p>ওয়েবসাইট: www.gazipurcadet.edu.bd</p>
                </div>

                <div><div class="signature">
                <div class="signature-line"></div>
                <div>অনুমোদিত স্বাক্ষর / Authorized Signature</div>
                <div>প্রধান শিক্ষক / Headmaster</div></div>
              </div>
              </div>
              
              
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  // Helper function to convert number to Bengali words
  const numberToWords = (num: number): string => {
    const units = [
      "",
      "এক",
      "দুই",
      "তিন",
      "চার",
      "পাঁচ",
      "ছয়",
      "সাত",
      "আট",
      "নয়",
    ];
    const tens = [
      "",
      "দশ",
      "বিশ",
      "ত্রিশ",
      "চল্লিশ",
      "পঞ্চাশ",
      "ষাট",
      "সত্তর",
      "আশি",
      "নব্বই",
    ];
    const scales = ["", "হাজার", "লক্ষ", "কোটি"];

    if (num === 0) return "শূন্য";

    let words = "";
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        let chunkWords = "";
        const hundred = Math.floor(chunk / 100);
        const ten = Math.floor((chunk % 100) / 10);
        const unit = chunk % 10;

        if (hundred > 0) {
          chunkWords += units[hundred] + "শ ";
        }

        if (ten > 0) {
          chunkWords += tens[ten] + " ";
        }

        if (unit > 0) {
          chunkWords += units[unit] + " ";
        }

        if (scales[scaleIndex]) {
          chunkWords += scales[scaleIndex] + " ";
        }

        words = chunkWords + words;
      }

      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return words.trim() + (words.includes("টাকা") ? "" : "");
  };

  return (
    <div className="">
      {/* search bar */}
      <div className="bg-gray-50 md:p-6 rounded-xl">
        <div className="">
          {/* Header */}
          <div className="">
            <h1 className="text-3xl font-bold text-gray-800 ml-6">Pay now</h1>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Enter Student Id
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Student ID"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !searchTerm.trim()}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        Search
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* data */}
      <div className="px-6 mt-8">
        {studentData ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Information Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                  Student Information
                </h2>

                <div className="space-y-6">
                  {/* Student Profile Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100">
                        <Image
                          src={
                            studentData?.student?.image?.url ||
                            "/avatar-placeholder.png"
                          }
                          alt={studentData?.student?.name?.englishName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {studentData?.student?.isCadet && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Cadet
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {studentData?.student?.name?.englishName}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {studentData?.student?.name?.bengaliName}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          ID: {studentData?.student?.id}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                          {studentData?.student?.version === "bangla"
                            ? "বাংলা ভার্সন"
                            : "English Version"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Student Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Class</p>
                        <p className="font-semibold text-gray-800">
                          Class {studentData?.student?.currentClass}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Hash className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Roll Number</p>
                        <p className="font-semibold text-gray-800">
                          {studentData?.student?.rollNo}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Additional Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      {studentData?.student?.bloodGroup && (
                        <p className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium w-24">Blood Group:</span>
                          <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                            {studentData?.student?.bloodGroup}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                  Payment Information
                </h2>

                <div className="space-y-6">
                  {/* Payment Status */}
                  <div
                    className={`p-4 rounded-lg ${
                      studentData?.paymentInfo?.status === "paid"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            studentData?.paymentInfo?.status === "paid"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {studentData?.paymentInfo?.status === "paid" ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <Clock className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">
                            Payment Status
                          </h3>
                          <p
                            className={`text-sm font-semibold ${
                              studentData?.paymentInfo?.status === "paid"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {studentData?.paymentInfo?.status?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Due Amount</p>
                        <p
                          className={`text-xl font-bold ${
                            studentData?.paymentInfo?.due > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          ৳ {studentData?.paymentInfo?.due}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <p className="text-sm text-gray-600">
                            Payable Amount
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">
                          ৳ {studentData?.paymentInfo?.paybleamount}
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <p className="text-sm text-gray-600">Paid Amount</p>
                        </div>
                        <p className="text-2xl font-bold text-green-700">
                          ৳ {studentData?.paymentInfo?.paidAmount}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Payment Progress</span>
                        <span>
                          {studentData?.paymentInfo?.paidAmount} /{" "}
                          {studentData?.paymentInfo?.paybleamount}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${
                              (studentData?.paymentInfo?.paidAmount /
                                studentData?.paymentInfo?.paybleamount) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {(
                          (studentData?.paymentInfo?.paidAmount /
                            studentData?.paymentInfo?.paybleamount) *
                          100
                        ).toFixed(1)}
                        % paid
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-4">
                        Payment Actions
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {studentData?.paymentInfo?.due > 0 ? (
                          <button
                            onClick={handlePayNow}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center gap-2"
                          >
                            <DollarSign className="h-4 w-4" />
                            Print Invoice & Pay (৳{" "}
                            {studentData?.paymentInfo?.due})
                          </button>
                        ) : (
                          <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-green-700">
                              <CheckCircle className="h-5 w-5" />
                              <p className="font-medium">
                                All payments are up to date!
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mb-6 p-4 bg-gray-100 rounded-full">
              <UserX className="h-16 w-16 text-gray-400" />
            </div>

            <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />

            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No Student Found
            </h3>

            <p className="text-gray-600 max-w-md mb-6">
              We couldn&apos;t find any student matching your search criteria.
              Please check the Student ID, Name, Phone, or Roll Number and try
              again.
            </p>

            <div className="space-y-4 max-w-sm w-full">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  📝 Search Tips:
                </h4>
                <ul className="text-sm text-blue-700 text-left space-y-1">
                  <li>• Check for typos or spelling mistakes</li>
                  <li>• Try searching with partial information</li>
                  <li>• Use Student ID for most accurate results</li>
                  <li>• Contact admin if student is not in system</li>
                </ul>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 w-full"
              >
                Try Another Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeCollection;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
