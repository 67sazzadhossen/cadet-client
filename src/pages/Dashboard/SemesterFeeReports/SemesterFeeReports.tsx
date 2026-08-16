"use client";

import React, { useState } from "react";
import {
  Search,
  Printer,
  Download,
  UserCheck,
  ShieldAlert,
  X,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  useSemesterFeeReportsQuery,
  useSaveSemesterPaymentInfoMutation,
} from "@/redux/features/payment/paymentApi";
import toast, { Toaster } from "react-hot-toast"; // 🌟 টোস্ট ইমপোর্ট করা হলো

interface StudentReport {
  studentId: string;
  studentName: {
    bengaliName?: string;
    englishName?: string;
  };
  class: string;
  version: string;
  isCadet: boolean;
  totalSemesterFee: number;
  paymentStatus: "paid" | "partial" | "pending";
  paidAmount: number;
  dueAmount: number;
}

const SemesterFeeReports = () => {
  // ফিল্টার স্টেটসমূহ
  const [year, setYear] = useState("2026");
  const [semester, setSemester] = useState("1st Semester");
  const [className, setClassName] = useState("Play");
  const [version, setVersion] = useState("bangla");
  const [isCadet, setIsCadet] = useState<string>("all");
  const [search, setSearch] = useState("");

  // 🏪 মোডাল ও পেমেন্ট রিলেটেড স্টেট
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentReport | null>(
    null,
  );
  const [amountToPay, setAmountToPay] = useState<number>(0);

  const queryParams = {
    year,
    semester,
    class: className,
    version,
    isCadet: isCadet === "all" ? undefined : isCadet,
    search: search || undefined,
  };

  // RTK Query Hooks
  const { data, isLoading, isError } = useSemesterFeeReportsQuery(queryParams);
  const [saveSemesterPayment, { isLoading: isSubmitting }] =
    useSaveSemesterPaymentInfoMutation();

  const reportsList: StudentReport[] =
    data && Array.isArray(data.data.data) ? data.data.data : [];

  // সামারি ক্যালকুলেশনস
  const totalStudents = reportsList.length;
  const totalRequired = reportsList.reduce(
    (acc, curr) => acc + (Number(curr?.totalSemesterFee) || 0),
    0,
  );
  const totalPaid = reportsList.reduce(
    (acc, curr) => acc + (Number(curr?.paidAmount) || 0),
    0,
  );
  const totalDue = reportsList.reduce(
    (acc, curr) => acc + (Number(curr?.dueAmount) || 0),
    0,
  );
  const collectionRate =
    totalRequired > 0 ? Math.round((totalPaid / totalRequired) * 100) : 0;

  // 🎯 পেমেন্ট বাটন ক্লিক হ্যান্ডলার
  const handlePayClick = (student: StudentReport) => {
    setSelectedStudent(student);
    setAmountToPay(student.dueAmount); // ডিফল্টভাবে বাঁকি টাকা ইনপুটে বসবে
    setIsModalOpen(true);
  };

  // 🚀 পেমেন্ট সাবমিট হ্যান্ডলার
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || amountToPay <= 0) return;

    const payload = {
      studentId: selectedStudent.studentId,
      amount: Number(amountToPay),
      year,
      semester,
      class: className,
      paymentType: "semesterFee", // ব্যাকএন্ড রাউটিং এর সুবিধার্থে সেফটি হিসেবে রাখা হলো
    };

    try {
      await saveSemesterPayment(payload).unwrap();
      toast.success("Payment successfully recorded!"); // 🌟 সাকসেস টোস্ট
      setIsModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("Payment submission failed:", error);
      toast.error("Failed to save payment. Please try again."); // 🌟 এরর টোস্ট
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* 🌟 টোস্ট নোটিফিকেশন কন্টেইনার হোল্ডার */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* ৫. পার্পল হেডার ব্যানার */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white flex justify-between items-center mb-6 shadow-md">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🎓 Semester Fee Management Dashboard
          </h1>
          <p className="text-purple-100 text-sm mt-1">
            Viewing {semester} reports for Class {className} (
            {version.toUpperCase()}) - {year}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* ৬. ডাইনামিক সামারিカードস */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Total Students
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {totalStudents}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Total Required
            </p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              ৳{totalRequired.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">৳</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Total Paid
            </p>
            <h3 className="text-2xl font-bold text-green-500 mt-1">
              ৳{totalPaid.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-green-50 text-green-500 rounded-lg">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Total Due
            </p>
            <h3 className="text-2xl font-bold text-red-500 mt-1">
              ৳{totalDue.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-lg">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Collection Rate
            </p>
            <h3 className="text-2xl font-bold text-purple-600 mt-1">
              {collectionRate}%
            </h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-500 rounded-lg">%</div>
        </div>
      </div>

      {/* ৭. ফিল্টার সেকশন */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Class</label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Play">Play</option>
            <option value="Nursery">Nursery</option>
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

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Version</label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="bangla">বাংলা</option>
            <option value="english">English</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Cadet Type
          </label>
          <select
            value={isCadet}
            onChange={(e) => setIsCadet(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Students</option>
            <option value="true">Cadet Only</option>
            <option value="false">Non Cadet</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs text-gray-500 font-medium">
            Search Student
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* ৮. মেইন ডাটা টেবিল */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">
            Loading reports...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            Failed to load reports from server.
          </div>
        ) : reportsList.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No students found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Student Info</th>
                  <th className="py-3 px-4 text-center">
                    {semester.toUpperCase()} AMOUNT
                  </th>
                  <th className="py-3 px-4 text-center">STATUS / ACTION</th>
                  <th className="py-3 px-4 text-center">PAID AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {reportsList.map((item) => (
                  <tr
                    key={item.studentId}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">
                        {item.studentName?.englishName || "Unknown Name"}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        ID: {item.studentId}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-600 uppercase">
                          Class: {item.class} | {item.version}
                        </span>
                        {item.isCadet && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-800">
                            Cadet
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-medium text-gray-700">
                      ৳{item.totalSemesterFee}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.paymentStatus === "paid" ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="bg-green-100 text-green-700 font-semibold text-xs px-3 py-1 rounded-full">
                            Paid
                          </span>
                          <button className="text-blue-500 text-xs underline mt-1 hover:text-blue-600">
                            📄 Receipt
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center gap-1">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded font-medium ${item.paymentStatus === "partial" ? "bg-amber-100 text-amber-700" : "bg-red-50 text-red-600"}`}
                          >
                            ৳{item.dueAmount}{" "}
                            {item.paymentStatus === "partial"
                              ? "(Partial)"
                              : "(Pending)"}
                          </span>
                          <button
                            onClick={() => handlePayClick(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1.5 rounded-lg font-semibold shadow-sm shadow-blue-200 transition"
                          >
                            Pay Now
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-medium text-gray-600">
                      ৳{item.paidAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ৯. পেমেন্ট ইনপুট মোডাল (পপ-আপ উইন্ডো) */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all scale-100">
            {/* মোডাল হেডার */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={20} /> Collect
                Semester Fee
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* স্টুডেন্ট শর্ট সামারি */}
            <div className="my-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-sm space-y-1">
              <div>
                <span className="text-gray-500">Student Name:</span>{" "}
                <strong className="text-gray-800">
                  {selectedStudent.studentName?.englishName}
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Student ID:</span>{" "}
                <strong className="text-gray-700">
                  {selectedStudent.studentId}
                </strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-gray-200 mt-2 text-xs">
                <span className="text-amber-600 font-medium">
                  Total Payable: ৳{selectedStudent.totalSemesterFee}
                </span>
                <span className="text-red-600 font-bold">
                  Current Due: ৳{selectedStudent.dueAmount}
                </span>
              </div>
            </div>

            {/* পেমেন্ট ফর্ম */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Payment Amount (৳)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedStudent.dueAmount}
                  value={amountToPay}
                  onChange={(e) => setAmountToPay(Number(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Enter amount to pay"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  * default set to total due amount. You can modify it.
                </p>
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || amountToPay <= 0}
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    "Confirm Pay"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterFeeReports;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
