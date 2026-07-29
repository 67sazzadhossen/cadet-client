/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { GraduationCap, Download, FileText } from "lucide-react";
import {
  useGetDynamicExamResultQuery,
  useGetAllExamsQuery,
} from "@/redux/features/academic/academicApi";
import logo from "@/assets/logo.png";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";

// 🟢 Typescript Interfaces for Dynamic API
interface DynamicSubjectResult {
  subjectId: string;
  subjectName: string;
  obtainedMark: number;
}

interface DynamicStudentResult {
  studentId: string;
  studentName: string;
  studentRoll: string;
  version: string;
  isCadet: boolean;
  grandTotal: number;
  position: number | string;
  subjectsResult: DynamicSubjectResult[];
  averageMark?: number | string;
}

const DynamicResult = () => {
  const [filters, setFilters] = useState({
    class: "Play",
    year: new Date().getFullYear().toString(),
    examId: "",
    version: "bangla",
    isCadet: false,
  });

  const reportRef = useRef<HTMLDivElement>(null);

  // ১. এক্সামের লিস্ট আনা (ড্রপডাউনের জন্য)
  const { data: examsRes } = useGetAllExamsQuery(filters.year);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const examsList = examsRes?.data?.data?.data || [];

  useEffect(() => {
    if (examsList.length > 0 && !filters.examId) {
      setFilters((prev) => ({ ...prev, examId: examsList[0]._id }));
    }
  }, [examsList, filters.examId]);

  // ২. ডাইনামিক রেজাল্ট ফেচিং
  const { data: response, isLoading } = useGetDynamicExamResultQuery(
    {
      class: filters.class,
      year: filters.year,
      examId: filters.examId,
    },
    { skip: !filters.examId },
  );

  // 🟢 এখানে পাথ ঠিক করা হয়েছে (এপিআই রেসপন্স অনুযায়ী)
  const rawResults: DynamicStudentResult[] =
    response?.data?.data?.data || response?.data?.data?.data?.data || [];
  const examName =
    response?.data?.examName || response?.data?.data?.examName || "Result";

  // ৩. ফিল্টারিং এবং এভারেজ ক্যালকুলেশন
  const results = rawResults
    .filter((student: DynamicStudentResult) => {
      // API থেকে আসা "N/A" বা আনডিফাইনড ভার্সনের ক্ষেত্রেও যেন ডাটা দেখায় তাই সেফটি চেক
      const studentVersion =
        student.version !== "N/A" ? student.version : filters.version;

      return (
        studentVersion.toLowerCase() === filters.version.toLowerCase() &&
        student.isCadet === filters.isCadet
      );
    })
    .map((student) => {
      const avg =
        student.subjectsResult.length > 0
          ? (student.grandTotal / student.subjectsResult.length).toFixed(2)
          : 0;
      return { ...student, averageMark: avg };
    });

  // ৪. রোল নম্বর অনুযায়ী ক্রমানুসারে সাজানো ("N/A" হ্যান্ডেল করা হয়েছে)
  const sortedSummaryResults = [...results].sort((a, b) => {
    const rollA = parseInt(a.studentRoll) || 999999;
    const rollB = parseInt(b.studentRoll) || 999999;
    return rollA - rollB;
  });

  const subjectOrder = [
    "bangla",
    "english",
    "mathem",
    "religion",
    "spoken",
    "draw",
  ];

  // ৫. সাবজেক্ট সর্টিং লজিক
  const sortedSubjects = [
    ...new Set(
      results.flatMap((student) =>
        student.subjectsResult.map((r: DynamicSubjectResult) => r.subjectName),
      ),
    ),
  ].sort((a, b) => {
    const cleanA = a.toLowerCase().trim();
    const cleanB = b.toLowerCase().trim();
    const indexA = subjectOrder.findIndex((sub) => cleanA.includes(sub));
    const indexB = subjectOrder.findIndex((sub) => cleanB.includes(sub));

    if (indexA === -1 && indexB === -1) return cleanA.localeCompare(cleanB);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const highestGrandTotal =
    results.length > 0 ? Math.max(...results.map((s) => s.grandTotal)) : 0;

  // 🟢 Download PDF (Individual Cards)
  const handleDownloadPDF = async () => {
    if (results.length === 0) {
      alert("কোনো ডাটা পাওয়া যায়নি!");
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });
      const cards = reportRef.current?.querySelectorAll(".result-card");
      if (!cards || cards.length === 0) return;

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 6;

      for (let i = 0; i < cards.length; i++) {
        const element = cards[i] as HTMLElement;

        const sigSection = element.querySelector(
          ".grid-cols-3.mt-16",
        ) as HTMLElement;
        if (sigSection) sigSection.style.opacity = "0";

        const originalBorder = element.style.border;
        const originalShadow = element.style.boxShadow;
        element.style.border = "none";
        element.style.boxShadow = "none";

        const dataUrl = await toJpeg(element, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          cacheBust: true,
        });

        if (sigSection) sigSection.style.opacity = "1";
        element.style.border = originalBorder;
        element.style.boxShadow = originalShadow;

        if (i > 0) pdf.addPage();

        pdf.setLineWidth(1.5);
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(margin, margin, pdfWidth - margin * 2, pdfHeight - margin * 2);
        pdf.rect(
          margin + 1.5,
          margin + 1.5,
          pdfWidth - (margin + 1.5) * 2,
          pdfHeight - (margin + 1.5) * 2,
        );

        const ratio = element.offsetWidth / element.offsetHeight;
        const contentWidth = pdfWidth - (margin + 4) * 2;
        const contentHeight = contentWidth / ratio;

        pdf.addImage(
          dataUrl,
          "JPEG",
          margin + 4,
          margin + 4,
          contentWidth,
          contentHeight,
          undefined,
          "FAST",
        );

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);

        const footerY = pdfHeight - 20;
        pdf.line(margin + 5, footerY, margin + 45, footerY);
        pdf.text("CLASS TEACHER'S SIGN", margin + 7, footerY + 5);
        pdf.line(pdfWidth / 2 - 20, footerY, pdfWidth / 2 + 20, footerY);
        pdf.text("REMARKS", pdfWidth / 2, footerY + 5, { align: "center" });
        pdf.line(
          pdfWidth - margin - 45,
          footerY,
          pdfWidth - margin - 5,
          footerY,
        );
        pdf.text("PRINCIPAL'S SIGN", pdfWidth - margin - 40, footerY + 5);
      }
      pdf.save(`Results_${filters.class}_${examName}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  // 🟢 Download Summary PDF
  const handleDownloadSummaryPDF = async () => {
    if (results.length === 0) {
      alert("কোনো ডাটা পাওয়া যায়নি!");
      return;
    }

    const studentsPerPage = 20;
    const totalPages = Math.ceil(sortedSummaryResults.length / studentsPerPage);

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      for (let page = 0; page < totalPages; page++) {
        const start = page * studentsPerPage;
        const end = start + studentsPerPage;
        const currentPageStudents = sortedSummaryResults.slice(start, end);

        const tempDiv = document.createElement("div");
        tempDiv.style.position = "fixed";
        tempDiv.style.left = "-9999px";
        tempDiv.style.top = "0";

        document.body.appendChild(tempDiv);

        tempDiv.innerHTML = `
        <div id="summary-page" style="width:1122px;min-height:794px;background:white;padding:32px;border:4px solid black;font-family:sans-serif;box-sizing:border-box;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid black;padding-bottom:12px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:16px;">
              <img src="${filters.version !== "english" ? logo.src : "/star_frolic.png"}" width="65" height="65" />
              <div>
                <h2 style="font-size:28px;font-weight:900;margin:0;">
                  ${filters.version !== "english" ? "গাজীপুরশাহীন ক্যাডেট একাডেমি, ময়মনসিংহ শাখা" : "STAR FROLIC ENGLISH VERSION SCHOOL"}
                </h2>
              </div>
            </div>
            <div style="font-size:12px;font-weight:bold;text-align:right;">
              <div>Class: ${filters.class}</div>
              <div>${examName} - ${filters.year}</div>
            </div>
          </div>

          <h3 style="text-align:center;border:2px solid black;padding:8px;margin-bottom:16px;font-size:22px;font-weight:900;">
            RESULT SUMMARY
          </h3>

          <table style="width:100%;border-collapse:collapse;font-size:11px;">
            <thead>
              <tr style="background:#f3f3f3;">
                <th style="border:1px solid black;padding:6px;">Roll</th>
                <th style="border:1px solid black;padding:6px;text-align:left;">Student Name</th>
                ${sortedSubjects.map((sub) => `<th style="border:1px solid black;padding:6px;">${sub}</th>`).join("")}
                <th style="border:1px solid black;padding:6px;">Total</th>
                <th style="border:1px solid black;padding:6px;">Highest</th>
                <th style="border:1px solid black;padding:6px;">Position</th>
              </tr>
            </thead>
            <tbody>
              ${currentPageStudents
                .map(
                  (student) => `
                <tr>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${student.studentRoll}</td>
                  <td style="border:1px solid black;padding:6px;font-weight:bold;">${student.studentName}</td>
                  ${sortedSubjects
                    .map((sub) => {
                      const subResult = student.subjectsResult.find(
                        (r) => r.subjectName === sub,
                      );
                      return `<td style="border:1px solid black;padding:6px;text-align:center;">${subResult ? subResult.obtainedMark : "-"}</td>`;
                    })
                    .join("")}
                  <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">${student.grandTotal}</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;">${highestGrandTotal}</td>
                  <td style="border:1px solid black;padding:6px;text-align:center;color:red;font-weight:bold;">
                    ${Number(student.position) === 1 ? "1st" : Number(student.position) === 2 ? "2nd" : Number(student.position) === 3 ? "3rd" : `${student.position}th`}
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:12px;font-weight:bold;">
            <div style="border-top:2px solid black;padding-top:6px;width:180px;text-align:center;">Class Teacher</div>
            <div style="border-top:2px solid black;padding-top:6px;width:180px;text-align:center;">Co-Ordinator</div>
            <div style="border-top:2px solid black;padding-top:6px;width:180px;text-align:center;">Director</div>
          </div>
        </div>
      `;

        const summaryElement = tempDiv.querySelector(
          "#summary-page",
        ) as HTMLElement;
        const dataUrl = await toJpeg(summaryElement, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          cacheBust: true,
        });

        if (page > 0) pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210);
        document.body.removeChild(tempDiv);
      }

      pdf.save(`Result_Summary_${filters.class}_${examName}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="text-red-600" /> Academic Results
            </h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadSummaryPDF}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 shadow-md transition-all"
              >
                <FileText size={18} /> Result Summary (PDF)
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md"
              >
                <Download size={18} /> Download Cards (PDF)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={filters.class}
              onChange={(e) =>
                setFilters({ ...filters, class: e.target.value })
              }
              className="border p-2 rounded-lg outline-none"
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

            <select
              value={filters.examId}
              onChange={(e) =>
                setFilters({ ...filters, examId: e.target.value })
              }
              className="border p-2 rounded-lg outline-none"
            >
              <option value="" disabled>
                Select Exam
              </option>
              {examsList.map((exam: any) => (
                <option key={exam._id} value={exam._id}>
                  {exam.name}
                </option>
              ))}
            </select>

            <select
              value={filters.version}
              onChange={(e) =>
                setFilters({ ...filters, version: e.target.value })
              }
              className="border p-2 rounded-lg outline-none"
            >
              <option value="bangla">Bangla Version</option>
              <option value="english">English Version</option>
            </select>

            <select
              value={filters.isCadet ? "true" : "false"}
              onChange={(e) =>
                setFilters({ ...filters, isCadet: e.target.value === "true" })
              }
              className="border p-2 rounded-lg outline-none"
            >
              <option value="false">Non-Cadet</option>
              <option value="true">Cadet</option>
            </select>

            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="border p-2 rounded-lg outline-none"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {/* Results Display (Standard Report Cards) */}
        <div ref={reportRef} className="space-y-12">
          {isLoading ? (
            <div className="bg-white p-20 text-center rounded-xl shadow-sm font-medium">
              Loading Results...
            </div>
          ) : results.length > 0 ? (
            results.map((student: DynamicStudentResult) => (
              <div
                key={student.studentId}
                className="result-card bg-white p-8 shadow-lg border-[12px] border-double border-gray-200 relative break-after-page"
              >
                {/* Header */}
                <div className="flex items-center justify-center gap-6 border-b-2 border-gray-800 pb-4 mb-6 text-center">
                  <img
                    src={
                      student.version !== "english"
                        ? logo.src
                        : "/star_frolic.png"
                    }
                    alt="Logo"
                    width={110}
                    height={80}
                    className="object-contain"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <h2 className="text-3xl font-black text-black uppercase tracking-widest leading-none">
                      {student.version !== "english"
                        ? "GAZIPURSHAHEEN CADET ACADEMY"
                        : "STAR FROLIC ENGLISH VERSION SCHOOL"}
                    </h2>
                    <p className="text-2xl font-bold text-gray-700 mt-2">
                      Mymensingh Branch
                    </p>
                    {/* 🟢 এখানে ডাইনামিক Exam Name শো করা হলো */}
                    <div className="mt-2 inline-block bg-gray-800 text-white px-6 py-1 font-bold rounded-full uppercase text-[12px]">
                      Progress Report: {examName} ({filters.year})
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-5 mb-6 text-[13px] font-semibold uppercase">
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-32">Student Name:</span>
                    <span className="border-b border-dotted border-black flex-1">
                      {student.studentName}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-32">Id No:</span>
                    <span className="border-b border-dotted border-black flex-1">
                      {student.studentId}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-32">Class:</span>
                    <span className="border-b border-dotted border-black flex-1">
                      {filters.class} ({filters.version})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-32">Roll No:</span>
                    <span className="border-b border-dotted border-black flex-1">
                      {student.studentRoll}
                    </span>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full border-collapse border-2 border-gray-800 mb-6">
                  <thead>
                    <tr className="bg-gray-100 text-[11px] uppercase font-bold text-center">
                      <th className="border border-gray-800 p-2 text-left">
                        Subject Name
                      </th>
                      <th className="border border-gray-800 p-2 w-1/3">
                        Marks Obtained
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSubjects.map((subName, idx) => {
                      const res = student.subjectsResult.find(
                        (r) =>
                          r.subjectName.toLowerCase().trim() ===
                          subName.toLowerCase().trim(),
                      );

                      if (!res) return null;

                      return (
                        <tr
                          key={idx}
                          className="text-center font-medium text-sm"
                        >
                          <td className="border border-gray-800 p-2 text-left">
                            {res.subjectName}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {res.obtainedMark}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-black">
                      <td className="border border-gray-800 p-2 text-right uppercase">
                        Grand Total:
                      </td>
                      <td className="border border-gray-800 p-2 text-center text-lg">
                        {student.grandTotal}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Summary Box & Signatures */}
                <div className="grid grid-cols-3 gap-4 mb-10 text-center font-bold text-sm ">
                  <div className="border border-gray-800 p-2 bg-gray-50">
                    <p className="text-[10px] text-gray-500">Average Mark</p>
                    <p className="text-lg">{student.averageMark}</p>
                  </div>
                  <div className="border border-gray-800 p-2 bg-gray-50">
                    <p className="text-[10px] text-gray-500">Position</p>
                    <p className="text-lg">
                      {Number(student.position) === 1
                        ? "1st"
                        : Number(student.position) === 2
                          ? "2nd"
                          : Number(student.position) === 3
                            ? "3rd"
                            : `${student.position}th`}
                    </p>
                  </div>
                  <div className="border border-gray-800 p-2 bg-gray-50">
                    <p className="text-[10px] text-gray-500">Result Status</p>
                    <p className="text-lg text-green-700">PASSED</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-16 pt-4 text-center text-xs font-bold uppercase">
                  <div className="border-t border-black pt-2">
                    Class Teacher&apos;s Sign
                  </div>
                  <div>
                    <div className="border-t border-black pt-2 italic text-[10px] normal-case font-normal"></div>
                    <div className="mt-1">Co- Ordinator&apos;s Sign</div>
                  </div>
                  <div className="border-t border-black pt-2">
                    Director&apos;s Sign
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 text-center rounded-xl shadow-sm text-gray-400 font-medium">
              No report found for this selection.
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
        .break-after-page {
          page-break-after: always;
        }
      `}</style>
    </div>
  );
};

export default DynamicResult;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
