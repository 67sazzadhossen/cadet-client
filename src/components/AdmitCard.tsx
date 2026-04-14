/* eslint-disable @next/next/no-img-element */
"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AdmitCard = ({ student }: { student: any }) => {
  // ছবির মতো একই ডেটা ফর্ম্যাট ব্যবহার করার জন্য
  const isBangla = student.version === "bangla";
  const examName = "Monthly Test-February"; // Pictures use this, let's keep it constant or dynamic from props
  const session = "2026";
  const date = "2026-03-01";

  const studentPhoto = student.image?.url || "/student-placeholder.png"; // Dynamic student dynamic photo dynamic placeholder dynamic from prop dynamic or placeholder

  // ছবির মতো একই সাবজেক্ট লিস্ট ব্যবহার করার জন্য
  const subjects = [
    { code: "101", name: isBangla ? "Bangla" : "Bangla" },
    { code: "107", name: isBangla ? "English" : "English" },
    { code: "109", name: isBangla ? "Mathematices" : "Mathematics" },
    { code: "111", name: isBangla ? "Religion" : "Religion" },
  ];

  const examDateTime = {
    date: "08/Mar/2026 (Sun)",
    time: "10:00 AM To 11:30 AM",
  };

  return (
    <div
      className="admit-card-container"
      style={{
        width: "210mm", // সরাসরি A4 এর উইডথ
        height: "148.5mm", // সরাসরি A4 এর অর্ধেক হাইট
        margin: "0", // কোনো মার্জিন রাখা যাবে না
        padding: "0", // কোনো প্যাডিং রাখা যাবে না
        boxSizing: "border-box",
        backgroundColor: "white",
      }}
    >
      <div
        className="admit-card-content"
        style={{
          border: "2px solid black",
          height: "100%", // পুরো হাইট কভার করবে
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* TOP HEADER - Logo, Name, Address, Photo, QR */}
        <div className="flex border-b border-black">
          {/* Logo Section */}
          <div className="w-[15%] p-2 flex justify-center items-center">
            <img src="/logo.png" alt="logo" />
          </div>

          {/* School Name, Address, Admit Card Title */}
          <div className="w-[60%] text-center  flex flex-col justify-center py-2">
            <h1 className="text-2xl font-black uppercase text-blue-900 m-0 p-0 leading-tight">
              GazipurShaheen Cadet Academy
            </h1>
            <p className="text-sm font-semibold text-black m-0 p-0">
              MYMENSINGH BRANCH
            </p>
            <div className="mt-2 flex justify-center">
              <span
                className="inline-block bg-blue-600 text-white font-extrabold text-2xl px-12 py-1 uppercase rounded"
                style={{
                  border: "1px solid black",
                  boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)",
                }}
              >
                Admit Card
              </span>
            </div>
          </div>

          {/* Photo & Student Index */}
          {/* Photo Section */}
          <div className="w-[25%] p-2 flex flex-col items-center">
            <div className="border border-blue-600 bg-white p-1">
              <img
                src={studentPhoto}
                alt="Student"
                style={{
                  width: "90px", // ফিক্সড পিক্সেল ব্যবহার করুন
                  height: "110px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="w-full text-center mt-1">
              {" "}
              {/* mr-32 সরিয়ে text-center দিন */}
              <p className="text-[10px] font-semibold">
                Student Id: <span className="font-bold">{student.id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* INFO GRID SECTION */}
        <div className="text-black text-sm">
          {/* Row 1 */}
          <div className="flex border-b border-gray-400">
            <div className="w-1/2 p-1.5 border-r border-gray-400">
              <b>Session</b> : {session}
            </div>
            <div className="w-1/2 p-1.5">
              <b>Exam Name</b> :{" "}
              <span className="font-semibold">{examName}</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex border-b border-gray-400">
            <div className="w-1/2 p-1.5 border-r border-gray-400">
              <b>Class</b> : {student.currentClass}
            </div>

            <div className="w-[30%] p-1.5 bg-gray-100">
              <span className="font-bold">Student Id</span> :{" "}
              <span className="font-bold">{student.id}</span>
            </div>
          </div>

          {/* Row 3 - Student Name */}
          <div className="flex border-b border-gray-400">
            <div className="w-full p-1.5 flex flex-col">
              <span>
                <b>Student Name</b> :{" "}
                <span className="font-semibold text-lg uppercase">
                  {student.name.englishName}
                </span>
              </span>
              <span>
                <b>Class Roll No.</b> : {student.rollNo}
              </span>
            </div>
          </div>

          {/* Row 4 - Parents Name */}
          <div className="flex">
            <div className="w-1/2 p-1.5 border-r border-gray-400">
              <b>Father&apos;s Name</b> : {student.parent?.fatherName}
            </div>
            <div className="w-1/2 p-1.5">
              <b>Mother&apos;s Name</b> : {student.parent?.motherName}
            </div>
          </div>
        </div>

        {/* EXAM ROUTINE SECTION */}
        <div className="border-t hidden border-black text-sm">
          <div className="bg-blue-100 border-b border-gray-400 py-1 text-center font-bold text-base uppercase">
            Exam Routine
          </div>

          {/* Routine Table Headers */}
          <div className="flex font-semibold text-center border-b border-gray-400 text-xs">
            <div className="w-[25%] p-1 border-r border-gray-400">
              Date & Time
            </div>
            <div className="w-[25%] p-1 border-r border-gray-400">
              Subject Name
            </div>
            <div className="w-[25%] p-1 border-r border-gray-400">
              Date & Time
            </div>
            <div className="w-[25%] p-1">Subject Name</div>
          </div>

          {/* Routine Data Row 1 */}
          <div className="flex text-center text-[11px] border-b border-gray-400">
            <div className="w-[25%] p-1.5 border-r border-gray-400">
              {examDateTime.date} <br /> {examDateTime.time}
            </div>
            <div className="w-[25%] p-1.5 border-r border-gray-400 font-semibold">
              {subjects[0].code} - {subjects[0].name}
            </div>
            <div className="w-[25%] p-1.5 border-r border-gray-400">
              {examDateTime.date} <br /> {examDateTime.time}
            </div>
            <div className="w-[25%] p-1.5 font-semibold">
              {subjects[2].code} - {subjects[2].name}
            </div>
          </div>

          {/* Routine Data Row 2 */}
          <div className="flex text-center text-[11px]">
            <div className="w-[25%] p-1.5 border-r border-gray-400">
              {examDateTime.date} <br /> {examDateTime.time}
            </div>
            <div className="w-[25%] p-1.5 border-r border-gray-400 font-semibold">
              {subjects[1].code} - {subjects[1].name}
            </div>
            <div className="w-[25%] p-1.5 border-r border-gray-400">
              {examDateTime.date} <br /> {examDateTime.time}
            </div>
            <div className="w-[25%] p-1.5 font-semibold">
              {subjects[3].code} - {subjects[3].name}
            </div>
          </div>
        </div>

        {/* RULES & SIGNATURE SECTION */}
        <div className="flex border-t border-black">
          {/* Rules Section (Bangla Text as image dynamic handling dynamic or placeholder text) */}
          <div className="w-[65%] border-r border-gray-400 p-2 text-xs leading-relaxed text-black">
            <div className="flex items-start gap-1">
              <span>★</span>
              <span>
                পরীক্ষা শুরু হওয়ার কমপক্ষে ১৫ মিনিট পূর্বে পরীক্ষার হলে প্রবেশ
                করতে হবে।
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span>★</span>
              <span>
                প্রবেশপত্র ছাড়া কোন কাগজপত্র পরীক্ষা কেন্দ্রে বহন করা যাবে না।
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span>★</span>
              <span>
                প্রত্যেক পরীক্ষার্থীকে প্রয়োজনীয় কলম, পেন্সিল ও জ্যামিতি বক্স
                সঙ্গে আনতে হবে।
              </span>
            </div>
            <div className="flex items-start gap-1">
              <span>★</span>
              <span>
                পরীক্ষার হলে শিক্ষকের সাথে দুর্ব্যবহার করলে / অসৎ উপায় অবলম্বন
                করলে / মোবাইল ফোন আনলে পরীক্ষা বাতিল বলে গণ্য হবে।
              </span>
            </div>
          </div>

          {/* Signature Section */}
          <div className="w-[35%] p-2 flex flex-col justify-end items-center text-center">
            <div className="mb-2 w-[60%] flex flex-col items-center">
              {/* Signature Image Dynamic with dynamic prop from student prop or dynamic from local code */}
            </div>
            <div className="border-t-2 border-dotted border-black w-[80%] pt-1 mt-12">
              <p className="font-bold text-base text-black uppercase mt-0 p-0">
                Director & Principal
              </p>
              <p className="text-[11px] text-gray-700 m-0 p-0">
                Date : <b>{date}</b>
              </p>
            </div>
            <div className="mt-2 text-right w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitCard;
