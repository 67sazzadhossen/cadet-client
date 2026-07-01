"use client";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { monthMap } from "@/const/index.const";
import { useGetTeachersAttendanceQuery } from "@/redux/features/attendance/attendanceApi";
import { TTeacherAttendance } from "@/types/index.type";
import React, { useState, useMemo } from "react";

const AllTeachersAttendance = () => {
  const [selectedMonth, setSelectedMonth] = useState("june");
  const [selectedYear, setSelectedYear] = useState("2026");

  const params = { month: selectedMonth, year: selectedYear };
  const { data, isLoading, isFetching } = useGetTeachersAttendanceQuery(params);

  const { daysInMonth, monthIndex } = useMemo(() => {
    const year = parseInt(selectedYear);
    const mIndex = Object.keys(monthMap).indexOf(selectedMonth);
    const days = new Date(year, mIndex + 1, 0).getDate();
    return { daysInMonth: days, monthIndex: mIndex + 1 };
  }, [selectedMonth, selectedYear]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  if (isLoading || isFetching)
    return (
      <div>
        <LoadingAnimation />
      </div>
    );

  const teacherData = data?.data?.data || [];

  return (
    <div className="p-4">
      {/* Dropdowns */}
      <div className="mb-6 flex gap-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border-b-2 border-gray-300 p-2 outline-none uppercase font-semibold"
        >
          {Object.keys(monthMap).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border-b-2 border-gray-300 p-2 outline-none font-semibold"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-auto max-h-[80vh] shadow-sm rounded-lg">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 bg-gray-100 z-20">
            <tr>
              <th className="p-3 sticky left-0 bg-gray-100 z-30 text-left min-w-[200px]">
                Teacher Name
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th
                  key={i}
                  className="p-2 text-center min-w-[30px] font-medium text-gray-600"
                >
                  {i + 1}
                </th>
              ))}
              <th className="p-3 text-center">P</th>
              <th className="p-3 text-center">A</th>
            </tr>
          </thead>
          <tbody>
            {teacherData.map((teacher: TTeacherAttendance, index: number) => {
              let presentCount = 0;
              const isEven = index % 2 === 0;

              return (
                <tr
                  key={teacher.teacherId}
                  className={`${isEven ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                >
                  <td
                    className={`p-3 font-semibold whitespace-nowrap sticky left-0 z-10 ${isEven ? "bg-white" : "bg-gray-50"} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]`}
                  >
                    {teacher.teacherName}{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      ({teacher.teacherId})
                    </span>
                  </td>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = String(i + 1).padStart(2, "0");
                    const month = String(monthIndex).padStart(2, "0");
                    const dateStr = `${selectedYear}-${month}-${day}`;
                    const isPresent = teacher.attendance.find(
                      (a) => a.date === dateStr,
                    );
                    if (isPresent) presentCount++;

                    return (
                      <td key={i} className="p-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-bold ${isPresent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {isPresent ? "P" : "A"}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-3 text-center font-bold text-green-600">
                    {presentCount}
                  </td>
                  <td className="p-3 text-center font-bold text-red-500">
                    {daysInMonth - presentCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTeachersAttendance;

export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
