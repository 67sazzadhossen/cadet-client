"use client";

import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import { TStudent } from "@/types/index.type";
import React, { useRef, useState } from "react";
import { FiSearch, FiFilter, FiPrinter, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";
import SeatCard from "@/components/SeatCard";

const SeatPlan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<
    "bangla" | "english" | ""
  >("");
  const [studentType, setStudentType] = useState<"all" | "cadet" | "general">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExam, setSelectedExam] = useState("");
  const [cardVariant, setCardVariant] = useState<
    "default" | "compact" | "detailed"
  >("default");
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const query = {
    limit: 1000,
    search: searchTerm,
    class: selectedClass,
    version: selectedVersion,
  };

  const { data, isLoading } = useGetAllStudentsQuery(query);
  const allStudents: TStudent[] = data?.data?.data?.data || [];

  const filteredStudents = allStudents.filter((student) => {
    return (
      (!selectedClass || student.currentClass === selectedClass) &&
      (!selectedVersion || student.version === selectedVersion) &&
      (studentType === "all" ||
        (studentType === "cadet" && student.isCadet === true) ||
        (studentType === "general" && student.isCadet === false)) &&
      (!searchTerm ||
        student.name.englishName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // ৮ জন করে পেজ ভাগ করা (২ কলাম ৪ সারি)
  const studentsPerPage = 8;
  const pages = [];
  for (let i = 0; i < filteredStudents.length; i += studentsPerPage) {
    pages.push(filteredStudents.slice(i, i + studentsPerPage));
  }

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedVersion("");
    setStudentType("all");
    setSelectedExam("");
  };

  const handleDownloadPDF = async () => {
    if (filteredStudents.length === 0) return;
    setIsDownloading(true);

    try {
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pages_elements =
        printRef.current?.querySelectorAll(".seat-plan-page");
      if (!pages_elements) return;

      for (let i = 0; i < pages_elements.length; i++) {
        const element = pages_elements[i] as HTMLElement;

        const dataUrl = await toJpeg(element, {
          quality: 1.0,
          pixelRatio: 2,
          width: 794,
          height: 1123,
        });

        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297);
      }

      pdf.save(`Seat_Plan_${selectedClass || "All"}.pdf`);
    } catch (error) {
      console.error("PDF Failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Seat Plan - Print</title>
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; }
              .seat-plan-page { 
                width: 210mm; 
                height: 297mm; 
                page-break-after: always; 
                overflow: hidden;
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>${printContent.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* কন্ট্রোল প্যানেল - এই অংশটি প্রিন্টে আসবে না */}
      <div className="no-print bg-white shadow-md border-b sticky top-0 z-30">
        <div className="px-4 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  সিট প্ল্যান জেনারেটর
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  পরীক্ষার সিট প্ল্যান তৈরি ও প্রিন্ট করুন (প্রতি পৃষ্ঠায় ৮ জন)
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={cardVariant}
                  onChange={(e) => setCardVariant(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="compact">কম্প্যাক্ট কার্ড</option>
                  <option value="default">ডিফল্ট কার্ড</option>
                  <option value="detailed">ডিটেইলড কার্ড</option>
                </select>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || filteredStudents.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiDownload size={16} />
                  <span>
                    {isDownloading ? "ডাউনলোড হচ্ছে..." : "PDF ডাউনলোড"}
                  </span>
                </button>

                <button
                  onClick={handlePrint}
                  disabled={filteredStudents.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPrinter size={16} />
                  <span>প্রিন্ট করুন</span>
                </button>
              </div>
            </div>

            {/* Search Bar - Same as AdmitCards */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="নাম, আইডি বা রোল নম্বর দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 border rounded-xl relative transition-all ${
                  showFilters
                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <FiFilter size={18} />
                {(selectedClass ||
                  selectedVersion ||
                  studentType !== "all" ||
                  selectedExam) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {
                      [
                        selectedClass,
                        selectedVersion,
                        studentType !== "all" ? 1 : null,
                        selectedExam,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel - Same as AdmitCards with Student Type added */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">ফিল্টার অপশন</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    সব রিসেট
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      ক্লাস নির্বাচন করুন
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">সব ক্লাস</option>
                      {[
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
                      ].map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      ভার্সন
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedVersion === "bangla"}
                          onChange={() =>
                            setSelectedVersion(
                              selectedVersion === "bangla" ? "" : "bangla",
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">বাংলা</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedVersion === "english"}
                          onChange={() =>
                            setSelectedVersion(
                              selectedVersion === "english" ? "" : "english",
                            )
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">English</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      শিক্ষার্থীর ধরন
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="studentType"
                          checked={studentType === "all"}
                          onChange={() => setStudentType("all")}
                          className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">সব</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="studentType"
                          checked={studentType === "cadet"}
                          onChange={() => setStudentType("cadet")}
                          className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">ক্যাডেট</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="studentType"
                          checked={studentType === "general"}
                          onChange={() => setStudentType("general")}
                          className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">জেনারেল</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar - Same as AdmitCards */}
          <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                মোট {filteredStudents.length} জন শিক্ষার্থী | {pages.length} টি
                পৃষ্ঠা
              </span>
            </div>
            <span className="text-gray-500">
              প্রতি পৃষ্ঠায় ৮ জন করে (৪ সারি × ২ কলাম)
            </span>
          </div>
        </div>
      </div>

      {/* মেইন পেপার কন্টেইনার */}
      <div
        ref={printRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {pages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm m-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiDownload className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium text-lg">
              কোনো শিক্ষার্থী পাওয়া যায়নি
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm ||
              selectedClass ||
              selectedVersion ||
              studentType !== "all"
                ? "অন্য ফিল্টার দিয়ে চেষ্টা করুন"
                : "শিক্ষার্থী যোগ করুন"}
            </p>
          </div>
        ) : (
          pages.map((pageStudents, pageIndex) => (
            <div
              key={pageIndex}
              className="seat-plan-page shadow-2xl"
              style={{
                width: "210mm",
                height: "297mm",
                padding: "10mm",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* কার্ড গ্রিড - এখানে ফিক্সড মেজারমেন্ট ব্যবহার করা হয়েছে */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr", // ২ কলাম
                  gridTemplateRows: "repeat(4, 1fr)", // ৪ সারি
                  gap: "8mm", // কার্ডের মাঝখানের গ্যাপ
                  justifyItems: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {pageStudents.map((student, idx) => (
                  <SeatCard
                    key={student.id}
                    student={student}
                    examName="1st Semester - 2026"
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SeatPlan;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
