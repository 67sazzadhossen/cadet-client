"use client";

import React, { useState, useEffect } from "react";
import {
  useGetFilteredSubjectsQuery,
  useGetAllExamsQuery,
  useInputMarksMutation,
  useGetInputMarksQuery,
} from "@/redux/features/academic/academicApi";
import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import toast from "react-hot-toast";
import { classOptions } from "@/const/index.const";

const InputMarks = () => {
  const [filter, setFilter] = useState({
    className: classOptions[0],
    version: "bangla",
    isCadet: false,
  });
  const [editingStates, setEditingStates] = useState<Record<string, boolean>>(
    {},
  );

  const [examYear, setExamYear] = useState(new Date().getFullYear().toString());
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marksState, setMarksState] = useState<Record<string, number>>({});

  const { data: subjectsData } = useGetFilteredSubjectsQuery({
    className: filter.className,
    version: filter.version,
    isCadet: filter.isCadet,
  });

  const { data: examsData } = useGetAllExamsQuery(examYear);

  const { data: studentData, isFetching } = useGetAllStudentsQuery(
    {
      search: "",
      class: filter.className,
      version: filter.version,
      isCadet: filter.isCadet,
      page: 1,
      limit: 1000,
    },
    { skip: !filter.className },
  );

  // Existing marks fetch করার জন্য নতুন হুক
  const { data: existingMarksData } = useGetInputMarksQuery(
    { examId: selectedExam, subjectId: selectedSubject, year: examYear },
    { skip: !selectedExam || !selectedSubject },
  );

  console.log(existingMarksData);

  const [inputMarks, { isLoading: isSaving }] = useInputMarksMutation();

  const subjectList = subjectsData?.data?.data || [];
  const examList = examsData?.data?.data?.data || [];

  const rawStudents = studentData?.data?.data?.data || studentData?.data || [];
  const students = rawStudents.filter(
    (std: any) => (std.isCadet ?? false) === filter.isCadet,
  );

  // সার্ভার থেকে মার্কস আসলে তা state এ সেট করা
  useEffect(() => {
    // রেসপন্স স্ট্রাকচার অনুযায়ী: data -> data -> data -> marks
    // আপনার কনসোল লগ অনুযায়ী রেসপন্স টি অনেকটা এরকম:
    // { success: true, data: { data: { data: { marks: [...] } } } }

    // আসুন নিশ্চিতভাবে চেক করি কোথায় মার্কস আছে:
    const marksArray =
      existingMarksData?.data?.data?.data?.marks ||
      existingMarksData?.data?.data?.marks ||
      [];

    console.log("Extracted Marks Array:", marksArray); // এটি কনসোলে চেক করুন কি আসছে

    if (marksArray.length > 0) {
      const formattedMarks: Record<string, number> = {};

      marksArray.forEach((item: any) => {
        // studentId এখন একটি অবজেক্ট, তাই তার _id নিতে হবে
        const studentId = item.studentId?._id || item.studentId;

        if (studentId) {
          formattedMarks[studentId] = item.obtainedMark;
        }
      });

      setMarksState(formattedMarks);
    } else {
      setMarksState({});
    }
  }, [existingMarksData]);

  useEffect(() => {
    setEditingStates({}); // সব এডিট মোড রিসেট
  }, [selectedExam, selectedSubject]);

  const handleMarkChange = (studentId: string, value: string) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: value === "" ? 0 : Number(value),
    }));
  };

  const handleSaveMarks = async () => {
    console.log("clicked");
    if (!selectedExam || !selectedSubject) {
      return toast.error("Please select Exam and Subject!");
    }

    const payload = {
      examId: selectedExam,
      subjectId: selectedSubject,
      year: examYear,
      marks: Object.entries(marksState).map(([studentId, obtainedMark]) => ({
        studentId,
        obtainedMark,
      })),
    };

    try {
      const res = await inputMarks(payload).unwrap();
      console.log(res);
      toast.success("Marks saved successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save marks");
    }
  };

  useEffect(() => {
    setSelectedSubject("");
    setMarksState({});
  }, [filter.className, filter.isCadet, filter.version]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Input Marks</h1>

      {/* ফিল্টার সেকশন */}
      <div className="bg-white p-4 rounded border grid grid-cols-3 gap-4">
        <select
          value={filter.className}
          onChange={(e) => setFilter({ ...filter, className: e.target.value })}
          className="border p-2 rounded"
        >
          {classOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={filter.version}
          onChange={(e) => setFilter({ ...filter, version: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="bangla">Bangla Version</option>
          <option value="english">English Version</option>
        </select>

        <select
          value={String(filter.isCadet)}
          onChange={(e) =>
            setFilter({ ...filter, isCadet: e.target.value === "true" })
          }
          className="border p-2 rounded"
        >
          <option value="false">Non-Cadet</option>
          <option value="true">Cadet</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow grid grid-cols-2 gap-4">
        <select
          onChange={(e) => setSelectedExam(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Exam</option>
          {examList.map((ex: any) => (
            <option key={ex._id} value={ex._id}>
              {ex.name}
            </option>
          ))}
        </select>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Subject</option>
          {subjectList.map((sub: any) => (
            <option key={sub._id} value={sub._id}>
              {sub.subjectName}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded shadow">
        {/* ফিল্টার চেক করার নতুন লজিক */}
        {!selectedExam || !selectedSubject || !filter.className ? (
          <div className="text-center py-10 text-gray-500">
            <p>
              Please select Class, Exam, and Subject to see the student list.
            </p>
          </div>
        ) : isFetching ? (
          <p>Loading Students...</p>
        ) : (
          <table className="w-full border-collapse">
            {/* আপনার আগের টেবিল কোডটি এখানে থাকবে */}
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Roll</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((std: any) => (
                <tr key={std._id} className="border-b">
                  <td className="p-2 text-center">{std.rollNo}</td>
                  <td className="p-2">{std.name?.englishName}</td>
                  <td className="p-2 text-center relative group">
                    <input
                      type="number"
                      className={`border p-1 w-20 rounded ${
                        marksState[std._id] !== undefined &&
                        !editingStates[std._id]
                          ? "bg-gray-100"
                          : ""
                      }`}
                      value={marksState[std._id] ?? ""}
                      disabled={
                        marksState[std._id] !== undefined &&
                        !editingStates[std._id] &&
                        !Object.keys(editingStates).includes(std._id)
                      }
                      onChange={(e) => {
                        setEditingStates((prev) => ({
                          ...prev,
                          [std._id]: true,
                        }));
                        handleMarkChange(std._id, e.target.value);
                      }}
                    />
                    {marksState[std._id] !== undefined &&
                      !editingStates[std._id] && (
                        <button
                          className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded"
                          onClick={() =>
                            setEditingStates((prev) => ({
                              ...prev,
                              [std._id]: true,
                            }))
                          }
                        >
                          Edit
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* যদি লিস্ট থাকে তবেই Save বাটন দেখাবে */}
        {selectedExam &&
          selectedSubject &&
          filter.className &&
          students.length > 0 && (
            <button
              onClick={handleSaveMarks}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-bold"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Marks"}
            </button>
          )}
      </div>
    </div>
  );
};

export default InputMarks;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
