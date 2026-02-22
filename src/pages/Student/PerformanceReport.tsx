/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import {
  useGetAllSubjectsQuery,
  useGetMyReportsQuery,
} from "@/redux/features/academic/academicApi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiCalendar,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiInbox,
} from "react-icons/fi";

const PerformanceReport = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [queryDate, setQueryDate] = useState<string>("");

  // Format date for API query (YYYY-MM-DD)
  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setQueryDate(`${year}-${month}-${day}`);
    }
  }, [selectedDate]);

  const { data: student, isLoading: getMeLoading } = useGetMeQuery(undefined);
  const studentData = student?.data?.data;
  const currentClass = studentData?.currentClass;

  const { data: subJects, isLoading: subjectLoading } =
    useGetAllSubjectsQuery(undefined);

  const allSubjects = useMemo(() => {
    return subJects?.data?.data || [];
  }, [subJects]);

  // Filter subjects for current class
  const classSubjects = useMemo(() => {
    if (!currentClass || !allSubjects.length) return [];
    const classData = allSubjects.find(
      (item: any) => item.className === currentClass,
    );
    return classData?.subjects || [];
  }, [currentClass, allSubjects]);

  // Query with date parameter
  const query = {
    id: studentData?.id,
    date: queryDate,
  };

  const { data: reports, isLoading: reportsLoading } = useGetMyReportsQuery(
    query,
    { skip: getMeLoading || !studentData?.id || !queryDate },
  );

  const myReports = reports?.data?.data || [];
  const filteredReports = myReports;

  // Create a map of subject -> performance for the selected date
  const reportMap = useMemo(() => {
    const map: Record<string, any> = {};
    filteredReports.forEach((report: any) => {
      map[report.subject] = report;
    });
    return map;
  }, [filteredReports]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate performance statistics
  const performanceStats = useMemo(() => {
    const stats = {
      low: 0,
      medium: 0,
      high: 0,
      pending: 0,
    };

    classSubjects.forEach((subject: string) => {
      const report = reportMap[subject];
      if (report) {
        stats[report.performance as keyof typeof stats]++;
      } else {
        stats.pending++;
      }
    });

    return stats;
  }, [classSubjects, reportMap]);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "high":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  // Check if any report exists for the selected date
  const hasAnyReport = filteredReports.length > 0;

  if (getMeLoading || reportsLoading || subjectLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="text-blue-600" size={14} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-800">
                My Reports
              </h1>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>Class {currentClass}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{studentData?.id}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-1.5">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="MMM d, yyyy"
              className="w-28 text-xs px-2 py-1 bg-transparent border-none focus:ring-0 text-gray-600"
              placeholderText="Select date"
              maxDate={new Date()}
            />
          </div>
        </div>

        {/* Mini Stats Row */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          <div className="bg-white rounded-lg shadow-sm p-2 text-center">
            <div className="text-[10px] text-gray-500">Total</div>
            <div className="text-sm font-bold text-gray-800">
              {classSubjects.length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm p-2 text-center">
            <div className="text-[10px] text-green-600">High</div>
            <div className="text-sm font-bold text-green-600">
              {performanceStats.high}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-sm p-2 text-center">
            <div className="text-[10px] text-yellow-600">Med</div>
            <div className="text-sm font-bold text-yellow-600">
              {performanceStats.medium}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-sm p-2 text-center">
            <div className="text-[10px] text-red-600">Low</div>
            <div className="text-sm font-bold text-red-600">
              {performanceStats.low}
            </div>
          </div>
        </div>

        {/* Selected Date Badge */}
        <div className="flex items-center gap-1 mb-3">
          <FiCalendar className="text-blue-500" size={12} />
          <span className="text-xs text-gray-600">
            {formatDate(selectedDate)}
          </span>
          {filteredReports.length === classSubjects.length && (
            <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              ✓ Complete
            </span>
          )}
        </div>

        {/* Conditional Rendering - Show message if no reports */}
        {!hasAnyReport ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiInbox className="text-gray-400" size={24} />
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              No Report Submitted Yet
            </h3>
            <p className="text-xs text-gray-500">
              No performance reports found for {formatDate(selectedDate)}
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Select another date to view reports
            </p>
          </div>
        ) : (
          /* Subjects List - Only show if reports exist */
          <div className="space-y-2">
            {classSubjects.length > 0 ? (
              classSubjects.map((subject: string, index: number) => {
                const report = reportMap[subject];
                const performance = report?.performance || "pending";
                const colorClass = getPerformanceColor(performance);

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-3 flex items-center justify-between border border-gray-100"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
                        <FiBookOpen className="text-blue-600" size={12} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {subject}
                        </div>
                        {report && (
                          <div className="text-[10px] text-gray-500">
                            {report.submittedBy}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${colorClass} font-medium`}
                      >
                        {performance === "high" && "High"}
                        {performance === "medium" && "Med"}
                        {performance === "low" && "Low"}
                        {performance === "pending" && "—"}
                      </span>
                      {report ? (
                        <FiCheckCircle className="text-green-500" size={14} />
                      ) : (
                        <FiClock className="text-gray-300" size={14} />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-xs text-gray-500">No subjects found</p>
              </div>
            )}
          </div>
        )}

        {/* Mini Summary - Only show if reports exist */}
        {hasAnyReport && filteredReports.length > 0 && (
          <div className="mt-3 bg-white rounded-lg shadow-sm p-2">
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>✓ {filteredReports.length} submitted</span>
              <span>⏳ {performanceStats.pending} pending</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceReport;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
