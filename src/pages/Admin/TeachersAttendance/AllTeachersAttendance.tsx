"use client";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { monthMap } from "@/const/index.const";
import { useGetTeachersAttendanceQuery } from "@/redux/features/attendance/attendanceApi";
import React, { useState, useMemo } from "react";

const AllTeachersAttendance = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    today.toLocaleString("default", { month: "long" }).toLowerCase(),
  );
  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear().toString(),
  );
  const [isTimeView, setIsTimeView] = useState(false);

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

  const formatToAmPm = (timeStr: string) => {
    if (!timeStr) return "-";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isFriday = (year: number, monthIndex: number, day: number) => {
    return new Date(year, monthIndex - 1, day).getDay() === 5;
  };

  if (isLoading || isFetching)
    return (
      <div>
        <LoadingAnimation />
      </div>
    );

  const teacherData = data?.data?.data || [];

  return (
    <div className="p-4">
      <div className="mb-6 flex gap-4 items-center">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border-b-2 p-2 uppercase font-semibold"
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
          className="border-b-2 p-2 font-semibold"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsTimeView(!isTimeView)}
          className={`px-4 py-2 rounded font-bold text-sm ${isTimeView ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          {isTimeView ? "Status View" : "Time View"}
        </button>
      </div>

      <div className="overflow-auto max-h-[80vh] shadow-sm rounded-lg">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 bg-gray-100 z-20">
            <tr>
              <th className="p-3 sticky left-0 bg-gray-100 z-30 text-left min-w-[200px]">
                Teacher Name
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i} className="p-2 text-center min-w-[50px]">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teacherData.map((teacher: any) => (
              <tr key={teacher.teacherId} className="hover:bg-blue-50 border-b">
                <td className="p-3 font-semibold sticky left-0 bg-white z-10 whitespace-nowrap">
                  {teacher.teacherName}
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `${selectedYear}-${String(monthIndex).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                  const todayDate = new Date();
                  todayDate.setHours(0, 0, 0, 0);
                  const checkDate = new Date(
                    parseInt(selectedYear),
                    monthIndex - 1,
                    day,
                  );

                  const isFutureDate = checkDate > todayDate;
                  const isHoliday = isFriday(
                    parseInt(selectedYear),
                    monthIndex,
                    day,
                  );

                  const dayRecords = teacher.attendance.filter(
                    (a: any) => a.date === dateStr,
                  );
                  const inRecord = dayRecords.find(
                    (a: any) => a.status === "in",
                  );
                  const outRecord = dayRecords.find(
                    (a: any) => a.status === "out",
                  );

                  return (
                    <td
                      key={i}
                      className={`p-2 text-center text-xs border border-gray-100 ${isHoliday ? "bg-gray-50" : ""}`}
                    >
                      {isFutureDate ? (
                        <span className="text-gray-400">-</span>
                      ) : isHoliday ? (
                        <span className="text-gray-400 font-bold">F</span>
                      ) : isTimeView ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-green-600 font-bold">
                            {inRecord ? formatToAmPm(inRecord.time) : "-"}
                          </span>
                          <span className="text-[10px] text-red-500 font-bold">
                            {outRecord ? formatToAmPm(outRecord.time) : "-"}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold ${inRecord ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {inRecord ? "P" : "A"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
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
