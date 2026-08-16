"use client";
import IdCard from "@/components/IdCard/IdCard";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import { TStudent } from "@/types/index.type";
import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX, FiUser } from "react-icons/fi";

const IdCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<
    "bangla" | "english" | ""
  >("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search term (৫০০ মিলি-সেকেন্ড পর কুয়েরি ট্রিগার হবে)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ফিল্টারসহ কুয়েরি অবজেক্ট (আইডি কার্ডের জন্য লিমিট ১০০০-ই রাখা হয়েছে)
  const query = {
    search: debouncedSearch,
    class: selectedClass,
    version: selectedVersion,
    page: 1,
    limit: 1000,
  };

  const { data, isLoading } = useGetAllStudentsQuery(query);

  const allStudents: TStudent[] = data?.data?.data?.data || data?.data || [];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedVersion("");
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 print:bg-white print:p-0">
      {/* --- Filter & Header Panel (Print এ হাইড থাকবে) --- */}
      <div className="bg-white shadow-md rounded-2xl border-b lg:fixed z-20 to lg:right-10 lg:mt-5 lg:h-screen w-2/10 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4">
          {/* Top Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                আইডি কার্ড জেনারেটর
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                ফিল্টার করে একসাথে সকল ছাত্র-ছাত্রীর আইডি কার্ড প্রিন্ট করুন
              </p>
            </div>
            <div className="text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl">
              মোট: {allStudents.length} জন
            </div>
          </div>

          {/* Search and Filter Toggle Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="নাম, আইডি বা ফোন নম্বর দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
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
              {(selectedClass || selectedVersion) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {(selectedClass ? 1 : 0) + (selectedVersion ? 1 : 0)}
                </span>
              )}
            </button>

            {/* প্রিন্ট বাটন */}
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              প্রিন্ট করুন
            </button>
          </div>

          {/* Expandable Filter Options */}
          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm text-gray-900">
                  ফিল্টার অপশন
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <FiX size={12} /> সব রিসেট
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
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
                        ক্লাস {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Version Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    ভার্সন
                  </label>
                  <div className="flex gap-6 py-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
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
                      <span>বাংলা</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
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
                      <span>English</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ID Cards Display Section --- */}
      <div className="p-4 space-y-4 lg:w-9/12 print:p-0">
        {allStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto mt-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-gray-400" size={28} />
            </div>
            <p className="text-gray-600 font-medium text-lg">
              কোনো ছাত্র-ছাত্রী পাওয়া যায়নি
            </p>
            <p className="text-sm text-gray-400 mt-1">
              অন্য ফিল্টার অপশন দিয়ে চেষ্টা করুন।
            </p>
          </div>
        ) : (
          /* ID Card Grid - Print friendly grid breakpoints */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-center print:grid-cols-2 print:gap-4">
            {allStudents.map((student: TStudent) => (
              <IdCard key={student._id || student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdCards;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
