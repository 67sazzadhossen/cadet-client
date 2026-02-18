/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAddStudentReportMutation,
  useGetAllReportsQuery,
  useGetAllSubjectsQuery,
} from "@/redux/features/academic/academicApi";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

// Types
interface Student {
  _id: string;
  id: string;
  name: {
    englishName: string;
    bengaliName?: string;
  };
  rollNo: string;
  currentClass: string;
  version: "bangla" | "english";
  reports?: StudentReport[];
}

interface StudentReport {
  _id: string;
  class: string;
  performance: "low" | "medium" | "high";
  studentId: string;
  subject: string;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Subject {
  _id: string;
  className: string;
  subjects: string[];
}

const Performance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("Play");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<
    "bangla" | "english" | ""
  >("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [studentPerformances, setStudentPerformances] = useState<
    Record<string, string>
  >({});

  // Separate loading state for each student
  const [submittingStudents, setSubmittingStudents] = useState<Set<string>>(
    new Set(),
  );

  // Fetch current user data
  const { data: currentUser, isLoading: userLoading } =
    useGetMeQuery(undefined);

  // Fetch subjects data
  const { data: subjectsData, isLoading: subjectsLoading } =
    useGetAllSubjectsQuery(undefined, {
      skip: userLoading,
    });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query for fetching students with reports (no pagination)
  const query = {
    search: debouncedSearch,
    class: selectedClass,
    version: selectedVersion,
  };

  // Fetch students with reports
  const {
    data: studentData,
    refetch,
    isLoading: studentLoading,
    isFetching,
  } = useGetAllReportsQuery(query, {
    skip: userLoading || subjectsLoading,
  });

  const [addReport] = useAddStudentReportMutation();

  useEffect(() => {
    if (!userLoading && !subjectsLoading) {
      refetch();
    }
  }, [
    selectedClass,
    selectedVersion,
    debouncedSearch,
    refetch,
    userLoading,
    subjectsLoading,
  ]);

  // Get logged user info safely
  const loggedUser = currentUser?.data?.data;
  const role = loggedUser?.user?.role;
  const loggedUserName =
    loggedUser?.name?.bengaliName || loggedUser?.name?.englishName || "Unknown";

  // Safely extract data with fallbacks
  const allSubjects: Subject[] = subjectsData?.data?.data || [];
  const students: Student[] = studentData?.data?.data || [];

  // Get unique class names from subjects
  const classNames: string[] = [
    ...new Set(allSubjects.map((item: Subject) => item.className)),
  ].sort((a, b) => {
    const order: Record<string, number> = {
      Play: 1,
      Nursery: 2,
      KG: 3,
      "1": 4,
      "2": 5,
      "3": 6,
      "4": 7,
      "5": 8,
      "6": 9,
      "7": 10,
      "8": 11,
      "9": 12,
      "10": 13,
    };
    return (order[a] || 999) - (order[b] || 999);
  });

  const selectedClassData: Subject | undefined = allSubjects.find(
    (item: Subject) => item.className === selectedClass,
  );

  const classSubjects: string[] = selectedClassData?.subjects || [];

  const formatClassName = (className: string): string => {
    if (className === "1") return "Class 1";
    if (className === "2") return "Class 2";
    if (className === "3") return "Class 3";
    if (className === "4") return "Class 4";
    if (className === "5") return "Class 5";
    if (className === "6") return "Class 6";
    if (className === "7") return "Class 7";
    if (className === "8") return "Class 8";
    if (className === "9") return "Class 9";
    if (className === "10") return "Class 10";
    return className;
  };

  // Helper function to check if a report is from today
  const isToday = (dateString: string): boolean => {
    const reportDate = new Date(dateString);
    const today = new Date();
    return (
      reportDate.getDate() === today.getDate() &&
      reportDate.getMonth() === today.getMonth() &&
      reportDate.getFullYear() === today.getFullYear()
    );
  };

  // Get today's report for a student for the selected subject
  const getTodaysReport = (student: Student): StudentReport | null => {
    if (!selectedSubject || !student.reports) return null;

    return (
      student.reports.find(
        (report: StudentReport) =>
          report.subject === selectedSubject &&
          report.class === selectedClass &&
          isToday(report.createdAt),
      ) || null
    );
  };

  const handleResetFilters = (): void => {
    setSearchTerm("");
    setSelectedVersion("");
    toast.success("Filters cleared", { duration: 2000 });
  };

  const handlePerformanceChange = (studentId: string, value: string): void => {
    setStudentPerformances((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmitPerformance = async (studentId: string): Promise<void> => {
    const performance = studentPerformances[studentId];
    if (!performance) {
      toast.error("Please select a performance level");
      return;
    }

    // Add this student to submitting set
    setSubmittingStudents((prev) => new Set(prev).add(studentId));

    const payload = {
      studentId,
      subject: selectedSubject,
      performance: performance as "low" | "medium" | "high",
      class: selectedClass,
      submittedBy: loggedUserName,
    };

    const toastId = toast.loading("Submitting performance...");

    try {
      const res = await addReport(payload).unwrap();
      console.log(res.data);
      toast.success("Performance saved successfully!", { id: toastId });
      refetch(); // Refresh data to show new report
      // Clear the selection
      handlePerformanceChange(studentId, "");
    } catch (error: any) {
      console.error("Error submitting performance:", error);

      // Check if error is due to duplicate report
      if (error?.data?.message?.includes("already submitted")) {
        toast.error("Today's report already submitted for this subject", {
          id: toastId,
        });
      } else {
        toast.error("Failed to save performance. Please try again.", {
          id: toastId,
        });
      }
    } finally {
      // Remove this student from submitting set
      setSubmittingStudents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  const handleDeleteReport = (reportId: string, studentName: string) => {
    if (
      window.confirm(`Are you sure you want to delete ${studentName}'s report?`)
    ) {
      // TODO: Implement delete functionality
      toast.success(`Report deleted successfully!`, { duration: 2000 });
      refetch();
    }
  };

  // Show loading while any required data is loading
  const isLoading: boolean =
    Boolean(userLoading) ||
    Boolean(subjectsLoading) ||
    (Boolean(selectedClass) &&
      (studentLoading || isFetching) &&
      students.length === 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b top-0 z-20">
        <div className="px-4 py-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Student Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Track and manage student performance by subject
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-md px-3 py-2 border-b">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Class Select */}
          <div className="flex-1 sm:flex-none min-w-[120px]">
            <select
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedClass}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedClass(e.target.value);
                setSelectedSubject("");
                setStudentPerformances({});
              }}
            >
              {classNames.length > 0 ? (
                classNames.map((className: string, idx: number) => (
                  <option key={idx} value={className}>
                    {formatClassName(className)}
                  </option>
                ))
              ) : (
                <option value="">No classes</option>
              )}
            </select>
          </div>

          {/* Subject Select */}
          <div className="flex-1 sm:flex-none min-w-[130px]">
            <select
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100"
              value={selectedSubject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedSubject(e.target.value);
                setStudentPerformances({});
                if (e.target.value) {
                  toast.success(`Selected: ${e.target.value}`, {
                    duration: 1500,
                  });
                }
              }}
              disabled={classSubjects.length === 0}
            >
              <option value="">Subject</option>
              {classSubjects.map((subject: string, idx: number) => (
                <option key={idx} value={subject}>
                  {subject.length > 15
                    ? subject.substring(0, 15) + "..."
                    : subject}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
              selectedVersion
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <FiFilter size={16} />
            <span className="hidden sm:inline">
              {selectedVersion ? "Version" : "Filter"}
            </span>
            {selectedVersion && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                1
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-900 text-sm">
                Version Filter
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
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
                <span className="text-sm text-gray-700">বাংলা</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
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
                <span className="text-sm text-gray-700">English</span>
              </label>

              {selectedVersion && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-800 ml-auto"
                >
                  Clear
                </button>
              )}
            </div>

            {selectedVersion && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Version: {selectedVersion}
                  <button
                    onClick={() => setSelectedVersion("")}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4">
        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {selectedClassData && (
            <>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                <span>📚</span> {classSubjects.length} Subjects
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                <span>👥</span> {students.length || 0} Students
              </div>
            </>
          )}
        </div>

        {/* Sticky Header - Class and Subject Info */}
        {selectedSubject && selectedClass && (
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-3 mb-4 text-white shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base sm:text-lg font-semibold">
                  {formatClassName(selectedClass)} - {selectedSubject}
                </h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  Total Students: {students.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {!selectedSubject && selectedClass && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-amber-700 text-sm text-center">
              Please select a subject to add performances
            </p>
          </div>
        )}

        {/* Student Cards Grid - No Pagination, Show All */}
        {selectedClass ? (
          <>
            {studentLoading && students.length === 0 ? (
              <div className="text-center py-12">
                <LoadingAnimation />
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <FiSearch className="text-gray-300 text-3xl mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No students found
                </h3>
                <p className="text-xs text-gray-500">
                  {searchTerm || selectedVersion
                    ? "Try adjusting your search or filters"
                    : `No students in ${formatClassName(selectedClass)}`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {students.map((student: Student) => {
                  const todaysReport: StudentReport | null =
                    getTodaysReport(student);
                  const isSubmitting = submittingStudents.has(student.id);

                  return (
                    <div
                      key={student._id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {student.name?.englishName || "Unknown"}
                        </h3>
                      </div>

                      {/* Card Body */}
                      <div className="p-2 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-[10px] text-gray-500 block">
                              ID
                            </span>
                            <span className="text-xs font-mono font-semibold text-gray-900">
                              {student.id || "N/A"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-500 block">
                              Roll
                            </span>
                            <span className="text-xs font-mono font-semibold text-gray-900">
                              {student.rollNo || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Performance Section */}
                        {selectedSubject && (
                          <div className="space-y-1.5">
                            {todaysReport ? (
                              // Show today's report if exists
                              <div className="bg-green-50 border border-green-200 rounded p-1.5 text-center">
                                <p className="text-[10px] text-green-600 font-medium mb-0.5">
                                  Today
                                </p>
                                <p className="text-xs font-semibold text-green-700">
                                  {todaysReport.performance === "low" &&
                                    "🔴 Low"}
                                  {todaysReport.performance === "medium" &&
                                    "🟡 Medium"}
                                  {todaysReport.performance === "high" &&
                                    "🟢 High"}
                                </p>

                                {/* Delete Button for Admin - Inside Today's Report */}
                                {role === "admin" && (
                                  <div className="mt-2 pt-2 border-t border-green-200">
                                    <button
                                      onClick={() =>
                                        handleDeleteReport(
                                          todaysReport._id,
                                          student.name?.englishName ||
                                            "Unknown",
                                        )
                                      }
                                      className="w-full px-2 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                                    >
                                      <FiTrash2 size={12} />
                                      Delete Report
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Show dropdown and submit button if no report for today
                              <>
                                <select
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                  value={studentPerformances[student.id] || ""}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>,
                                  ) =>
                                    handlePerformanceChange(
                                      student.id,
                                      e.target.value,
                                    )
                                  }
                                  disabled={isSubmitting}
                                >
                                  <option value="">Select</option>
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>

                                <button
                                  className="w-full px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                  onClick={() =>
                                    handleSubmitPerformance(student.id)
                                  }
                                  disabled={
                                    !studentPerformances[student.id] ||
                                    isSubmitting
                                  }
                                >
                                  {isSubmitting ? (
                                    <span className="flex items-center gap-1">
                                      <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                                      <span>...</span>
                                    </span>
                                  ) : (
                                    <>
                                      <FiCheck size={12} />
                                      Submit
                                    </>
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Select a Class to Continue
            </h3>
            <p className="text-xs text-gray-500">
              Choose a class to view students
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
