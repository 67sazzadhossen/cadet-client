"use client";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import logo from "@/assets/id_card_logo.png";
import star from "@/assets/star_frolic.png";
import signature from "@/assets/sign.jpg";
import { domToPng } from "modern-screenshot";
import { FiDownload } from "react-icons/fi";
import { TStudent } from "@/types/index.type";
import fahima from "@/assets/signatures/fahima.png";
import jubayet from "@/assets/signatures/jubayet.png";

interface StudentIdCardProps {
  student: TStudent;
}

const StudentIdCard = ({ student }: StudentIdCardProps) => {
  // console.log(student);
  const studentData = {
    name: student?.name?.englishName || "N/A",
    role: "Student",
    id: student?.id || "N/A",
    fatherName: student?.guardian?.father?.name?.englishName || "N/A",
    motherName: student?.guardian?.mother?.name?.englishName || "N/A",
    phone: student?.WhatsappNumber || "N/A",
    photo:
      student?.image?.url ||
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=300&h=300&fit=crop",
    tagline: "MYMENSINGH BRANCH",
  };

  const handleExportPNG = async () => {
    const cardElement = document.getElementById(`id-card-${studentData.id}`);
    if (!cardElement) return;

    try {
      const dataUrl = await domToPng(cardElement, {
        scale: 12,
        quality: 1,
        backgroundColor: "#ffffff",
        style: {
          borderRadius: "0px",
          overflow: "hidden",
          background: "#ffffff",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          imageRendering: "auto",
          WebkitMaskImage: "none",
        } as any,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${studentData.id}_${studentData.name.replace(/\s+/g, "_")}_HQ.png`;
      link.click();
    } catch (error) {
      console.error("PNG এক্সপোর্ট করতে সমস্যা হয়েছে:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 font-sans uppercase select-none">
      {/* ID Card Main Wrapper */}
      <div
        id={`id-card-${studentData.id}`}
        className="relative w-[320px] h-[500px] bg-white text-gray-900 shrink-0"
        style={
          {
            borderRadius: "0px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            color: "#111827",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
          } as React.CSSProperties
        }
      >
        {/* Top Header Geometry - Updated to Dark Blue & Yellow */}
        <div className="absolute top-0 w-full h-[220px] overflow-hidden">
          <div
            className="absolute z-20 inset-0 bg-[#001f3f]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 0% 100%)" }}
          ></div>
          <div
            className="absolute z-20 inset-0 bg-gradient-to-br from-[#f1c511] to-[#f3af03]"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0% 0)" }}
          ></div>
          <div
            className="absolute z-10 inset-0 bg-gradient-to-br from-[#f7db3c] to-[#001f3f]"
            style={{ clipPath: "polygon(100% 0, 100% 100%, -45% 0)" }}
          ></div>

          {/* Academy Branding */}
          <div className="relative z-40 pt-3 text-center">
            <Image
              src={student.version === "english" ? star.src : logo.src}
              alt="Gazipurshaheen Cadet Academy Mymensingh"
              width={240}
              height={100}
              className="mx-auto"
              style={{ imageRendering: "auto" }}
              priority
              unoptimized
            />
            <p className="text-black text-sm tracking-[0.1em] font-bold border-y border-[#001f3f] uppercase opacity-90 mt-2 bg-yellow-300">
              Mymensingh <span className="">branch</span>
            </p>
          </div>
        </div>

        {/* Profile Image with Ring Detail - Updated Border */}
        <div className="absolute top-[125px] left-1/2 -translate-x-1/2 z-20">
          <div className="w-32 h-32 rounded-full border-[6px] border-[#001f3f] shadow-xl overflow-hidden bg-white">
            <Image
              src={studentData.photo}
              alt={studentData.name}
              className="w-full h-full object-cover"
              width={200}
              height={200}
              unoptimized
            />
          </div>
        </div>

        {/* Info Content Section */}
        <div className="absolute top-[255px] left-0 w-full text-center px-4 bg-white">
          <h1 className="text-base font-black text-[#001f3f] tracking-tight leading-tight px-2 whitespace-normal break-words max-h-[40px] overflow-hidden flex items-center justify-center">
            {studentData.name}
          </h1>
          <p className="text-[12px] font-extrabold inline-block border border-blue-950 px-6 text-blue-950 rounded-full mt-1 mb-3 tracking-[0.2em]">
            ID: {studentData.id}
          </p>

          {/* Grid Layout - Updated border color */}
          <div className=" items-center gap-1 border border-[#001f3f]/20 rounded-xl text-[12px] p-2 bg-gray-50/50">
            <div className=" text-left space-y-1.5 font-bold text-gray-700 min-w-0 pr-1">
              <div className="flex items-center">
                <span className="w-[55px] text-[#001f3f] shrink-0">FATHER</span>
                <span className="text-gray-900 whitespace-nowrap break-words leading-tight">
                  : {studentData.fatherName}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-[55px] text-[#001f3f] shrink-0">MOTHER</span>
                <span className="text-gray-900 whitespace-nowrap break-words leading-tight">
                  : {studentData.motherName}
                </span>
              </div>
              <div className="flex items-start">
                <span className="w-[55px] text-[#001f3f] shrink-0">PHONE</span>
                <span className="text-gray-900 break-all">
                  : {studentData.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Signature Section - Text colors updated */}
        <div className="absolute bottom-[35px] left-0 w-full px-6  items-end z-30 pointer-events-none bg-transparent flex justify-between">
          <div className="flex flex-col -mb-3 -ml-2  items-center  border-[#001f3f]/20">
            <div className="bg-white p-1 rounded-lg shadow-xs border border-[#001f3f]/20 my-auto w-[74px] h-[74px] flex items-center justify-center">
              <QRCodeCanvas
                value={`https://gscam.edu.bd/verify/${studentData.id}`}
                size={256}
                style={{ width: "100%", height: "100%" }}
                bgColor="#ffffff"
                fgColor="#001f3f"
                level="H"
                includeMargin={false}
              />
            </div>
            <span className="text-[5.5px] text-[#001f3f] mt-1 font-extrabold tracking-normal whitespace-nowrap hidden">
              SCAN TO VERIFY
            </span>
          </div>
          {/* directors sign */}
          <div className="flex gap-2 justify-end items-end">
            <div className="flex flex-col items-center w-[90px]">
              <Image
                src={jubayet}
                alt="Director Sign"
                width={80}
                height={30}
                className="object-contain mix-blend-multiply h-[40px] ml-3"
              />
              <div className="w-full border-t border-[#001f3f] my-1"></div>
              <span className="text-[7px] font-black text-[#001f3f] tracking-wider text-center">
                Director
              </span>
            </div>
            <div className="flex flex-col items-center w-[90px]">
              <Image
                src={fahima}
                alt="MD Sign"
                width={80}
                height={30}
                className="object-contain mix-blend-multiply h-[30px]"
              />
              <div className="w-full border-t border-[#001f3f] my-1"></div>
              <span className="text-[7px] font-black text-[#001f3f] tracking-wider text-center whitespace-nowrap">
                Director
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Accent - Updated to Dark Blue & Yellow */}
        <div className="absolute bottom-0 left-0 w-full h-[45px] overflow-hidden z-10 pointer-events-none">
          <div
            className="absolute inset-0 bg-[#001f3f]"
            style={{ clipPath: "polygon(0 85%, 100% 20%, 100% 100%, 0 100%)" }}
          >
            <div
              className="absolute right-0 bottom-0 w-[40%] h-full bg-[#ffcc00]"
              style={{ clipPath: "polygon(45% 0, 100% 0, 100% 100%, 0% 100%)" }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={handleExportPNG}
        className="mt-4 px-4 py-1.5 bg-[#001f3f] hover:bg-[#003366] text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all print:hidden"
      >
        <FiDownload size={14} /> PNG ডাউনলোড
      </button>
    </div>
  );
};

export default StudentIdCard;
