"use client";

import React, { useState, useEffect } from "react";
import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import {
  useGetAllSubjectsQuery,
  useSaveMarksMutation,
} from "@/redux/features/academic/academicApi";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const AddMark = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [saveMarks, { isLoading }] = useSaveMarksMutation();

  // 📚 Subjects API
  const { data: subjectsData, isLoading: subjectLoading } =
    useGetAllSubjectsQuery(undefined);

  // 👨‍🎓 Students API (ONLY যখন class select হবে)
  const { data: studentData, isLoading: studentLoading } =
    useGetAllStudentsQuery(
      {
        search: "",
        class: selectedClass,
        version: "",
        page: 1,
        limit: 1000,
      },
      {
        skip: !selectedClass, // ❗ important
      },
    );

  // ✅ Safe data extract
  const allSubjects = subjectsData?.data?.data || [];
  const students = studentData?.data?.data?.data || [];

  // 🎯 Selected class subjects
  const selectedClassData = allSubjects.find(
    (item: any) => item.className === selectedClass,
  );

  const classSubjects = selectedClassData?.subjects || [];

  // 🧪 Debug logs
  useEffect(() => {
    console.log("Subjects 👉", subjectsData);
    console.log("Students 👉", studentData);
  }, [subjectsData, studentData]);

  // ✏️ Mark change
  const handleMarkChange = (studentId: string, value: number) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  // 🚀 Submit (console only)
  const handleSubmit = async () => {
    if (!selectedClass) {
      return toast.error("Class select korun");
    }

    if (!selectedSubject) {
      return toast.error("Subject select korun");
    }

    const formattedMarks = Object.entries(marks)
      .filter(([_, mark]) => mark !== undefined && mark !== null)
      .map(([studentId, mark]) => ({
        studentId,
        mark,
      }));

    if (formattedMarks.length === 0) {
      return toast.error("At least 1 mark din");
    }

    const payload = {
      class: selectedClass,
      subject: selectedSubject,
      marks: formattedMarks,
    };

    console.log("✅ FINAL PAYLOAD 👉", payload);

    const res = await saveMarks(payload).unwrap();
    console.log(res.data);

    toast.success("Console e payload dekhun ✅");
  };

  // ⏳ Loading
  if (subjectLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold">Add Marks</h1>

      {/* 📘 Class Select */}
      <select
        value={selectedClass}
        onChange={(e) => {
          setSelectedClass(e.target.value);
          setSelectedSubject("");
          setMarks({});
        }}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Class</option>
        {allSubjects.map((cls: any) => (
          <option key={cls._id} value={cls.className}>
            {cls.className}
          </option>
        ))}
      </select>

      {/* 📗 Subject Select */}
      {selectedClass && (
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Subject</option>
          {classSubjects.map((sub: string, idx: number) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      {/* 👨‍🎓 Student List */}
      {selectedSubject && (
        <>
          {studentLoading ? (
            <LoadingAnimation />
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">No students found</p>
          ) : (
            <div className="grid gap-3">
              {students.map((student: any) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between border p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{student.name?.englishName}</p>
                    <p className="text-xs text-gray-500">
                      Roll: {student.rollNo}
                    </p>
                  </div>

                  <input
                    type="number"
                    placeholder="Mark"
                    value={marks[student.id] || ""}
                    onChange={(e) =>
                      handleMarkChange(student.id, Number(e.target.value))
                    }
                    className="w-20 border p-1 rounded text-center"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ✅ Submit */}
      {selectedSubject && students.length > 0 && (
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded flex items-center justify-center gap-2"
        >
          <FiCheck />
          Submit Marks
        </button>
      )}
    </div>
  );
};

export default AddMark;
