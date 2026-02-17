/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useCreateSubjectsMutation,
  useGetAllSubjectsQuery,
} from "@/redux/features/academic/academicApi";
import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

const AcademicManagement: React.FC = () => {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>("");
  const { refetch } = useGetAllSubjectsQuery(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createSubjects, { isLoading: creatingSubjects }] =
    useCreateSubjectsMutation();

  // Auto-hide error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Add new subject
  const handleAddSubject = (): void => {
    if (currentSubject.trim() !== "") {
      // Check for duplicate subjects
      if (subjects.includes(currentSubject.trim())) {
        toast.error("Subject already exists!", {
          duration: 2000,
          icon: "⚠️",
        });
        return;
      }
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject("");
      toast.success("Subject added!", { duration: 1500, icon: "➕" });
    } else {
      toast.error("Please enter a subject name", { duration: 1500 });
    }
  };

  // Remove subject
  const handleRemoveSubject = (indexToRemove: number): void => {
    const removedSubject = subjects[indexToRemove];
    setSubjects(subjects.filter((_, index) => index !== indexToRemove));
    toast.success(`"${removedSubject}" removed`, {
      duration: 1500,
      icon: "🗑️",
    });
  };

  // Handle Enter key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSubject();
    }
  };

  // Handle class change
  const handleClassChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const newClass = e.target.value;

    // If there are unsaved subjects, ask for confirmation
    if (subjects.length > 0 && newClass !== selectedClass) {
      if (
        window.confirm("Changing class will clear current subjects. Continue?")
      ) {
        setSelectedClass(newClass);
        setSubjects([]);
        setError(null);
        toast.success(`Switched to ${newClass || "no class"}`, {
          duration: 2000,
        });
      } else {
        // Reset the select value
        e.target.value = selectedClass;
        return;
      }
    } else {
      setSelectedClass(newClass);
      if (newClass) {
        toast.success(`Selected ${newClass}`, { duration: 1500 });
      }
    }
  };

  // Clear all subjects
  const handleClearAll = (): void => {
    if (subjects.length > 0) {
      if (window.confirm("Are you sure you want to clear all subjects?")) {
        setSubjects([]);
        toast.success("All subjects cleared!", { icon: "🧹" });
      }
    }
  };

  // Reset form after successful submission
  const resetForm = (): void => {
    setSelectedClass("");
    setSubjects([]);
    setCurrentSubject("");
    setError(null);
  };

  // Submit handler for saving data to API
  const handleSubmit = async (): Promise<void> => {
    // Validation
    if (!selectedClass) {
      setError("Please select a class");
      toast.error("Please select a class");
      return;
    }

    if (subjects.length === 0) {
      setError("Please add at least one subject");
      toast.error("Please add at least one subject");
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadingToast = toast.loading("Saving subjects...");

    try {
      // Prepare the data for API
      const payload = {
        className: selectedClass,
        subjects: subjects,
      };

      const res = await createSubjects(payload).unwrap();

      if (res?.data?.success) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Show success message
        toast.success(
          <div>
            <p className="font-bold text-green-600">✓ Success!</p>
            <p className="text-sm text-gray-600">
              {subjects.length} subject{subjects.length > 1 ? "s" : ""} saved
              for {selectedClass}
            </p>
          </div>,
          { duration: 4000, icon: "✅" },
        );

        // Refetch the data to update the list
        refetch();

        // Clear the form after successful submission
        resetForm();
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to save subjects", { duration: 3000 });
      }
    } catch (error: any) {
      // Handle error
      toast.dismiss(loadingToast);

      const errorMessage =
        error?.data?.message || error?.message || "Failed to save subjects";
      setError(errorMessage);

      toast.error(
        <div>
          <p className="font-bold text-red-600">✗ Error</p>
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </div>,
        { duration: 4000, icon: "❌" },
      );

      console.error("Error saving subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (creatingSubjects) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Title and View All Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Academic Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add and manage subjects for different classes
            </p>
          </div>

          {/* View All Subjects Button */}
          <Link href={"/dashboard/academic/all-subjects"}>
            <button className="inline-flex items-center px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              View All Subjects
            </button>
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600"
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
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Input Section */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                Add Subjects
              </h2>

              {/* Clear All Button */}
              {subjects.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
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
                  Clear All
                </button>
              )}
            </div>

            {/* Class Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                disabled={isLoading}
              >
                <option value="">Select a Class</option>
                <option value="Play">Play</option>
                <option value="Nursery">Nursery</option>
                <option value="KG">KG</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
              {!selectedClass && (
                <p className="mt-1 text-xs text-gray-500">
                  You must select a class to add subjects
                </p>
              )}
            </div>

            {/* Subject Input */}
            {selectedClass && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={currentSubject}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setCurrentSubject(e.target.value)
                        }
                        onKeyPress={handleKeyPress}
                        placeholder="Enter subject name"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                        disabled={isLoading}
                        maxLength={50}
                      />
                      {currentSubject && (
                        <button
                          onClick={() => setCurrentSubject("")}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
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
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleAddSubject}
                      disabled={isLoading || !currentSubject.trim()}
                      className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Press Enter to add quickly • Max 50 characters
                  </p>
                </div>

                {/* Add More Button */}
                <button
                  onClick={() => {
                    setCurrentSubject("");
                    (
                      document.querySelector(
                        'input[type="text"]',
                      ) as HTMLInputElement
                    )?.focus();
                  }}
                  disabled={isLoading}
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 disabled:opacity-50 transition-colors"
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
                  Add More
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Preview Section */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                Subjects Preview
              </h2>

              {/* Quick View Button for Current Class */}
              {selectedClass && subjects.length > 0 && (
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/academic/all-subjects?class=${encodeURIComponent(selectedClass)}`,
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View All
                </button>
              )}
            </div>

            {!selectedClass ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="text-gray-500 font-medium">
                  Please select a class to add subjects
                </p>
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                <p className="text-gray-500 font-medium">
                  No subjects added yet
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Add subjects using the form on the left
                </p>
              </div>
            ) : (
              <div className="animate-slideIn">
                {/* Summary Card */}
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Selected Class:</span>{" "}
                        <span className="text-blue-600 font-semibold text-lg">
                          {selectedClass}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Total Subjects:</span>{" "}
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          {subjects.length}
                        </span>
                      </p>
                    </div>
                    <div className="text-3xl text-blue-200 font-bold">
                      #{subjects.length}
                    </div>
                  </div>
                </div>

                {/* Subjects List */}
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {subjects.map((subject: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium group-hover:bg-blue-200 transition-colors">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {subject}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSubject(index)}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
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
                    </div>
                  ))}
                </div>

                {/* Save Button with Loading State */}
                <button
                  className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  onClick={handleSubmit}
                  disabled={isLoading || subjects.length === 0}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                      Saving {subjects.length} subjects...
                    </span>
                  ) : (
                    `Save Subjects for ${selectedClass} (${subjects.length})`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Card */}
        {subjects.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ready to save</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {subjects.length} Subject{subjects.length !== 1 ? "s" : ""}{" "}
                    for {selectedClass}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
              >
                Save Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default AcademicManagement;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
