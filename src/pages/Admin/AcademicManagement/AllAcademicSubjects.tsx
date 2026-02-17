"use client";

import {
  useDeleteSubjectsMutation,
  useGetAllSubjectsQuery,
  useUpdateSubjectsMutation,
} from "@/redux/features/academic/academicApi";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

interface Subject {
  _id: string;
  className: string;
  subjects: string[];
  __v: number;
}

interface EditedSubject {
  _id: string;
  className: string;
  subjects: string[];
  __v: number;
}

const AllAcademicSubjects: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetAllSubjectsQuery(undefined);
  const [updateSubjects, { isLoading: updatingSubject }] =
    useUpdateSubjectsMutation();
  const [deleteSubjects, { isLoading: deleting }] = useDeleteSubjectsMutation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<EditedSubject[]>([]);
  const [originalData, setOriginalData] = useState<Subject[]>([]);

  const allSubjects = useMemo(
    () => (data?.data?.data as Subject[]) || [],
    [data?.data?.data],
  );

  // Initialize edited data when original data changes
  useEffect(() => {
    if (allSubjects.length > 0) {
      setOriginalData(allSubjects);
      setEditedData(allSubjects.map((item) => ({ ...item })));
    }
  }, [allSubjects]);

  // Get unique class names for filter
  const classNames = [
    "all",
    ...new Set(allSubjects.map((item) => item.className)),
  ];

  // Filter subjects based on search and class filter
  const filteredSubjects = (editingClassId ? editedData : allSubjects).filter(
    (item) => {
      const matchesSearch =
        item.subjects.some((subject) =>
          subject.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || item.className.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass =
        selectedClass === "all" || item.className === selectedClass;

      return matchesSearch && matchesClass;
    },
  );

  // Calculate total subjects count
  const totalSubjects = allSubjects.reduce(
    (acc, curr) => acc + curr.subjects.length,
    0,
  );

  // Handle edit button click for a specific class
  const handleEditClick = (classId: string) => {
    setEditingClassId(classId);
    toast.success("Edit mode enabled for this class", {
      duration: 2000,
      icon: "✏️",
    });
  };

  // Handle cancel edit for a specific class
  const handleCancelEdit = () => {
    // Revert changes for the editing class
    if (editingClassId) {
      const originalClass = originalData.find((c) => c._id === editingClassId);
      if (originalClass) {
        setEditedData((prevData) =>
          prevData.map((item) =>
            item._id === editingClassId ? { ...originalClass } : item,
          ),
        );
      }
    }
    setEditingClassId(null);
    toast.success("Edit cancelled", { duration: 2000, icon: "❌" });
  };

  // Handle class name change in edit mode
  const handleClassNameChange = (id: string, newClassName: string) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, className: newClassName } : item,
      ),
    );
  };

  // Handle subject change in edit mode
  const handleSubjectChange = (
    classId: string,
    subjectIndex: number,
    newValue: string,
  ) => {
    setEditedData((prevData) =>
      prevData.map((item) => {
        if (item._id === classId) {
          const updatedSubjects = [...item.subjects];
          updatedSubjects[subjectIndex] = newValue;
          return { ...item, subjects: updatedSubjects };
        }
        return item;
      }),
    );
  };

  // Handle add new subject to a class
  const handleAddSubject = (classId: string) => {
    setEditedData((prevData) =>
      prevData.map((item) =>
        item._id === classId
          ? { ...item, subjects: [...item.subjects, ""] }
          : item,
      ),
    );
  };

  // Handle remove subject from a class
  const handleRemoveSubject = (classId: string, subjectIndex: number) => {
    setEditedData((prevData) =>
      prevData.map((item) => {
        if (item._id === classId) {
          const updatedSubjects = item.subjects.filter(
            (_, idx) => idx !== subjectIndex,
          );
          return { ...item, subjects: updatedSubjects };
        }
        return item;
      }),
    );
  };

  // Handle submit changes for a specific class
  const handleSubmitClassChanges = async (classId: string) => {
    const editedClass = editedData.find((c) => c._id === classId);
    const originalClass = originalData.find((c) => c._id === classId);

    if (!editedClass || !originalClass) return;

    // Check if there are any changes
    const hasChanges =
      editedClass.className !== originalClass.className ||
      JSON.stringify(editedClass.subjects) !==
        JSON.stringify(originalClass.subjects);

    if (!hasChanges) {
      toast.error("No changes detected", { duration: 2000, icon: "⚠️" });
      return;
    }

    const payload = {
      _id: editedClass._id,
      className: editedClass.className,
      subjects: editedClass.subjects,
    };

    try {
      const res = await updateSubjects(payload).unwrap();

      if (res.data.success) {
        toast.success(
          <div>
            <p className="font-bold text-green-600">✓ Success!</p>
          </div>,
          { duration: 3000, icon: "✅" },
        );
        refetch();
      } else {
        toast.error(
          <div>
            <p className="font-bold text-red-600">✗ Update Failed</p>
            <p className="text-sm text-gray-600">
              No changes were saved to the database
            </p>
          </div>,
          { duration: 4000, icon: "❌" },
        );
      }
    } catch (err) {
      toast.error(
        <div>
          <p className="font-bold text-red-600">✗ Error</p>
          <p className="text-sm text-gray-600">Failed to update subjects</p>
        </div>,
        { duration: 4000, icon: "❌" },
      );
      console.error("Update error:", err);
    }

    setEditingClassId(null);
  };

  // Handle delete class
  const handleDeleteClass = async (id: string, className: string) => {
    if (
      window.confirm(`Are you sure you want to delete "${className}" class?`)
    ) {
      const payload = {
        _id: id,
      };

      try {
        const res = await deleteSubjects(payload).unwrap();
        console.log("Delete Response:", res);

        console.log(res.data.success);

        if (res.data.success) {
          toast.success(
            <div>
              <p className="font-bold text-green-600">✓ Deleted!</p>
              <p className="text-sm text-gray-600">
                {className} removed successfully
              </p>
            </div>,
            { duration: 3000, icon: "🗑️" },
          );
          refetch();
        } else {
          toast.error(
            <div>
              <p className="font-bold text-red-600">✗ Delete Failed</p>
              <p className="text-sm text-gray-600">
                No changes were made to the database
              </p>
            </div>,
            { duration: 4000, icon: "❌" },
          );
        }
      } catch (err) {
        toast.error(
          <div>
            <p className="font-bold text-red-600">✗ Error</p>
            <p className="text-sm text-gray-600">Failed to delete class</p>
          </div>,
          { duration: 4000, icon: "❌" },
        );
        console.error("Delete error:", err);
      }

      setEditedData((prevData) => prevData.filter((item) => item._id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Failed to Load Subjects
            </h3>
            <p className="text-red-600">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  if (deleting) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          {/* Title and Stats Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="w-full lg:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                All Academic Subjects
              </h1>
              <p className="text-sm sm:text-base text-gray-500">
                Total {totalSubjects} subjects across {allSubjects.length}{" "}
                classes
              </p>
            </div>

            {/* Stats and Add Button - Responsive Grid */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              {/* Stats Cards */}
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-1 sm:flex-none bg-blue-50 rounded-xl px-4 py-2.5 text-center">
                  <span className="block text-xl sm:text-2xl font-bold text-blue-600">
                    {allSubjects.length}
                  </span>
                  <span className="text-xs text-gray-600">Classes</span>
                </div>
                <div className="flex-1 sm:flex-none bg-green-50 rounded-xl px-4 py-2.5 text-center">
                  <span className="block text-xl sm:text-2xl font-bold text-green-600">
                    {totalSubjects}
                  </span>
                  <span className="text-xs text-gray-600">Subjects</span>
                </div>
              </div>

              {/* Add New Subject Button */}
              <Link
                href="/dashboard/academic-management"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Subjects
                </button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Search Subjects
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by subject name or class..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Class Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Filter by Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                >
                  {classNames.map((className) => (
                    <option key={className} value={className}>
                      {className === "all" ? "All Classes" : className}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects List */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No subjects found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Try adjusting your search or filter
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedClass("all");
              }}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredSubjects.map((classData: Subject | EditedSubject) => {
              const isEditing = editingClassId === classData._id;
              const originalClass = originalData.find(
                (o) => o._id === classData._id,
              );
              const hasChanges =
                isEditing &&
                originalClass &&
                (originalClass.className !== classData.className ||
                  JSON.stringify(originalClass.subjects) !==
                    JSON.stringify(classData.subjects));

              return (
                <div
                  key={classData._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all ${
                    hasChanges ? "ring-2 ring-yellow-400 ring-offset-2" : ""
                  }`}
                >
                  {/* Class Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="text"
                                value={classData.className}
                                onChange={(e) =>
                                  handleClassNameChange(
                                    classData._id,
                                    e.target.value,
                                  )
                                }
                                className="w-full sm:w-auto px-3 py-1.5 text-gray-900 rounded-lg border border-white/30 bg-white/95 focus:outline-none focus:ring-2 focus:ring-white text-base sm:text-lg font-medium"
                                placeholder="Class name"
                              />
                              {hasChanges && (
                                <span className="inline-block text-xs bg-yellow-500 text-white px-2 py-1 rounded-lg whitespace-nowrap">
                                  Modified
                                </span>
                              )}
                            </div>
                          ) : (
                            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                              {classData.className}
                            </h2>
                          )}
                          <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                            {classData.subjects.length} Subject
                            {classData.subjects.length !== 1 ? "s" : ""}
                            {isEditing && (
                              <span className="ml-2 inline-block text-xs bg-white/20 px-2 py-0.5 rounded-lg">
                                ID: {classData._id.slice(-6)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons - Responsive */}
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditClick(classData._id)}
                              className="flex-1 sm:flex-none px-3 py-1.5 bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClass(
                                  classData._id,
                                  classData.className,
                                )
                              }
                              className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500/90 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAddSubject(classData._id)}
                              className="flex-1 sm:flex-none px-3 py-1.5 bg-green-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              Add
                            </button>
                            <button
                              onClick={() =>
                                handleSubmitClassChanges(classData._id)
                              }
                              disabled={updatingSubject}
                              className="flex-1 sm:flex-none px-3 py-1.5 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                              {updatingSubject ? (
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="animate-spin h-4 w-4"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                  </svg>
                                  Saving
                                </span>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Save
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subjects Grid */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {classData.subjects.map(
                        (subject: string, index: number) => {
                          const originalSubject =
                            originalClass?.subjects[index];
                          const subjectHasChanged =
                            isEditing &&
                            originalSubject &&
                            originalSubject !== subject;

                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl transition-all group ${
                                subjectHasChanged
                                  ? "bg-yellow-50 border border-yellow-200"
                                  : isEditing
                                    ? "bg-white border border-blue-200 hover:bg-blue-50"
                                    : "bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                                  subjectHasChanged
                                    ? "bg-yellow-200 text-yellow-700"
                                    : isEditing
                                      ? "bg-blue-200 text-blue-700"
                                      : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                                } transition-colors`}
                              >
                                {index + 1}
                              </span>

                              {isEditing ? (
                                <>
                                  <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) =>
                                      handleSubjectChange(
                                        classData._id,
                                        index,
                                        e.target.value,
                                      )
                                    }
                                    className="flex-1 min-w-0 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    placeholder="Subject"
                                  />
                                  <button
                                    onClick={() =>
                                      handleRemoveSubject(classData._id, index)
                                    }
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                    title="Remove subject"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                                  {subject}
                                </span>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>📚</span> Total: {classData.subjects.length}{" "}
                        subjects
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🆔</span> ID: {classData._id.slice(-6)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📅</span> Version: v{classData.__v}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Footer */}
        {filteredSubjects.length > 0 && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-sm text-gray-600 border border-gray-100">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span>
                Showing{" "}
                <strong className="text-blue-600">
                  {filteredSubjects.length}
                </strong>{" "}
                of{" "}
                <strong className="text-blue-600">{allSubjects.length}</strong>{" "}
                classes
              </span>
              <span>
                Total{" "}
                <strong className="text-green-600">
                  {filteredSubjects.reduce(
                    (acc, curr) => acc + curr.subjects.length,
                    0,
                  )}
                </strong>{" "}
                subjects displayed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAcademicSubjects;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
