"use client";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";

const StudentIdCard = () => {
  const studentData = {
    name: "YOUR NAME",
    role: "JOB POSITION",
    id: "000 000 000 221",
    email: "your mail here",
    phone: "+ 00 11 231 589",
    photo:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=300&h=300&fit=crop",
    company: "COMPANY NAME",
    tagline: "TAGLINE GOES HERE",
    joinDate: "02-01-2023",
    expireDate: "31-12-2025",
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-16 min-h-screen bg-gray-200 p-10 font-sans uppercase">
      {/* --- FRONT SIDE --- */}
      <div className="relative w-[320px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-300">
        {/* Top Header Geometry */}
        <div className="absolute top-0 w-full h-[220px] overflow-hidden">
          {/* Main Navy Background */}
          <div
            className="absolute z-20 inset-0 bg-[#002e5d]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 65%, 0% 100%)" }}
          ></div>
          {/* Lighter Blue Geometric Shard Overlay */}
          <div
            className="absolute z-20 inset-0 bg-gradient-to-br from-[#2769bb] to-[#002e5d]"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 25% 0)" }}
          ></div>
          <div
            className="absolute z-10 inset-0 bg-gradient-to-br from-[#005cc2] to-[#002e5d]"
            style={{ clipPath: "polygon(100% 0, 100% 100%, -45% 0)" }}
          ></div>

          {/* Company Branding */}
          <div className="relative z-40 pt-10 text-center">
            <h2 className="text-white font-black text-xl tracking-tighter leading-none">
              {studentData.company}
            </h2>
            <p className="text-white text-[7px] tracking-[0.4em] opacity-80 mt-1">
              {studentData.tagline}
            </p>
          </div>
        </div>

        {/* Profile Image with Ring Detail */}
        <div className="absolute top-[125px] left-1/2 -translate-x-1/2 z-20">
          <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white">
            <Image
              src={studentData.photo}
              alt="Profile"
              className="w-full h-full object-cover"
              width={200}
              height={200}
            />
          </div>
        </div>

        {/* Info Content Section */}
        <div className="mt-64 text-center px-10">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
            {studentData.name}
          </h1>
          <p className="text-[10px] font-bold text-gray-400 mt-2 mb-8 tracking-[0.2em]">
            {studentData.role}
          </p>

          <div className="grid gap-2 grid-cols-3">
            <div className="text-[11px] col-span-2   text-left space-y-2 font-bold text-gray-700">
              <div className="flex items-center">
                <span className="w-16 text-gray-400">ID NO</span>
                <span>: {studentData.id}</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-gray-400">EMAIL</span>
                <span className="lowercase">: {studentData.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-16 text-gray-400">PHONE</span>
                <span>: {studentData.phone}</span>
              </div>
            </div>

            {/* Barcode Placeholder */}
            <div className=" ">
              <QRCodeCanvas
                value={`https://gscam.edu.bd/verify/${studentData.id}`}
                size={65}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        </div>

        {/* Bottom Accent - Precise Geometry */}
        <div className="absolute bottom-0 w-full h-14 overflow-hidden">
          <div
            className="absolute inset-0 bg-[#002e5d]"
            style={{ clipPath: "polygon(0 85%, 100% 20%, 100% 100%, 0 100%)" }}
          >
            <div
              className="absolute right-0 bottom-0 w-[40%] h-full bg-[#005cc2]"
              style={{ clipPath: "polygon(45% 0, 100% 0, 100% 100%, 0% 100%)" }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- BACK SIDE --- */}
      <div className="relative w-[320px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-300">
        {/* Top Slant Detail */}
        <div
          className="w-full h-14 bg-[#002e5d]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 0 100%)" }}
        ></div>

        <div className="px-10 py-6">
          <h3 className="text-sm font-black text-gray-800 mb-3 normal-case">
            Terms & Condition
          </h3>
          <ul className="space-y-3">
            {[1, 2].map((item) => (
              <li key={item} className="flex gap-2">
                <div className="min-w-[6px] h-[6px] rounded-full bg-black mt-1"></div>
                <p className="text-[9px] text-gray-500 leading-tight normal-case">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                  diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                  aliquam erat volutpat.
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid grid-cols-2 text-[10px] font-bold border-t border-gray-100 pt-4 text-gray-700">
            <div>
              <p className="text-gray-400 text-[8px]">JOIN DATE</p>
              <p>: {studentData.joinDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[8px]">EXPIRE DATE</p>
              <p>: {studentData.expireDate}</p>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="mt-10 text-center">
          <div className="inline-block border-t border-gray-400 px-8 pt-1">
            <p className="text-[10px] italic font-serif text-gray-400 normal-case">
              Your Signature
            </p>
            <p className="text-[9px] font-black text-gray-800">
              Your Sincerely
            </p>
          </div>
        </div>

        {/* Bottom Geometric Footer */}
        <div className="absolute bottom-0 w-full h-[150px] overflow-hidden">
          <div
            className="absolute inset-0 bg-[#002e5d]"
            style={{ clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 100%)" }}
          >
            {/* Internal Geometry */}
            <div
              className="w-full h-full bg-gradient-to-tr from-[#002e5d] to-[#005cc2]"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 100% 0, 35% 100%)",
              }}
            ></div>

            {/* Logo & Text in Footer */}
            <div className="absolute bottom-8 left-10 text-white">
              <h2 className="font-black text-base tracking-tighter leading-none">
                {studentData.company}
              </h2>
              <p className="text-[7px] tracking-[0.3em] opacity-80 mt-1 uppercase">
                {studentData.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;
