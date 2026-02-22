"use client";

import { useGetMyAttendanceQuery } from "@/redux/features/attendance/attendanceApi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { useState, useEffect, useMemo } from "react";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiFilter,
  FiXCircle,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";

const Attendance = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [queryDate, setQueryDate] = useState<string>("");
  const [queryMonth, setQueryMonth] = useState<string>("");
  const [months, setMonths] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"date" | "month">("month");

  // Get current user
  const { data: userData, isLoading: userLoading } = useGetMeQuery(undefined);
  const currentUser = userData?.data?.data;

  // Format date for API query (YYYY-MM-DD)
  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setQueryDate(`${year}-${month}-${day}`);
    }
  }, [selectedDate]);

  // Get current month for initial load
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const currentMonthStr = `${year}-${month}`;

    setSelectedMonth(currentMonthStr);
    setQueryMonth(currentMonthStr);
  }, []);

  // Generate last 12 months for dropdown
  useEffect(() => {
    const monthList: string[] = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      monthList.push(`${year}-${month}`);
    }

    setMonths(monthList);
  }, []);

  // IMPORTANT: শুধু একটি ফিল্ড পাঠান - date অথবা month, দুটো না
  const query = {
    id: currentUser?.id || "",
    // যদি activeFilter "date" হয়, তাহলে date পাঠান, month খালি রাখুন
    date: activeFilter === "date" ? queryDate : "",
    // যদি activeFilter "month" হয়, তাহলে month পাঠান, date খালি রাখুন
    month: activeFilter === "month" ? queryMonth : "",
  };

  console.log("Sending query:", query);

  const { data: attendance, isLoading: attendanceLoading } =
    useGetMyAttendanceQuery(query, {
      skip: !currentUser?.id,
    });

  const myAttendance = attendance?.data?.data || [];
  console.log("My Attendance:", myAttendance);

  // Get today's attendance (for the selected date)
  const todayAttendance = useMemo(() => {
    return myAttendance.find((item: any) => item.date === queryDate) || null;
  }, [myAttendance, queryDate]);

  // Format month for display
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get days in month for table
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate calendar data for the month
  const calendarData = useMemo(() => {
    if (!selectedMonth) return [];

    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = getDaysInMonth(year, month - 1);
    const days = [];

    // Create a map of attendance by date for quick lookup
    const attendanceMap = new Map();
    myAttendance.forEach((item: any) => {
      attendanceMap.set(item.date, item);
    });

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const attendance = attendanceMap.get(dateStr);

      days.push({
        date: day,
        dateStr,
        attendance,
        status: attendance ? attendance.status : "absent",
        time: attendance?.time || null,
        verifyType: attendance?.verifyType || null,
      });
    }

    return days;
  }, [selectedMonth, myAttendance]);

  // Generate single day data for date view
  const singleDayData = useMemo(() => {
    if (!queryDate) return [];

    const attendance = myAttendance.find(
      (item: any) => item.date === queryDate,
    );

    if (!attendance) return [];

    const date = new Date(queryDate);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const day = date.getDate();

    return [
      {
        date: day,
        dateStr: queryDate,
        attendance,
        status: attendance.status,
        time: attendance.time,
        verifyType: attendance.verifyType,
        dayName,
      },
    ];
  }, [myAttendance, queryDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;

    calendarData.forEach((day: any) => {
      if (day.status === "in" || day.status === "out") {
        present++;
      } else {
        absent++;
      }
    });

    return { present, absent, total: calendarData.length };
  }, [calendarData]);

  if (userLoading || attendanceLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="text-blue-600" size={14} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-800">
                My Attendance
              </h1>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>ID: {currentUser?.id}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Class: {currentUser?.currentClass}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-3 flex gap-2">
          <button
            onClick={() => setActiveFilter("month")}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeFilter === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Month View
          </button>
          <button
            onClick={() => setActiveFilter("date")}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              activeFilter === "date"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Date View
          </button>
        </div>

        {/* Conditional Filters */}
        {activeFilter === "month" ? (
          /* Month Filter */
          <div className="bg-white rounded-xl shadow-sm p-3 mb-3 flex items-center gap-3">
            <FiFilter className="text-gray-400" size={14} />
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setQueryMonth(e.target.value);
              }}
              className="flex-1 text-xs px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* Date Picker */
          <div className="bg-white rounded-xl shadow-sm p-3 mb-3">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-blue-500" size={14} />
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="MMM d, yyyy"
                className="flex-1 text-xs px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select date"
                maxDate={new Date()}
              />
            </div>
          </div>
        )}

        {/* Today's Status Card (only show in date view) */}
        {activeFilter === "date" && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-medium text-gray-500">
                Today&apos;s Status
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {todayAttendance ? (
                <>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      todayAttendance.status === "in"
                        ? "bg-green-100"
                        : todayAttendance.status === "out"
                          ? "bg-orange-100"
                          : "bg-gray-100"
                    }`}
                  >
                    {todayAttendance.status === "in" && (
                      <FiLogIn className="text-green-600" size={18} />
                    )}
                    {todayAttendance.status === "out" && (
                      <FiLogOut className="text-orange-600" size={18} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {todayAttendance.status === "in" && "Present (In)"}
                      {todayAttendance.status === "out" && "Present (Out)"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Time: {todayAttendance.time} |{" "}
                      {todayAttendance.verifyType}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiXCircle className="text-red-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Absent
                    </p>
                    <p className="text-xs text-gray-500">
                      No attendance record
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Stats Cards (only for month view) */}
        {activeFilter === "month" && (
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="text-[10px] text-blue-600">Total</div>
              <div className="text-sm font-bold text-blue-700">
                {stats.total}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="text-[10px] text-green-600">Present</div>
              <div className="text-sm font-bold text-green-700">
                {stats.present}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <div className="text-[10px] text-red-600">Absent</div>
              <div className="text-sm font-bold text-red-700">
                {stats.absent}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700">
            <h3 className="text-xs font-semibold text-white">
              {activeFilter === "month"
                ? `${formatMonth(selectedMonth)} Attendance`
                : `Attendance for ${formatDate(selectedDate)}`}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Verify Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {activeFilter === "month" ? (
                  /* Month View - Show all days of the month */
                  calendarData.map((day: any) => {
                    const date = new Date(day.dateStr);
                    const dayName = date.toLocaleDateString("en-US", {
                      weekday: "short",
                    });

                    return (
                      <tr key={day.dateStr} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs text-gray-900">
                          {day.date}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {dayName}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                            ${day.status === "in" || day.status === "out" ? "bg-green-100 text-green-700" : ""}
                            ${day.status === "absent" ? "bg-red-100 text-red-700" : ""}
                          `}
                          >
                            {day.status === "in" && <FiLogIn size={10} />}
                            {day.status === "out" && <FiLogOut size={10} />}
                            {day.status === "absent" && <FiXCircle size={10} />}
                            <span>
                              {day.status === "in" && "Present"}
                              {day.status === "out" && "Present"}
                              {day.status === "absent" && "Absent"}
                            </span>
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {day.time || "-"}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-600">
                          {day.verifyType || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : /* Date View - Show only selected date */
                singleDayData.length > 0 ? (
                  singleDayData.map((day: any) => (
                    <tr key={day.dateStr} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {day.date}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {day.dayName}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                            ${day.status === "in" || day.status === "out" ? "bg-green-100 text-green-700" : ""}
                          `}
                        >
                          {day.status === "in" && <FiLogIn size={10} />}
                          {day.status === "out" && <FiLogOut size={10} />}
                          <span>
                            {day.status === "in" && "Present (In)"}
                            {day.status === "out" && "Present (Out)"}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {day.time}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {day.verifyType}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiXCircle className="text-gray-300 mb-2" size={24} />
                        <p className="text-xs text-gray-500">
                          No attendance record for {formatDate(selectedDate)}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Data Message for Month View */}
        {activeFilter === "month" && myAttendance.length === 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-xs text-yellow-700">
              No attendance records found for {formatMonth(selectedMonth)}
            </p>
          </div>
        )}

        {/* Summary Note */}
        <div className="mt-3 text-[10px] text-gray-400 text-center">
          * Days without attendance record are marked as Absent
        </div>
      </div>
    </div>
  );
};

export default Attendance;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
