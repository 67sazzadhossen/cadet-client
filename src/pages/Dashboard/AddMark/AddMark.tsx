"use client";

import React, { useState, useEffect } from "react";
import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import {
  useGetAllSubjectsQuery,
  useSaveMarksMutation,
  useGetMarksQuery,
} from "@/redux/features/academic/academicApi";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

// Mark structure er jonne interface
interface StudentMarks {
  monthly1?: number;
  monthly2?: number;
  classTest?: number;
  semester?: number;
}

const AddMark = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamName, setSelectedExamName] = useState(""); // 👈 Notun State
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  ); // 👈 Notun State (Default current year)

  // Record<studentId, StudentMarks object>
  const [marks, setMarks] = useState<Record<string, StudentMarks>>({});
  const [saveMarks, { isLoading: isSaving }] = useSaveMarksMutation();

  const { data: subjectsData, isLoading: subjectLoading } =
    useGetAllSubjectsQuery(undefined);

  const { data: studentData, isLoading: studentLoading } =
    useGetAllStudentsQuery(
      {
        search: "",
        class: selectedClass,
        version: "",
        page: 1,
        limit: 1000,
      },
      { skip: !selectedClass },
    );

  // 🔍 Existing Marks Fetching Logic
  const { data: existingMarksData, isFetching: isFetchingMarks } =
    useGetMarksQuery(
      {
        class: selectedClass,
        subject: selectedSubject,
        examName: selectedExamName, // 👈 Payload update
        year: selectedYear, // 👈 Payload update
      },
      { skip: !selectedClass || !selectedSubject || !selectedExamName },
    );

  // 🔄 DB theke data asle seta marks state e set kora
  useEffect(() => {
    if (existingMarksData?.data?.data?.marks) {
      const dbMarks: Record<string, StudentMarks> = {};
      existingMarksData.data.data.marks.forEach((item: any) => {
        dbMarks[item.studentId] = {
          monthly1: item.monthly1,
          monthly2: item.monthly2,
          classTest: item.classTest,
          semester: item.semester,
        };
      });
      setMarks(dbMarks);
    } else {
      // Jodi oi semester/year e kono data na thake, tobe state clear kore dibe
      setMarks({});
    }
  }, [
    existingMarksData,
    selectedClass,
    selectedSubject,
    selectedExamName,
    selectedYear,
  ]);

  const allSubjects = subjectsData?.data?.data || [];
  const students = studentData?.data?.data?.data || [];
  const selectedClassData = allSubjects.find(
    (item: any) => item.className === selectedClass,
  );
  const classSubjects = selectedClassData?.subjects || [];

  // Year generate korar jonne (Current year theke 5 bochor piche porjonto)
  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

  // Input field change handle korar jonne function
  const handleMarkChange = (
    studentId: string,
    field: keyof StudentMarks,
    value: string,
  ) => {
    const numValue = value === "" ? undefined : Number(value);
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: numValue,
      },
    }));
  };

  const handleSubmit = async () => {
    if (
      !selectedClass ||
      !selectedSubject ||
      !selectedExamName ||
      !selectedYear
    ) {
      return toast.error("Class, Subject, Exam ebong Year select korun");
    }

    // Payload ready kora
    const formattedMarks = Object.entries(marks).map(
      ([studentId, markData]) => ({
        studentId,
        ...markData,
      }),
    );

    if (formattedMarks.length === 0) {
      return toast.error("At least ekjon student er mark din");
    }

    const payload = {
      class: selectedClass,
      subject: selectedSubject,
      examName: selectedExamName, // 👈 Add kora hoyeche
      year: selectedYear, // 👈 Add kora hoyeche
      marks: formattedMarks,
    };

    try {
      const res = await saveMarks(payload).unwrap();
      toast.success("Marks successfully save hoyeche!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Kichu vul hoyeche");
    }
  };

  // 🎹 Enter key handle korar function
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (subjectLoading) return <LoadingAnimation />;

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      {/* 🟢 Saving Overlay - Full Screen Faded */}
      {isSaving && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700 animate-pulse">
              Saving Marks...
            </p>
            <p className="text-sm text-gray-500">
              Please do not close the window
            </p>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold text-center">Add Academic Marks</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Class Selection */}
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setSelectedSubject("");
            setMarks({});
          }}
          className="border p-2 rounded"
        >
          <option value="">Select Class</option>
          {allSubjects.map((cls: any) => (
            <option key={cls._id} value={cls.className}>
              {cls.className}
            </option>
          ))}
        </select>

        {/* Subject Selection */}
        <select
          disabled={!selectedClass}
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Subject</option>
          {classSubjects.map((sub: string, idx: number) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        {/* Exam Name Selection */}
        <select
          value={selectedExamName}
          onChange={(e) => setSelectedExamName(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Exam</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="3rd Semester">3rd Semester</option>
        </select>

        {/* Year Selection */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded"
        >
          {years.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {selectedSubject && selectedExamName && (
        <div className="mt-6">
          {studentLoading || isFetchingMarks ? (
            <LoadingAnimation />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Student Info</th>
                    <th className="border p-2">1st Monthly</th>
                    <th className="border p-2">2nd Monthly</th>
                    <th className="border p-2">Class Test</th>
                    <th className="border p-2">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="border p-2">
                        <p className="font-bold">{student.name?.englishName}</p>
                        <p className="text-xs text-gray-500">
                          Roll: {student.rollNo}
                        </p>
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded text-center"
                          value={marks[student.id]?.monthly1 ?? ""}
                          onKeyDown={handleKeyDown}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              "monthly1",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded text-center"
                          value={marks[student.id]?.monthly2 ?? ""}
                          onKeyDown={handleKeyDown}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              "monthly2",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded text-center"
                          value={marks[student.id]?.classTest ?? ""}
                          onKeyDown={handleKeyDown}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              "classTest",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded text-center"
                          value={marks[student.id]?.semester ?? ""}
                          onKeyDown={handleKeyDown}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              "semester",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {students.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded flex items-center justify-center gap-2 transition"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <FiCheck /> Submit All Marks
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddMark;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
