/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetTeachersAttendanceQuery } from "@/redux/features/attendance/attendanceApi";
import { useState } from "react";

const TeachersAttendance = () => {
  const { data, isLoading, error } = useGetTeachersAttendanceQuery(undefined);
  const [selectedShift, setSelectedShift] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">লোড হচ্ছে...</p>
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
          <p className="text-sm">ডাটা লোড করতে সমস্যা হচ্ছে!</p>
        </div>
      </div>
    );
  }

  const attendanceData = data?.data?.data;
  const teachers = attendanceData?.details || [];
  const summary = attendanceData?.summary;

  const getShift = (teacherId: string) => {
    const fourthDigit = teacherId?.toString()[3];
    if (fourthDigit === "1") return "morning";
    if (fourthDigit === "2") return "day";
    return "unknown";
  };

  const filterByShift = (teachers: any[]) => {
    if (selectedShift === "all") return teachers;
    return teachers.filter((teacher) => {
      const shift = getShift(teacher.teacherId);
      return shift === selectedShift;
    });
  };

  const morningShiftTeachers = teachers.filter(
    (t: { teacherId: string }) => getShift(t.teacherId) === "morning",
  );
  const dayShiftTeachers = teachers.filter(
    (t: { teacherId: string }) => getShift(t.teacherId) === "day",
  );
  const filteredTeachers = filterByShift(teachers);

  const morningPresent = morningShiftTeachers.filter(
    (t: { isPresent: any }) => t.isPresent,
  ).length;
  const dayPresent = dayShiftTeachers.filter(
    (t: { isPresent: any }) => t.isPresent,
  ).length;

  const toggleRow = (teacherId: string) => {
    setExpandedRow(expandedRow === teacherId ? null : teacherId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-gray-800">
            শিক্ষকদের উপস্থিতি
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {attendanceData?.date
              ? new Date(attendanceData.date).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : new Date().toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
          </p>
        </div>

        {/* Shift Filter - Scrollable */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 min-w-max">
            <button
              onClick={() => setSelectedShift("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedShift === "all"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              সব ({teachers.length})
            </button>
            <button
              onClick={() => setSelectedShift("morning")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedShift === "morning"
                  ? "bg-green-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              মর্নিং ({morningShiftTeachers.length})
            </button>
            <button
              onClick={() => setSelectedShift("day")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedShift === "day"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              ডে ({dayShiftTeachers.length})
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 space-y-3">
        {/* Main Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-700 mb-3">সারসংক্ষেপ</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">
                {summary?.totalTeachers || 0}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">মোট</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {summary?.present || 0}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">উপস্থিত</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-600">
                {summary?.absent || 0}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">অনুপস্থিত</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {summary?.attendancePercentage || 0}%
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">হার</p>
            </div>
          </div>
        </div>

        {/* Shift-wise Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-green-700">
                🌅 মর্নিং
              </span>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                {morningShiftTeachers.length} জন
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">উপস্থিত</p>
                <p className="text-base font-bold text-green-600">
                  {morningPresent}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">হার</p>
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
              <span className="text-xs font-medium text-orange-700">☀️ ডে</span>
              <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                {dayShiftTeachers.length} জন
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">উপস্থিত</p>
                <p className="text-base font-bold text-green-600">
                  {dayPresent}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">হার</p>
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

      {/* Teachers List - Mobile Optimized */}
      <div className="px-4 pb-6">
        <p className="text-xs font-medium text-gray-500 mb-2 px-1">
          {selectedShift === "all"
            ? "সব শিক্ষক"
            : selectedShift === "morning"
              ? "মর্নিং শিফটের শিক্ষক"
              : "ডে শিফটের শিক্ষক"}{" "}
          ({filteredTeachers.length})
        </p>

        <div className="space-y-2">
          {filteredTeachers.map((teacher: any) => {
            const shift = getShift(teacher.teacherId);
            const isExpanded = expandedRow === teacher.teacherId;

            return (
              <div
                key={teacher.teacherId}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                  teacher.isPresent ? "border-green-200" : "border-gray-200"
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
                        teacher.isPresent ? "bg-green-500" : "bg-red-500"
                      }`}
                    />

                    {/* Teacher Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                          {teacher.teacherName}
                        </h3>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            shift === "morning"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {shift === "morning" ? "মর্নিং" : "ডে"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {teacher.designation}
                      </p>

                      {/* Compact Status */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            teacher.isPresent
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {teacher.isPresent ? "উপস্থিত" : "অনুপস্থিত"}
                        </span>
                        {teacher.checkInTime && (
                          <span className="text-[10px] text-gray-400">
                            🕒 {teacher.checkInTime}
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
                        <p className="text-gray-500">শিক্ষক আইডি</p>
                        <p className="font-medium text-gray-800 mt-0.5">
                          {teacher.teacherId}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">বিষয়</p>
                        <p className="font-medium text-gray-800 mt-0.5">
                          {teacher.subjects?.join(", ") || "N/A"}
                        </p>
                      </div>
                      {teacher.checkInTime && (
                        <div className="col-span-2">
                          <p className="text-gray-500">চেক-ইন সময়</p>
                          <p className="font-medium text-gray-800 mt-0.5">
                            {teacher.checkInTime}
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
            <p className="text-sm text-gray-500">এই শিফটে কোনো শিক্ষক নেই</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersAttendance;
