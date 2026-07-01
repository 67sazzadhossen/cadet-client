/* eslint-disable @next/next/no-img-element */
"use client";

import star from "@/assets/star_frolic_logo.png";
import gscam from "@/assets/logo copy.png";
import signature from "@/assets/signatures/jubayet.png";
import Image from "next/image";

const AdmitCard = ({ student }: { student: any }) => {
  const examName = "Monthly Test 4 - June 2026";
  const session = "2026";
  const studentPhoto = student.image?.url || "/student-placeholder.png";

  return (
    <div
      className="m-4 relative overflow-hidden"
      style={{
        width: "100%",
        height: "146mm",
        margin: 0,
        boxSizing: "border-box",
        border: "6px double #1e3a8a",
        backgroundColor: "white",
      }}
    >
      {/* জলছাপ (Watermark) লেয়ার */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <img
          src={student.version === "english" ? star.src : gscam.src}
          alt="watermark"
          className="w-[60%] h-auto"
        />
      </div>

      {/* মূল কন্টেন্ট */}
      <div
        className="relative"
        style={{
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        {/* TOP HEADER */}
        <div className="flex border-b-4 border-blue-900 bg-blue-50 py-2">
          <div className="w-[15%] p-2 flex justify-center items-center">
            <img
              src={student.version === "english" ? star.src : gscam.src}
              alt="logo"
              className="drop-shadow-md"
            />
          </div>

          <div className="w-[70%] text-center flex flex-col justify-center">
            <h1 className="text-2xl font-black whitespace-nowrap uppercase text-blue-900 tracking-wider">
              {student.version === "english"
                ? "Star Frolic English Version School"
                : "GazipurShaheen Cadet Academy"}
            </h1>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-widest bg-white inline-block mx-auto px-4 mt-1 border-b border-blue-900">
              Mymensingh Branch
            </p>
            <div className="mt-3 flex justify-center">
              <span className="bg-blue-900 text-white font-black text-xl px-10 py-1 uppercase rounded-sm shadow-[3px_3px_0px_0px_rgba(30,58,138,0.5)]">
                Admit Card
              </span>
            </div>
          </div>

          <div className="w-[25%] p-2 flex flex-col items-center">
            <div className="border-4 border-blue-900 p-0.5 shadow-lg">
              <img
                src={studentPhoto}
                alt="Student"
                style={{ width: "85px", height: "105px", objectFit: "cover" }}
              />
            </div>
            <p className="text-[10px] font-bold mt-2 bg-blue-900 text-white px-2 py-0.5 rounded">
              ID: {student.id}
            </p>
          </div>
        </div>

        {/* INFO GRID SECTION */}
        <div className="text-black text-sm p-2 flex-grow">
          <div className="flex border-b border-gray-300">
            <div className="w-1/2 p-2 font-bold">Session: {session}</div>
            <div className="w-1/2 p-2 font-bold border-l border-gray-300">
              Exam: {examName}
            </div>
          </div>

          <div className="flex border-b border-gray-300">
            <div className="w-1/2 p-2 font-bold">
              Class: {student.currentClass}
            </div>
            <div className="w-1/2 p-2 font-bold border-l border-gray-300 bg-gray-50">
              Student Id: {student.id}
            </div>
          </div>

          <div className="flex">
            <div className="flex border-b border-gray-300 w-1/2">
              <div className="w-full p-2 font-bold">
                Student Name:{" "}
                <span className="uppercase text-blue-900">
                  {student.name.englishName}
                </span>
              </div>
            </div>
            <div className="flex border-b border-gray-300 w-1/2 border-l">
              <div className="w-full p-2 font-bold">
                Class Roll No.: {student.rollNo}
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-1/2 p-2 font-bold border-gray-300">
              Father&apos;s Name: {student.guardian?.father?.name?.englishName}
            </div>
            <div className="w-1/2 p-2 font-bold border-l border-gray-300">
              Mother&apos;s Name: {student.guardian?.mother?.name?.englishName}
            </div>
          </div>
        </div>

        {/* RULES & SIGNATURE SECTION */}
        <div className="flex h-[130px] border-t-2 border-blue-900 bg-gray-50">
          <div className="w-[65%] p-3 text-[12px] font-semibold text-gray-800 border-r border-gray-300">
            <p>
              ★{" "}
              {student.version === "english"
                ? "Students must enter the examination hall at least 15 minutes before."
                : "পরীক্ষা শুরু হওয়ার কমপক্ষে ১৫ মিনিট পূর্বে হলে প্রবেশ করতে হবে।"}
            </p>
            <p>
              ★{" "}
              {student.version === "english"
                ? "No extra papers allowed."
                : "প্রবেশপত্র ছাড়া কোন কাগজপত্র পরীক্ষা কেন্দ্রে বহন করা যাবে না।"}
            </p>
            <p>
              ★{" "}
              {student.version === "english"
                ? "Bring pen, pencil & geometry box."
                : "প্রত্যেক পরীক্ষার্থীকে প্রয়োজনীয় কলম, পেন্সিল ও জ্যামিতি বক্স আনতে হবে।"}
            </p>
          </div>

          <div className="w-[35%] p-2 flex flex-col justify-center items-center text-center">
            <Image
              src={signature}
              alt="sign"
              width={100}
              height={100}
              className="ml-2"
            />
            <div className="border-t-2 border-blue-900 w-[80%] mt-1">
              <p className="font-black text-xs uppercase text-blue-900">
                Director
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitCard;
