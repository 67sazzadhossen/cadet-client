import React from "react";

const StudentIdCard = () => {
  const studentData = {
    name: "Jerrin Islam",
    role: "STUDENT",
    batch: "AB01 1234",
    roll: "02",
    phone: "+012 345 6789",
    address: "22 South Avenue, CA-9001",
    photo:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=300&h=300&fit=crop",
    studentId: "ST2024001",
    schoolUrl: "https://myschool.com/student/ST2024001",
  };

  // QR Code Data (যে ডাটা তুমি QR তে রাখতে চাও)
  const qrData = JSON.stringify({
    id: studentData.studentId,
    name: studentData.name,
    roll: studentData.roll,
    batch: studentData.batch,
    url: studentData.schoolUrl,
  });

  // Google Charts API দিয়ে QR Code জেনারেট
  const qrCodeUrl = `https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${encodeURIComponent(qrData)}&choe=UTF-8`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-12 min-h-screen bg-gray-100 p-8 font-sans">
      {/* FRONT SIDE */}
      <div className="relative group">
        {/* Lanyard Clip Simulation */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-8 h-20 bg-blue-700 rounded-t-lg shadow-inner"></div>
          <div className="w-10 h-10 -mt-2 bg-gray-400 rounded-full border-4 border-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Card Holder (Glass Effect) */}
        <div className="w-72 h-[420px] bg-white/60 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/40">
          <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col relative shadow-inner">
            {/* Blue Wave Top */}
            <div className="relative h-40 bg-[#004a99]">
              <div className="absolute top-4 right-4 text-white font-bold text-xs">
                LOGO
              </div>
              <svg
                className="absolute bottom-0 w-full"
                viewBox="0 0 500 200"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,150 C150,250 350,50 500,150 L500,200 L0,200 Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Profile Picture */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2">
              <div className="w-28 h-28 rounded-full border-[5px] border-[#004a99] overflow-hidden bg-white shadow-md">
                <img
                  src={studentData.photo}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-16 text-center px-4">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {studentData.name}
              </h2>
              <p className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] mb-4">
                {studentData.role}
              </p>

              <div className="text-left space-y-1 text-[11px] text-gray-600 ml-4">
                <p>
                  <span className="font-bold w-14 inline-block">Batch</span>:{" "}
                  {studentData.batch}
                </p>
                <p>
                  <span className="font-bold w-14 inline-block">Roll</span>:{" "}
                  {studentData.roll}
                </p>
                <p>
                  <span className="font-bold w-14 inline-block">Phone</span>:{" "}
                  {studentData.phone}
                </p>
                <p>
                  <span className="font-bold w-14 inline-block">ID</span>:{" "}
                  {studentData.studentId}
                </p>
              </div>
            </div>

            {/* Blue Wave Bottom */}
            <div className="mt-auto relative h-16 bg-white">
              <svg
                className="absolute top-0 w-full"
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,50 C150,-50 350,150 500,50 L500,150 L0,150 Z"
                  fill="#004a99"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="relative group">
        {/* Lanyard Clip Simulation */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-8 h-20 bg-blue-700 rounded-t-lg shadow-inner"></div>
          <div className="w-10 h-10 -mt-2 bg-gray-400 rounded-full border-4 border-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <div className="w-72 h-[420px] bg-white/60 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-white/40">
          <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col shadow-inner">
            {/* Top Wave (Reverse) */}
            <div className="h-24 relative overflow-hidden">
              <svg
                className="absolute top-0 w-full h-full"
                viewBox="0 0 500 200"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 L500,0 L500,100 C350,0 150,200 0,100 Z"
                  fill="#004a99"
                />
              </svg>
            </div>

            {/* Terms & Address */}
            <div className="px-6 py-2 flex-grow text-center">
              <p className="text-[9px] leading-relaxed text-gray-500 italic">
                &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.&quot;
              </p>

              <div className="mt-8 bg-[#004a99] text-white py-2 px-3 rounded text-[10px] flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#004a99] rounded-full"></div>
                </div>
                {studentData.address}
              </div>
            </div>

            {/* Bottom Wave with QR and Logo - Using Google Charts QR */}
            <div className="h-32 bg-[#004a99] relative flex items-center justify-between px-6 pt-8">
              <svg
                className="absolute top-0 left-0 w-full h-12"
                viewBox="0 0 500 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,100 C150,0 350,150 500,0 L500,0 L0,0 Z"
                  fill="white"
                />
              </svg>
              <div className="text-white font-bold text-xs z-10">LOGO</div>
              <div className="w-12 h-12 bg-white p-1 rounded z-10">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;
