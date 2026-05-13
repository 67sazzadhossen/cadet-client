"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { GraduationCap, BookOpen, Printer, Download } from "lucide-react";
import { useGetResultQuery } from "@/redux/features/academic/academicApi";
import logo from "@/assets/logo.png";

const Result = () => {
  const [filters, setFilters] = useState({
    class: "Play",
    year: "2026",
    examName: "1st Semester",
    version: "bangla",
    isCadet: false,
  });

  const reportRef = useRef<HTMLDivElement>(null); // PDF করার জন্য কন্টেইনার রেফারেন্স

  const {
    data: response,
    isLoading,
    isError,
  } = useGetResultQuery({
    class: filters.class,
    year: filters.year,
    examName: filters.examName,
  });

  const rawResults = response?.data?.data?.data || [];

  const results = rawResults.filter((student: any) => {
    return (
      student.version.toLowerCase() === filters.version.toLowerCase() &&
      student.isCadet === filters.isCadet
    );
  });

  const handlePrint = () => {
    window.print();
  };

  // PDF ডাউনলোড ফাংশন
  const handleDownloadPDF = async () => {
    // শুধুমাত্র ক্লায়েন্ট সাইডে লাইব্রেরিটি ইমপোর্ট করবে
    const html2pdf = (await import("html2pdf.js")).default;
    const element = reportRef.current;

    const opt = {
      margin: 0.2,
      filename: `Results_${filters.class}_${filters.examName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }, // CSS এর break-after-page প্রপার্টি ফলো করবে
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <GraduationCap className="text-red-600" /> Academic Management
              </h1>
            </div>

            <div className="flex gap-2">
              {/* নতুন PDF ডাউনলোড বাটন */}
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md"
              >
                <Download size={18} /> Download PDF
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition-all shadow-md"
              >
                <Printer size={18} /> Print All Results
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={filters.class}
              onChange={(e) =>
                setFilters({ ...filters, class: e.target.value })
              }
              className="border p-2 rounded-lg outline-none focus:ring-2 ring-red-100"
            >
              <option value="Play">Play</option>
              <option value="Nursery">Nursery</option>
            </select>

            <select
              value={filters.version}
              onChange={(e) =>
                setFilters({ ...filters, version: e.target.value })
              }
              className="border p-2 rounded-lg outline-none focus:ring-2 ring-red-100"
            >
              <option value="bangla">Bangla Version</option>
              <option value="english">English Version</option>
            </select>

            <select
              value={filters.isCadet ? "true" : "false"}
              onChange={(e) =>
                setFilters({ ...filters, isCadet: e.target.value === "true" })
              }
              className="border p-2 rounded-lg outline-none focus:ring-2 ring-red-100"
            >
              <option value="false">Non-Cadet</option>
              <option value="true">Cadet</option>
            </select>

            <select
              value={filters.examName}
              onChange={(e) =>
                setFilters({ ...filters, examName: e.target.value })
              }
              className="border p-2 rounded-lg outline-none focus:ring-2 ring-red-100"
            >
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
            </select>

            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="border p-2 rounded-lg outline-none focus:ring-2 ring-red-100"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {/* Results Display */}
        {isLoading && (
          <div className="text-center py-20 font-semibold">
            Loading Results...
          </div>
        )}
        {isError && (
          <div className="text-center py-20 text-red-500">
            Error loading data!
          </div>
        )}

        <div ref={reportRef} className="space-y-12">
          {results.length > 0
            ? results.map((student: any) => (
                <div
                  key={student.studentId}
                  className="bg-white p-8 shadow-lg border-[12px] border-double border-gray-200 relative print:shadow-none print:border-gray-300 print:m-0 break-after-page"
                >
                  {/* School Header with Logo */}
                  <div className="flex items-center justify-center gap-6 border-b-2 border-gray-800 pb-4 mb-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={logo}
                        alt="GSCA Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>

                    <div className="text-center">
                      <h2 className="text-3xl font-black text-black pt-5 uppercase tracking-widest leading-none">
                        GAZIPURSHAHEEN CADET ACADEMY
                      </h2>
                      <p className="text-sm font-bold text-gray-700 mt-2">
                        Mymensingh Branch, Bangladesh
                      </p>
                      <div className="mt-2 inline-block bg-gray-800 text-white px-6 py-1 font-bold rounded-full uppercase text-[12px]">
                        Progress Report: {student.examName} ({student.year})
                      </div>
                    </div>
                  </div>

                  {/* Student Info Grid */}
                  <div className="grid grid-cols-2 gap-y-3 mb-6 text-[13px] font-semibold uppercase">
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Student Name:</span>
                      <span className="text-gray-900 border-b border-dotted border-black flex-1">
                        {student.studentName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Admission No:</span>
                      <span className="text-gray-900 border-b border-dotted border-black flex-1">
                        {student.studentId}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Father's Name:</span>
                      <span className="text-gray-900 border-b border-dotted border-black flex-1">
                        {student.fathersName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Class:</span>
                      <span className="text-gray-900 border-b border-dotted border-black flex-1">
                        {student.class} ({student.version})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Mother's Name:</span>
                      <span className="text-gray-900 border-b border-dotted border-black flex-1">
                        {student.mothersName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Roll No:</span>
                      <span className="text-gray-900 border-b border-dotted border-black flex-1">
                        {student.rollNo}
                      </span>
                    </div>
                  </div>

                  {/* Marksheet Table */}
                  <table className="w-full border-collapse border-2 border-gray-800 mb-6">
                    <thead>
                      <tr className="bg-gray-100 text-[11px] uppercase font-bold">
                        <th className="border border-gray-800 p-2 text-left">
                          Subject Name
                        </th>
                        <th className="border border-gray-800 p-2">
                          Monthly 1
                        </th>
                        <th className="border border-gray-800 p-2">
                          Monthly 2
                        </th>
                        <th className="border border-gray-800 p-2">
                          Class Test
                        </th>
                        <th className="border border-gray-800 p-2">Semester</th>
                        <th className="border border-gray-800 p-2 bg-gray-200">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.results.map((res: any, idx: number) => (
                        <tr
                          key={idx}
                          className="text-center font-medium text-sm"
                        >
                          <td className="border border-gray-800 p-2 text-left flex items-center gap-2">
                            <BookOpen
                              size={14}
                              className="print:hidden text-gray-400"
                            />{" "}
                            {res.subject}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {res.monthly1}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {res.monthly2}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {res.classTest}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {res.semester}
                          </td>
                          <td className="border border-gray-800 p-2 font-bold bg-gray-50">
                            {res.totalInSubject}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-black">
                        <td
                          colSpan={5}
                          className="border border-gray-800 p-2 text-right uppercase"
                        >
                          Grand Total:
                        </td>
                        <td className="border border-gray-800 p-2 text-center text-lg">
                          {student.grandTotal}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Summary Info */}
                  <div className="grid grid-cols-3 gap-4 mb-10 text-center font-bold text-sm uppercase">
                    <div className="border border-gray-800 p-2 bg-gray-50">
                      <p className="text-[10px] text-gray-500">Average Mark</p>
                      <p className="text-lg">{student.averageMark}</p>
                    </div>
                    <div className="border border-gray-800 p-2 bg-gray-50">
                      <p className="text-[10px] text-gray-500">Position</p>
                      <p className="text-lg">#{student.position}</p>
                    </div>
                    <div className="border border-gray-800 p-2 bg-gray-50">
                      <p className="text-[10px] text-gray-500">Result Status</p>
                      <p className="text-lg text-green-700">PASSED</p>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 gap-8 mt-16 pt-4 text-center text-xs font-bold uppercase">
                    <div>
                      <div className="border-t border-black pt-2">
                        Class Teacher's Sign
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-black pt-2 italic text-[10px] normal-case font-normal">
                        "Good performance. Keep it up."
                      </div>
                      <div className="mt-1">Remarks</div>
                    </div>
                    <div>
                      <div className="border-t border-black pt-2">
                        Principal's Sign
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : !isLoading && (
                <div className="bg-white p-20 text-center rounded-xl shadow-sm text-gray-400 font-medium">
                  No report found for the selected criteria.
                </div>
              )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
          }
          .print\:hidden {
            display: none !important;
          }
        }
        /* PDF এ পেজ ব্রেক ঠিক রাখার জন্য */
        .break-after-page {
          page-break-after: always;
        }
      `}</style>
    </div>
  );
};

export default Result;
