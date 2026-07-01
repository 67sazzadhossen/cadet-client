"use client";

import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import { TStudent } from "@/types/index.type";

import React, { useRef, useState } from "react";
import { FiSearch, FiFilter, FiPrinter, FiDownload } from "react-icons/fi";

import jsPDF from "jspdf";
import { toPng } from "html-to-image";

import AdmitCard from "@/components/AdmitCard";
import { toJpeg } from "html-to-image"; // toPng এর বদলে toJpeg

const AdmitCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<
    "bangla" | "english" | ""
  >("");
  const [studentType, setStudentType] = useState<"all" | "cadet" | "general">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const query = {
    limit: 100,
    search: searchTerm,
    class: selectedClass,
    version: selectedVersion,
  };

  const { data, isLoading } = useGetAllStudentsQuery(query);
  const allStudents: TStudent[] = data?.data?.data?.data || [];

  // ✅ Filter
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

  const handleDownloadPDF = async () => {
    if (filteredStudents.length === 0) return;
    setIsDownloading(true);

    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // `.a4-page` ক্লাস যুক্ত সব কন্টেইনার ধরুন
      const pages = printRef.current?.querySelectorAll(".a4-page");
      if (!pages) return;

      for (let i = 0; i < pages.length; i++) {
        const pageElement = pages[i] as HTMLElement;

        // প্রতিটি পেজকে ইমেজে রূপান্তর করুন
        const dataUrl = await toPng(pageElement, {
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });

        if (i > 0) pdf.addPage();

        // A4 সাইজ (210x297mm)
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(
          dataUrl,
          "PNG",
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          "FAST",
        );
      }

      pdf.save("Admit_Cards.pdf");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("PDF তৈরিতে সমস্যা হয়েছে।");
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ Print
  //   const handlePrint = useReactToPrint({
  //     content: () => printRef.current,
  //     pageStyle: `
  //       @page {
  //         size: A4;
  //         margin: 0;
  //       }
  //       @media print {
  //         body {
  //           margin: 0;
  //           padding: 0;
  //         }
  //         .no-print {
  //           display: none;
  //         }
  //         .print-container {
  //           margin: 0;
  //           padding: 0;
  //         }
  //       }
  //     `,
  //   });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedVersion("");
    setStudentType("all");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Only visible on screen */}
      <div className="bg-white shadow-md rounded-2xl border-b lg:fixed z-20 to lg:right-10 lg:mt-5 lg:h-screen w-2/10 print:hidden">
        <div className="px-4 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  অ্যাডমিট কার্ড
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  পরীক্ষার অ্যাডমিট কার্ড তৈরি ও প্রিন্ট করুন
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={filteredStudents.length === 0 || isDownloading}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiDownload size={16} />
                  <span>
                    {isDownloading ? "ডাউনলোড হচ্ছে..." : "PDF ডাউনলোড"}
                  </span>
                </button>
                <button
                  disabled={filteredStudents.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPrinter size={16} />
                  <span>প্রিন্ট করুন</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="নাম, আইডি বা ফোন নম্বর দিয়ে খুঁজুন..."
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
                  studentType !== "all") && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {(selectedClass ? 1 : 0) +
                      (selectedVersion ? 1 : 0) +
                      (studentType !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
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

                <div className="space-y-4">
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

          {/* Stats Bar */}
          <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                মোট {filteredStudents.length} জন শিক্ষার্থী
              </span>
            </div>
            <span className="text-gray-500">
              প্রিন্টের জন্য ২ টি কার্ড প্রতি A4 পৃষ্ঠায়
            </span>
          </div>
        </div>
      </div>

      {/* Printable Admit Cards Container */}
      <div ref={printRef}>
        {filteredStudents.length === 0 ? (
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
          Array.from({ length: Math.ceil(filteredStudents.length / 2) }).map(
            (_, pageIndex) => {
              const pageStudents = filteredStudents.slice(
                pageIndex * 2,
                pageIndex * 2 + 2,
              );

              return (
                <div
                  key={pageIndex}
                  className="a4-page"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5mm", // কাটার জন্য gap
                    background: "#fff",
                    overflow: "hidden",
                    padding: "5px",
                  }}
                >
                  {pageStudents.map((student) => (
                    <AdmitCard key={student._id} student={student} />
                  ))}
                </div>
              );
            },
          )
        )}
      </div>
    </div>
  );
};

export default AdmitCards;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
