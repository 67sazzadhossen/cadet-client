/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetTeachersAttendanceQuery } from "@/redux/features/attendance/attendanceApi";
import { useState, useEffect } from "react";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import dayjs from "dayjs";

const TeachersAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // API parameters
  const params = {
    date: selectedDate,
  };

  const { data, isLoading, error, refetch } =
    useGetTeachersAttendanceQuery(params);

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500 p-4">
          <svg
            className="w-12 h-12 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">Failed to load attendance data!</p>
        </div>
      </div>
    );
  }

  // Extract data from the nested response
  const attendanceData = data?.data?.data?.data;
  const teachers = attendanceData?.details || [];
  const summary = attendanceData?.summary || {
    totalTeachers: 0,
    present: 0,
    absent: 0,
    late: 0,
    attendancePercentage: "0.00",
  };
  const dateRange = attendanceData?.dateRange;

  // Get shift from teacher ID (4th digit)
  const getShift = (teacherId: string) => {
    const fourthDigit = teacherId?.toString()[3];
    if (fourthDigit === "1") return "morning";
    if (fourthDigit === "2") return "day";
    return "unknown";
  };

  // Get teacher status from summary
  const getTeacherStatus = (teacher: any) => {
    return teacher.summary?.status || "absent";
  };

  // Filter teachers by search term and status
  const filteredTeachers = teachers.filter((teacher: any) => {
    // Status filter
    if (selectedStatus !== "all") {
      const status = getTeacherStatus(teacher);
      if (status !== selectedStatus) return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const teacherName =
        teacher.teacherInfo?.name?.englishName?.toLowerCase() || "";
      const teacherNameBn = teacher.teacherInfo?.name?.bengaliName || "";
      const teacherId = teacher.teacherId?.toLowerCase() || "";

      return (
        teacherName.includes(searchLower) ||
        teacherNameBn.includes(searchTerm) ||
        teacherId.includes(searchLower)
      );
    }

    return true;
  });

  // Group teachers by shift
  const morningShiftTeachers = teachers.filter(
    (t: any) => getShift(t.teacherId) === "morning",
  );
  const dayShiftTeachers = teachers.filter(
    (t: any) => getShift(t.teacherId) === "day",
  );

  // Calculate shift-wise attendance
  const morningPresent = morningShiftTeachers.filter(
    (t: any) => getTeacherStatus(t) === "present",
  ).length;

  const dayPresent = dayShiftTeachers.filter(
    (t: any) => getTeacherStatus(t) === "present",
  ).length;

  const toggleRow = (teacherId: string) => {
    setExpandedRow(expandedRow === teacherId ? null : teacherId);
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchTerm("");
  };

  const activeFilterCount = [
    selectedStatus !== "all" ? selectedStatus : null,
  ].filter(Boolean).length;

  // Format date for display
  const displayDate =
    dateRange?.startDate === dateRange?.endDate
      ? dayjs(dateRange?.startDate).format("MMMM D, YYYY")
      : dateRange?.startDate
        ? `${dayjs(dateRange.startDate).format("MMM D")} - ${dayjs(dateRange.endDate).format("MMM D, YYYY")}`
        : dayjs(selectedDate).format("MMMM D, YYYY");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-base font-semibold text-gray-800">
                Teachers Attendance
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">{displayDate}</p>
            </div>

            {/* Mobile filter buttons */}
            <div className="flex gap-2 sm:hidden">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 bg-gray-100 rounded-lg"
              >
                <FiSearch className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-blue-500 rounded-lg relative"
              >
                <FiFilter className="w-4 h-4 text-white" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="px-4 pb-3 sm:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <FiX className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Filters */}
        {showFilters && (
          <div className="px-4 pb-3 sm:hidden">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3">
                {/* Date Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden sm:block px-4 pb-3">
          <div className="flex flex-wrap items-end gap-2">
            {/* Date Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                <option value="all">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-[2] min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-sm whitespace-nowrap"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Filter - Scrollable */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide border-t">
          <div className="flex gap-1.5 min-w-max pt-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedStatus === "all"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              All ({teachers.length})
            </button>
            <button
              onClick={() => setSelectedStatus("present")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedStatus === "present"
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              Present ({summary.present})
            </button>
            <button
              onClick={() => setSelectedStatus("absent")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedStatus === "absent"
                  ? "bg-red-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              Absent ({summary.absent})
            </button>
            <button
              onClick={() => setSelectedStatus("late")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedStatus === "late"
                  ? "bg-yellow-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              Late ({summary.late})
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 space-y-3">
        {/* Main Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-700 mb-3">Summary</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">
                {summary.totalTeachers}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {summary.present}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">Present</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">{summary.absent}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Absent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {summary.attendancePercentage}%
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">Rate</p>
            </div>
          </div>
        </div>

        {/* Shift-wise Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-green-700">
                🌅 Morning
              </span>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                {morningShiftTeachers.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Present</p>
                <p className="text-base font-bold text-green-600">
                  {morningPresent}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Rate</p>
                <p className="text-sm font-semibold text-gray-700">
                  {morningShiftTeachers.length > 0
                    ? (
                        (morningPresent / morningShiftTeachers.length) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-orange-700">
                ☀️ Day
              </span>
              <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                {dayShiftTeachers.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Present</p>
                <p className="text-base font-bold text-green-600">
                  {dayPresent}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Rate</p>
                <p className="text-sm font-semibold text-gray-700">
                  {dayShiftTeachers.length > 0
                    ? ((dayPresent / dayShiftTeachers.length) * 100).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="px-4 pb-6">
        <p className="text-xs font-medium text-gray-500 mb-2 px-1">
          {selectedStatus === "all"
            ? "All Teachers"
            : selectedStatus === "present"
              ? "Present Teachers"
              : selectedStatus === "absent"
                ? "Absent Teachers"
                : "Late Teachers"}{" "}
          ({filteredTeachers.length})
        </p>

        <div className="space-y-2">
          {filteredTeachers.map((teacher: any) => {
            const shift = getShift(teacher.teacherId);
            const status = getTeacherStatus(teacher);
            const isExpanded = expandedRow === teacher.teacherId;

            // Get today's attendance record
            const todayAttendance = teacher.attendance?.[0];
            const checkInTime = todayAttendance?.time;

            // Determine if late (after 9 AM)
            const isLate = checkInTime && checkInTime > "09:00";

            return (
              <div
                key={teacher.teacherId}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                  status === "present"
                    ? "border-green-200"
                    : status === "late" || isLate
                      ? "border-yellow-200"
                      : "border-gray-200"
                }`}
              >
                {/* Main Row - Always Visible */}
                <div
                  onClick={() => toggleRow(teacher.teacherId)}
                  className="p-3 active:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    {/* Status Indicator */}
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        status === "present" ||
                        (status === "absent" && checkInTime)
                          ? "bg-green-500"
                          : isLate
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />

                    {/* Teacher Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                          {teacher.teacherInfo?.name?.englishName ||
                            teacher.teacherInfo?.name?.bengaliName ||
                            "N/A"}
                        </h3>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            shift === "morning"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {shift === "morning" ? "Morning" : "Day"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {teacher.teacherInfo?.designation || "Teacher"}
                      </p>

                      {/* Compact Status */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            checkInTime
                              ? isLate
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {checkInTime
                            ? isLate
                              ? "Late"
                              : "Present"
                            : "Absent"}
                        </span>
                        {checkInTime && (
                          <span className="text-[10px] text-gray-400">
                            🕒 {checkInTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <svg
                      className={`w-4 h-4 text-gray-400 mt-1 transition-transform flex-shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Teacher ID</p>
                        <p className="font-medium text-gray-800 mt-0.5">
                          {teacher.teacherId}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Subjects</p>
                        <p className="font-medium text-gray-800 mt-0.5">
                          {teacher.teacherInfo?.subjects?.join(", ") || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Mobile</p>
                        <p className="font-medium text-gray-800 mt-0.5">
                          {teacher.teacherInfo?.contact?.mobile || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-800 mt-0.5 truncate">
                          {teacher.teacherInfo?.contact?.email || "N/A"}
                        </p>
                      </div>
                      {checkInTime && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Check-in Time</p>
                          <p className="font-medium text-gray-800 mt-0.5">
                            {checkInTime}
                            <span className="text-gray-500 ml-2">
                              ({todayAttendance?.verifyType || "N/A"})
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No teachers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersAttendance;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
