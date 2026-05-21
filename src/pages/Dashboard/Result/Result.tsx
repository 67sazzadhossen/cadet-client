/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { GraduationCap, Printer, Download, FileText } from "lucide-react";
import { useGetResultQuery } from "@/redux/features/academic/academicApi";
import logo from "@/assets/logo.png";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";

// 🟢 Typescript Interfaces
interface SubjectResult {
  subject: string;
  monthly1: number | string;
  monthly2: number | string;
  classTest?: number | string;
  activities?: number | string;
  semester: number | string;
  totalInSubject: number;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  fathersName: string;
  mothersName: string;
  class: string;
  rollNo: string;
  version: string;
  isCadet: boolean;
  examName: string;
  year: string;
  grandTotal: number;
  averageMark: number | string;
  position: number | string;
  results: SubjectResult[];
}

const Result = () => {
  const [filters, setFilters] = useState({
    class: "Play",
    year: "2026",
    examName: "1st Semester",
    version: "bangla",
    isCadet: false,
  });

  const [showSummary, setShowSummary] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const { data: response, isLoading } = useGetResultQuery({
    class: filters.class,
    year: filters.year,
    examName: filters.examName,
  });

  const rawResults: StudentResult[] = response?.data?.data?.data || [];

  console.log(response?.data?.data.totalExamMarks);

  const results = rawResults.filter((student: StudentResult) => {
    return (
      student.version.toLowerCase() === filters.version.toLowerCase() &&
      student.isCadet === filters.isCadet
    );
  });

  // রোল নম্বর অনুযায়ী ক্রমানুসারে সাজানো (যেমনটি ইমেজে খাতার তালিকায় থাকে)
  const sortedSummaryResults = [...results].sort(
    (a, b) => Number(a.rollNo) - Number(b.rollNo),
  );

  // ইউনিক সব সাবজেক্টের নাম বের করা সামারি টেবিল হেডার তৈরির জন্য
  // ইউনিক সব সাবজেক্টের নাম বের করা সামারি টেবিল হেডার তৈরির জন্য
  const allSubjects = Array.from(
    new Set(
      results.flatMap((s: StudentResult) =>
        s.results.map((r: SubjectResult) => r.subject),
      ),
    ),
  );

  // ১. আপনার নির্দিষ্ট করা সিরিয়াল (সবচেয়ে নিরাপদ উপায়ে সম্ভাব্য ভুল বানানসহ)
  const subjectOrder = [
    "bangla",
    "english",
    "mathem", // 👈 শুধু 'mathem' রাখায় "mathematics" বা ভুল বানান "mathemetics" দুটির সাথেই নিখুঁত মিলবে
    "religion",
    "spoken",
    "draw", // 👈 "drawing" বা "drawing (oral)" সব কভার করবে
  ];

  // ২. ১০০% নিখুঁত কেস-ইনসেনসিটিভ ও টাইপো-সেফ সর্টিং লজিক
  const sortedSubjects = [
    ...new Set(
      results.flatMap((student) =>
        student.results.map((r: SubjectResult) => r.subject),
      ),
    ),
  ].sort((a, b) => {
    const cleanA = a.toLowerCase().trim();
    const cleanB = b.toLowerCase().trim();

    // includes বা startsWith ব্যবহার করে আংশিক শব্দ মিলিয়ে ইনডেক্স বের করা
    const indexA = subjectOrder.findIndex((sub) => cleanA.includes(sub));
    const indexB = subjectOrder.findIndex((sub) => cleanB.includes(sub));

    // যদি কোনো সাবজেক্ট লিস্টের সাথে না মেলে, সেটিকে ক্রমানুসারে শেষে পাঠাবে
    if (indexA === -1 && indexB === -1) return cleanA.localeCompare(cleanB);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  // বর্তমান গ্রুপের সব শিক্ষার্থীর মধ্যে সর্বোচ্চ Grand Total কত তা বের করার লজিক
  const highestGrandTotal =
    results.length > 0
      ? Math.max(...results.map((s: StudentResult) => s.grandTotal))
      : 0;

  const isJuniorClass = ["1", "2", "3", "4", "5"].includes(filters.class);

  // 🟢 বর্ডার ফুল পেজ, লেখা চ্যাপ্টা হওয়া রোধ এবং সিগনেচার ফুটারে ফিক্সড লজিক
  const handleDownloadPDF = async () => {
    if (results.length === 0) {
      alert("কোনো ডাটা পাওয়া যায়নি!");
      return;
    }
    try {
      // লোগো বা ডাইনামিক সোর্স ব্রাউজারে সেট হওয়ার জন্য সামান্য ৩০০ মিলিসেকেন্ড সময় দেওয়া
      await new Promise((resolve) => setTimeout(resolve, 300));

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });
      const cards = reportRef.current?.querySelectorAll(".result-card");
      if (!cards || cards.length === 0) return;

      const pdfWidth = 210; // A4 Width
      const pdfHeight = 297; // A4 Height
      const margin = 6; // বর্ডারের মার্জিন

      for (let i = 0; i < cards.length; i++) {
        const element = cards[i] as HTMLElement;

        // ১. সিগনেচার সেকশনটিকে স্ক্রিনশট থেকে আলাদা করার জন্য সাময়িক হাইড করা
        const sigSection = element.querySelector(
          ".grid-cols-3.mt-16",
        ) as HTMLElement;
        if (sigSection) sigSection.style.opacity = "0";

        // ডাবল বর্ডার ডাইনামিকালি PDF-এ আঁকবো, তাই HTML বর্ডার সাময়িক হাইড
        const originalBorder = element.style.border;
        const originalShadow = element.style.boxShadow;
        element.style.border = "none";
        element.style.boxShadow = "none";

        const dataUrl = await toJpeg(element, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          cacheBust: true, // 👈 এটি লোগো ক্যাশ বা পুরানো ইমেজ আটকে থাকা রোধ করবে
        });

        // সিগনেচার ও বর্ডার আবার আগের অবস্থায় ফেরত আনা
        if (sigSection) sigSection.style.opacity = "1";
        element.style.border = originalBorder;
        element.style.boxShadow = originalShadow;

        if (i > 0) pdf.addPage();

        // ২. পুরো পেজ জুড়ে নিখুঁত ডাবল বর্ডার তৈরি (Full Page Border)
        pdf.setLineWidth(1.5);
        pdf.setDrawColor(200, 200, 200); // gray-200 কালার
        pdf.rect(margin, margin, pdfWidth - margin * 2, pdfHeight - margin * 2);
        pdf.rect(
          margin + 1.5,
          margin + 1.5,
          pdfWidth - (margin + 1.5) * 2,
          pdfHeight - (margin + 1.5) * 2,
        );

        // ৩. মেইন কন্টেন্টের অ্যাসপেক্ট রেশিও হিসাব করা (যাতে লেখা চ্যাপ্টা না হয়)
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const ratio = elementWidth / elementHeight;

        const contentWidth = pdfWidth - (margin + 4) * 2;
        const contentHeight = contentWidth / ratio;

        // কন্টেন্ট পেজের টপ-এ বসবে
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

        // ৪. সিগনেচার সেকশনটি PDF-এর একেবারে নিচে (Footer) টেক্সট আকারে নিখুঁতভাবে বসানো
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);

        const footerY = pdfHeight - 20; // নিচ থেকে ২০ মিমি উপরে সিগনেচার লাইন

        // প্রথম সিগনেচার (Left aligned)
        pdf.line(margin + 5, footerY, margin + 45, footerY);
        pdf.text("CLASS TEACHER'S SIGN", margin + 7, footerY + 5);

        // মাঝখানের রিমার্কস (Center aligned)
        pdf.line(pdfWidth / 2 - 20, footerY, pdfWidth / 2 + 20, footerY);
        pdf.text("REMARKS", pdfWidth / 2, footerY + 5, { align: "center" });

        // প্রধান শিক্ষকের স্বাক্ষর (Right aligned)
        pdf.line(
          pdfWidth - margin - 45,
          footerY,
          pdfWidth - margin - 5,
          footerY,
        );
        pdf.text("PRINCIPAL'S SIGN", pdfWidth - margin - 40, footerY + 5);
      }
      pdf.save(`Results_${filters.class}_${filters.examName}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  // 🟢 রেজাল্ট সামারি PDF (A4 Landscape) ফরম্যাটে ডাউনলোড করার লজিক
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

        // temporary render data
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "fixed";
        tempDiv.style.left = "-9999px";
        tempDiv.style.top = "0";

        document.body.appendChild(tempDiv);

        tempDiv.innerHTML = `
        <div
          id="summary-page"
          style="
            width:1122px;
            min-height:794px;
            background:white;
            padding:32px;
            border:4px solid black;
            font-family:sans-serif;
            box-sizing:border-box;
          "
        >
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid black;padding-bottom:12px;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:16px;">
              <img 
                src="${
                  filters.version !== "english" ? logo.src : "/star_frolic.png"
                }"
                width="65"
                height="65"
              />
              <div>
                <h2 style="font-size:28px;font-weight:900;margin:0;">
                  ${
                    filters.version !== "english"
                      ? "গাজীপুরশাহীন ক্যাডেট একাডেমি, ময়মনসিংহ শাখা"
                      : "STAR FROLIC ENGLISH VERSION SCHOOL"
                  }
                </h2>
              </div>
            </div>

            <div style="font-size:12px;font-weight:bold;text-align:right;">
              <div>Class: ${filters.class}</div>
              <div>${filters.examName} - ${filters.year}</div>
              <div>Total Mark: ${totalExamMarks}</div>
            </div>
          </div>

          <h3 style="
            text-align:center;
            border:2px solid black;
            padding:8px;
            margin-bottom:16px;
            font-size:22px;
            font-weight:900;
          ">
            RESULT SUMMARY
          </h3>

          <table style="
            width:100%;
            border-collapse:collapse;
            font-size:11px;
          ">
            <thead>
              <tr style="background:#f3f3f3;">
                <th style="border:1px solid black;padding:6px;">Roll</th>
                <th style="border:1px solid black;padding:6px;text-align:left;">Student Name</th>

              ${sortedSubjects
                .map(
                  (sub) => `
      <th style="border:1px solid black;padding:6px;">
        ${sub}
      </th>
    `,
                )
                .join("")}

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
                  <td style="border:1px solid black;padding:6px;text-align:center;">
                    ${student.rollNo}
                  </td>

                  <td style="border:1px solid black;padding:6px;font-weight:bold;">
                    ${student.studentName}
                  </td>

                  ${sortedSubjects
                    .map((sub) => {
                      const subResult = student.results.find(
                        (r) => r.subject === sub,
                      );

                      return `
                        <td style="border:1px solid black;padding:6px;text-align:center;">
                          ${subResult ? subResult.totalInSubject : "-"}
                        </td>
                      `;
                    })
                    .join("")}

                  <td style="border:1px solid black;padding:6px;text-align:center;font-weight:bold;">
                    ${student.grandTotal}
                  </td>

                 

                  <td style="border:1px solid black;padding:6px;text-align:center;">
                    ${highestGrandTotal}
                  </td>

                 <td style="border:1px solid black;padding:6px;text-align:center;color:red;font-weight:bold;">
  ${
    Number(student.position) === 1
      ? "1st"
      : Number(student.position) === 2
        ? "2nd"
        : Number(student.position) === 3
          ? "3rd"
          : `${student.position}th`
  }
</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div style="
            display:flex;
            justify-content:space-between;
            margin-top:40px;
            font-size:12px;
            font-weight:bold;
          ">
            <div style="border-top:2px solid black;padding-top:6px;width:180px;text-align:center;">
              Class Teacher
            </div>

            <div style="border-top:2px solid black;padding-top:6px;width:180px;text-align:center;">
              Co-Ordinator
            </div>

            <div style="border-top:2px solid black;padding-top:6px;width:180px;text-align:center;">
              Director
            </div>
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

        if (page > 0) {
          pdf.addPage();
        }

        pdf.addImage(dataUrl, "JPEG", 0, 0, 297, 210);

        document.body.removeChild(tempDiv);
      }

      pdf.save(`Result_Summary_${filters.class}_${filters.year}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  const totalExamMarks = response?.data?.data.totalExamMarks;

  console.log("Calculated Total Mark:", totalExamMarks);

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="text-red-600" /> Academic Management
            </h1>
            <div className="flex flex-wrap gap-2">
              {/* 🟢 নতুন বাটন: Summary PDF (Landscape) */}
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
              value={filters.examName}
              onChange={(e) =>
                setFilters({ ...filters, examName: e.target.value })
              }
              className="border p-2 rounded-lg outline-none"
            >
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
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

        {/* 🟢 A4 Landscape (297mm x 210mm) অনুপাত বজায় রেখে ডিজাইন করা হিডেন সামারি সেকশন */}
        {showSummary && (
          <div className="fixed -left-[9999px] top-0">
            <div
              ref={summaryRef}
              className="w-[1122px] h-[794px] p-8 bg-white border-[4px] border-black text-black flex flex-col justify-between"
              style={{ fontFamily: "'Noto Serif Bengali', serif, sans-serif" }}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        filters.version !== "english"
                          ? logo.src
                          : "/star_frolic.png"
                      }
                      alt="Logo"
                      width={65}
                      height={65}
                      crossOrigin="anonymous"
                    />
                    <div>
                      <h2 className="text-2xl font-black tracking-wide">
                        {filters.version !== "english"
                          ? "গাজীপুরশাহীন ক্যাডেট একাডেমি, ময়মনসিংহ শাখা"
                          : "STAR FROLIC ENGLISH VERSION SCHOOL, MYMENSINGH BRANCH"}
                      </h2>
                    </div>
                  </div>
                  <div className="text-right font-bold text-xs space-y-1">
                    <div>
                      {filters.version !== "english" ? "শ্রেণি: " : "Class: "}
                      <span className="underline">{filters.class}</span>
                    </div>
                    <div>
                      {filters.version !== "english" ? "পরীক্ষা: " : "Exam: "}{" "}
                      <span className="underline">
                        {filters.examName} - {filters.year}
                      </span>
                    </div>
                    <div>
                      {filters.version !== "english" ? "ভার্সন: " : "Version: "}{" "}
                      <span className="underline">
                        {filters.version.toUpperCase()}
                      </span>{" "}
                      {filters.class === "6" && (
                        <>
                          {filters.version !== "english" ? (
                            <>({filters.isCadet ? "ক্যাডেট" : "নন-ক্যাডেট"})</>
                          ) : (
                            <>({filters.isCadet ? "Cadet" : "Non-Cadet"})</>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-center text-lg font-extrabold border-2 border-black py-1 bg-gray-100 mb-4 uppercase tracking-wider">
                  Result Summary
                </h3>

                {/* Ledger Table */}
                <table className="w-full border-collapse border-2 border-black text-xs">
                  <thead>
                    <tr className="bg-gray-100 font-bold text-center">
                      <th className="border border-black p-2 w-16">
                        {filters.version !== "english" ? "রোল নং" : "Roll No"}
                      </th>
                      <th className="border border-black p-2 text-left">
                        {filters.version !== "english"
                          ? "শিক্ষার্থীর নাম"
                          : "Student Name"}
                      </th>
                      {sortedSubjects.map((sub, i) => (
                        <th
                          key={i}
                          className="border border-black p-1 max-w-[85px] break-words"
                        >
                          {sub}
                        </th>
                      ))}
                      <th className="border border-black p-2 bg-gray-200 font-black w-24">
                        {filters.version !== "english"
                          ? "মোট নম্বর"
                          : "Grand Total"}
                      </th>
                      <th className="border border-black p-2 bg-gray-200 font-black w-20">
                        {filters.version !== "english"
                          ? "গড় নম্বর"
                          : "Avg Mark"}
                      </th>
                      <th className="border border-black p-2 bg-green-50 font-black w-24">
                        {filters.version !== "english"
                          ? "সর্বোচ্চ নম্বর"
                          : "Highest Mark"}
                      </th>
                      <th className="border border-black p-2 bg-amber-100 font-black w-20">
                        {filters.version !== "english"
                          ? "মেধা স্থান"
                          : "Position"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSummaryResults.map((student: StudentResult) => (
                      <tr
                        key={student.studentId}
                        className="text-center font-semibold hover:bg-gray-50"
                      >
                        <td className="border border-black p-1.5">
                          {student.rollNo}
                        </td>
                        <td className="border border-black p-1.5 text-left font-bold">
                          {student.studentName}
                        </td>
                        {sortedSubjects.map((sub, i) => {
                          const subResult = student.results.find(
                            (r) =>
                              r.subject.toLowerCase().trim() ===
                              sub.toLowerCase().trim(),
                          );
                          return (
                            <td key={i} className="border border-black p-1.5">
                              {subResult ? subResult.totalInSubject : "-"}
                            </td>
                          );
                        })}
                        <td className="border border-black p-1.5 bg-gray-50 font-bold">
                          {student.grandTotal}
                        </td>
                        <td className="border border-black p-1.5 bg-gray-50">
                          {student.averageMark}
                        </td>
                        <td className="border border-black p-1.5 bg-green-50 font-bold">
                          {highestGrandTotal}
                        </td>
                        <td className="border border-black p-1.5 bg-amber-50 font-black text-red-700">
                          $
                          {Number(student.position) === 1
                            ? "1st"
                            : Number(student.position) === 2
                              ? "2nd"
                              : Number(student.position) === 3
                                ? "3rd"
                                : `${student.position}th`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures at the bottom edge */}
              <div className="flex justify-between items-center mt-auto pb-2 px-4 text-xs font-bold">
                <div className="border-t-2 border-black pt-1 w-48 text-center">
                  {filters.version !== "english"
                    ? "শ্রেণি শিক্ষকের স্বাক্ষর"
                    : "Class Teacher's Sign"}
                </div>
                <div className="border-t-2 border-black pt-1 w-48 text-center">
                  {filters.version !== "english"
                    ? "শাখা প্রধানের স্বাক্ষর"
                    : "Co-Ordinator's Sign"}
                </div>
                <div className="border-t-2 border-black pt-1 w-48 text-center">
                  {filters.version !== "english"
                    ? "পরিচালকের স্বাক্ষর"
                    : "Director Sign"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display (Standard Report Cards) */}
        <div ref={reportRef} className="space-y-12">
          {results.length > 0
            ? results.map((student: StudentResult) => (
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
                      alt="GSCA Logo"
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
                      <div className="mt-2 inline-block bg-gray-800 text-white px-6 py-1 font-bold rounded-full uppercase text-[12px]">
                        Progress Report: {student.examName} ({student.year})
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
                    <div className="flex gap-2 hidden">
                      <span className="text-gray-500 w-32">
                        Father&apos;s Name:
                      </span>
                      <span className="border-b border-dotted border-black flex-1">
                        {student.fathersName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Class:</span>
                      <span className="border-b border-dotted border-black flex-1">
                        {student.class} ({student.version})
                      </span>
                    </div>
                    <div className="flex gap-2 hidden">
                      <span className="text-gray-500 w-32">
                        Mother&apos;s Name:
                      </span>
                      <span className="border-b border-dotted border-black flex-1">
                        {student.mothersName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Roll No:</span>
                      <span className="border-b border-dotted border-black flex-1">
                        {student.rollNo}
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
                        <th className="border border-gray-800 p-2">
                          1st Monthly
                        </th>
                        <th className="border border-gray-800 p-2">
                          2nd Monthly
                        </th>
                        {isJuniorClass && (
                          <>
                            <th className="border border-gray-800 p-2">
                              Class Test
                            </th>
                            <th className="border border-gray-800 p-2">
                              Activities
                            </th>
                          </>
                        )}
                        <th className="border border-gray-800 p-2">Semester</th>
                        <th className="border border-gray-800 p-2 bg-gray-200">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 🟢 ফিক্সড কোড (সর্ট করা সাবজেক্ট অনুযায়ী ডাটা খোঁজা হচ্ছে) */}
                      {sortedSubjects.map((subName, idx) => {
                        // বর্তমান শিক্ষার্থীর results থেকে সর্ট করা সাবজেক্টের অবজেক্টটি খুঁজে বের করা
                        const res = student.results.find(
                          (r) =>
                            r.subject.toLowerCase().trim() ===
                            subName.toLowerCase().trim(),
                        );

                        // যদি কোনো শিক্ষার্থীর ঐ সাবজেক্টের ডাটা না থাকে, তবে রো-টি স্কিপ বা খালি দেখাবে
                        if (!res) return null;

                        return (
                          <tr
                            key={idx}
                            className="text-center font-medium text-sm"
                          >
                            <td className="border border-gray-800 p-2 text-left">
                              {res.subject}
                            </td>
                            <td className="border border-gray-800 p-2">
                              {res.monthly1}
                            </td>
                            <td className="border border-gray-800 p-2">
                              {res.monthly2}
                            </td>
                            {isJuniorClass && (
                              <>
                                <td className="border border-gray-800 p-2">
                                  {res.classTest || "-"}
                                </td>
                                <td className="border border-gray-800 p-2">
                                  {res.activities || "-"}
                                </td>
                              </>
                            )}
                            <td className="border border-gray-800 p-2">
                              {res.semester}
                            </td>
                            <td className="border border-gray-800 p-2 bg-gray-100 font-bold">
                              {res.totalInSubject}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-black">
                        <td
                          colSpan={isJuniorClass ? 5 : 3}
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

                  {/* Summary & Signatures */}
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
            : !isLoading && (
                <div className="bg-white p-20 text-center rounded-xl shadow-sm text-gray-400 font-medium">
                  No report found.
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

export default Result;

export async function getServerSideProps() {
  return {
    props: {},
  };
}
