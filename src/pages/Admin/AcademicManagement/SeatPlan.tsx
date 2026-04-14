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
          pixelRatio: 2, // রেজোলিউশন বাড়ানোর জন্য
          width: 794, // A4 pixel width
          height: 1123, // A4 pixel height
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

  if (isLoading) return <div className="p-20 text-center">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* কন্ট্রোল প্যানেল - এই অংশটি প্রিন্টে আসবে না */}
      <div className="no-print bg-white shadow p-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-blue-700">
              সিট প্ল্যান জেনারেটর
            </h1>
            <p className="text-xs text-gray-500">A4 পেজে ৮টি কার্ড (২x৪)</p>
          </div>

          <div className="flex gap-2">
            <select
              className="border p-2 rounded text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">সকল ক্লাস</option>
              <option value="Nursery">Nursery</option>
              <option value="One">One</option>
              {/* অন্যান্য ক্লাস */}
            </select>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading || filteredStudents.length === 0}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm disabled:bg-gray-400"
            >
              <FiDownload /> {isDownloading ? "প্রসেসিং..." : "PDF ডাউনলোড"}
            </button>

            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
            >
              <FiPrinter /> প্রিন্ট
            </button>
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
          <div className="bg-white p-10 shadow rounded">
            কোনো শিক্ষার্থী পাওয়া যায়নি
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

              {/* পেজ ফুটার */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10mm",
                  left: "0",
                  right: "0",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর: __________________________
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
    props: {}, // Page will render only on client
  };
}
