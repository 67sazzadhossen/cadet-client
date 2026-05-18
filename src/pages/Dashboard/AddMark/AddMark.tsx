"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import {
  useGetAllSubjectsQuery,
  useSaveMarksMutation,
  useGetMarksQuery,
} from "@/redux/features/academic/academicApi";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

interface StudentMarks {
  monthly1?: number;
  monthly2?: number;
  classTest?: number;
  activities?: number;
  semester?: number;
}

interface ExamConfig {
  monthly1FullMark: number;
  monthly1Weight: number;
  monthly2FullMark: number;
  monthly2Weight: number;
  classTestFullMark: number;
  classTestWeight: number;
  activitiesFullMark: number;
  activitiesWeight: number;
  semesterFullMark: number;
  semesterWeight: number;
}

const AddMark = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamName, setSelectedExamName] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("english"); // নতুন যুক্ত করা হয়েছে
  const [selectedIsCadet, setSelectedIsCadet] = useState(false); // নতুন যুক্ত করা হয়েছে
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );

  const [config, setConfig] = useState<ExamConfig>({
    monthly1FullMark: 15,
    monthly1Weight: 5,
    monthly2FullMark: 15,
    monthly2Weight: 5,
    classTestFullMark: 10,
    classTestWeight: 10,
    activitiesFullMark: 10,
    activitiesWeight: 10,
    semesterFullMark: 70,
    semesterWeight: 70,
  });

  const [marks, setMarks] = useState<Record<string, StudentMarks>>({});
  const [saveMarks, { isLoading: isSaving }] = useSaveMarksMutation();

  const { data: subjectsData, isLoading: subjectLoading } =
    useGetAllSubjectsQuery(undefined);

  // Student query তে version এবং isCadet পাঠানো হয়েছে
  const { data: studentData } = useGetAllStudentsQuery(
    {
      search: "",
      class: selectedClass,
      version: selectedVersion,
      isCadet: true,
      page: 1,
      limit: 1000,
    },
    { skip: !selectedClass },
  );

  // Marks query তে version এবং isCadet পাঠানো হয়েছে
  const { data: existingMarksData } = useGetMarksQuery(
    {
      class: selectedClass,
      subject: selectedSubject,
      examName: selectedExamName,
      year: selectedYear,
      version: selectedVersion,
      isCadet: selectedIsCadet,
    },
    { skip: !selectedClass || !selectedSubject || !selectedExamName },
  );

  const isJuniorClass = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
  ].includes(selectedClass);

  const effectiveCTWeight = isJuniorClass ? config.classTestWeight : 0;
  const effectiveActWeight = isJuniorClass ? config.activitiesWeight : 0;

  const totalWeight =
    config.monthly1Weight +
    config.monthly2Weight +
    effectiveCTWeight +
    effectiveActWeight +
    config.semesterWeight;

  useEffect(() => {
    const marksFromDb = existingMarksData?.data?.data?.marks;
    if (marksFromDb && marksFromDb.length > 0) {
      const dbMarks: Record<string, StudentMarks> = {};
      marksFromDb.forEach((item: any) => {
        dbMarks[item.studentId] = {
          monthly1: item.monthly1,
          monthly2: item.monthly2,
          classTest: item.classTest,
          activities: item.activities,
          semester: item.semester,
        };
      });
      setMarks(dbMarks);
      const firstEntry = marksFromDb[0];
      setConfig({
        monthly1FullMark: firstEntry.monthly1FullMark ?? 15,
        monthly1Weight: firstEntry.monthly1Weight ?? 5,
        monthly2FullMark: firstEntry.monthly2FullMark ?? 15,
        monthly2Weight: firstEntry.monthly2Weight ?? 5,
        classTestFullMark: firstEntry.classTestFullMark ?? 10,
        classTestWeight: firstEntry.classTestWeight ?? 10,
        activitiesFullMark: firstEntry.activitiesFullMark ?? 10,
        activitiesWeight: firstEntry.activitiesWeight ?? 10,
        semesterFullMark: firstEntry.semesterFullMark ?? 70,
        semesterWeight: firstEntry.semesterWeight ?? 70,
      });
    } else {
      setMarks({});
    }
  }, [
    existingMarksData,
    selectedClass,
    selectedSubject,
    selectedExamName,
    selectedYear,
    selectedVersion,
    selectedIsCadet,
  ]);

  const handleSubmit = useCallback(async () => {
    if (
      !selectedClass ||
      !selectedSubject ||
      !selectedExamName ||
      !selectedYear
    ) {
      return toast.error("সবগুলো ফিল্ড সিলেক্ট করুন");
    }

    // এখানে শর্ত পরিবর্তন করে ১০০ অথবা ৫০ চেক করা হয়েছে
    if (totalWeight !== 100 && totalWeight !== 50) {
      return toast.error(
        `Weight (%) এর যোগফল ১০০ অথবা ৫০ হতে হবে। বর্তমানে: ${totalWeight}`,
      );
    }

    const formattedMarks = Object.entries(marks).map(
      ([studentId, markData]) => ({
        studentId,
        ...markData,
        monthly1FullMark: config.monthly1FullMark,
        monthly1Weight: config.monthly1Weight,
        monthly2FullMark: config.monthly2FullMark,
        monthly2Weight: config.monthly2Weight,
        classTestFullMark: isJuniorClass ? config.classTestFullMark : 0,
        classTestWeight: isJuniorClass ? config.classTestWeight : 0,
        activitiesFullMark: isJuniorClass ? config.activitiesFullMark : 0,
        activitiesWeight: isJuniorClass ? config.activitiesWeight : 0,
        semesterFullMark: config.semesterFullMark,
        semesterWeight: config.semesterWeight,
      }),
    );

    try {
      await saveMarks({
        class: selectedClass,
        subject: selectedSubject,
        examName: selectedExamName,
        year: selectedYear,
        version: selectedVersion,
        isCadet: selectedIsCadet,
        marks: formattedMarks,
      }).unwrap();
      toast.success("সফলভাবে সেভ হয়েছে!");
    } catch (error: any) {
      toast.error(error?.data?.message || "কিছু ভুল হয়েছে");
    }
  }, [
    selectedClass,
    selectedSubject,
    selectedExamName,
    selectedYear,
    selectedVersion,
    selectedIsCadet,
    marks,
    config,
    isJuniorClass,
    saveMarks,
    totalWeight,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit]);

  const allSubjects = subjectsData?.data?.data || [];
  const rawStudents = studentData?.data?.data?.data || [];

  // ক্লায়েন্ট-সাইডে Cadet Status এর উপর ভিত্তি করে ফিল্টারিং করা হয়েছে
  const students = rawStudents.filter(
    (student: any) => (student.isCadet ?? false) === selectedIsCadet,
  );

  const selectedClassData = allSubjects.find(
    (item: any) => item.className === selectedClass,
  );
  const classSubjects = selectedClassData?.subjects || [];
  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
  );

  const handleConfigChange = (field: keyof ExamConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value === "" ? 0 : Number(value),
    }));
  };

  const handleMarkChange = (
    studentId: string,
    field: keyof StudentMarks,
    value: string,
  ) => {
    const numValue = value === "" ? undefined : Number(value);

    setMarks((prev) => ({
      ...prev, // ১. আগে যত স্টুডেন্টের ডেটা ছিল সব ঠিক থাকবে
      [studentId]: {
        ...(prev[studentId] || {}), // ২. ওই নির্দিষ্ট স্টুডেন্টের আগের সব ফিল্ড (monthly1, monthly2 ইত্যাদি) ঠিক থাকবে
        [field]: numValue, // ৩. শুধুমাত্র বর্তমান ফিল্ডটি আপডেট হবে
      },
    }));
  };

  if (subjectLoading) return <LoadingAnimation />;

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {isSaving && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-semibold">Saving Marks...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-center italic">
        Manage Academic Marks
      </h1>

      {/* Selectors */}
      <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-2 md:grid-cols-6 gap-3 border">
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

        {/* Version Dropdown */}
        <select
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="bangla">Bangla Version</option>
          <option value="english">English Version</option>
        </select>

        {/* Cadet Status Dropdown */}
        <select
          value={selectedIsCadet ? "true" : "false"}
          onChange={(e) => setSelectedIsCadet(e.target.value === "true")}
          className="border p-2 rounded"
        >
          <option value="false">Non-Cadet</option>
          <option value="true">Cadet</option>
        </select>

        <select
          disabled={!selectedClass}
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border p-2 rounded disabled:bg-gray-100"
        >
          <option value="">Select Subject</option>
          {classSubjects.map((sub: string, idx: number) => (
            <option key={idx} value={sub}>
              {sub}
            </option>
          ))}
        </select>
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

      {/* Config Section */}
      {selectedSubject && selectedExamName && (
        <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
          <h2 className="text-sm font-bold text-gray-600 uppercase border-b pb-1 flex justify-between">
            <span>Exam Config (Dynamic)</span>
            {totalWeight !== 100 && totalWeight !== 50 && (
              <span className="text-red-500 font-bold">
                Total Weight: {totalWeight}% (Must be 100 or 50)
              </span>
            )}
          </h2>
          <div
            className={`grid gap-4 text-xs ${isJuniorClass ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-3"}`}
          >
            <div className="p-2 bg-white border rounded">
              <span className="font-bold block mb-1">1st Monthly</span>
              <input
                type="number"
                className="w-full border rounded mb-1 p-1 text-center"
                value={config.monthly1FullMark}
                onChange={(e) =>
                  handleConfigChange("monthly1FullMark", e.target.value)
                }
              />
              <input
                type="number"
                className={`w-full border rounded p-1 text-center ${totalWeight !== 100 && totalWeight !== 50 ? "border-red-500 bg-red-50" : "bg-blue-50"}`}
                value={config.monthly1Weight}
                onChange={(e) =>
                  handleConfigChange("monthly1Weight", e.target.value)
                }
              />
            </div>
            <div className="p-2 bg-white border rounded">
              <span className="font-bold block mb-1">2nd Monthly</span>
              <input
                type="number"
                className="w-full border rounded mb-1 p-1 text-center"
                value={config.monthly2FullMark}
                onChange={(e) =>
                  handleConfigChange("monthly2FullMark", e.target.value)
                }
              />
              <input
                type="number"
                className={`w-full border rounded p-1 text-center ${totalWeight !== 100 && totalWeight !== 50 ? "border-red-500 bg-red-50" : "bg-blue-50"}`}
                value={config.monthly2Weight}
                onChange={(e) =>
                  handleConfigChange("monthly2Weight", e.target.value)
                }
              />
            </div>
            {isJuniorClass && (
              <>
                <div className="p-2 bg-white border rounded">
                  <span className="font-bold block mb-1">Class Test</span>
                  <input
                    type="number"
                    className="w-full border rounded mb-1 p-1 text-center"
                    value={config.classTestFullMark}
                    onChange={(e) =>
                      handleConfigChange("classTestFullMark", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className={`w-full border rounded p-1 text-center ${totalWeight !== 100 && totalWeight !== 50 ? "border-red-500 bg-red-50" : "bg-blue-50"}`}
                    value={config.classTestWeight}
                    onChange={(e) =>
                      handleConfigChange("classTestWeight", e.target.value)
                    }
                  />
                </div>
                <div className="p-2 bg-white border rounded">
                  <span className="font-bold block mb-1">Activities</span>
                  <input
                    type="number"
                    className="w-full border rounded mb-1 p-1 text-center"
                    value={config.activitiesFullMark}
                    onChange={(e) =>
                      handleConfigChange("activitiesFullMark", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    className={`w-full border rounded p-1 text-center ${totalWeight !== 100 && totalWeight !== 50 ? "border-red-500 bg-red-50" : "bg-blue-50"}`}
                    value={config.activitiesWeight}
                    onChange={(e) =>
                      handleConfigChange("activitiesWeight", e.target.value)
                    }
                  />
                </div>
              </>
            )}
            <div className="p-2 bg-white border rounded">
              <span className="font-bold block mb-1">Semester</span>
              <input
                type="number"
                className="w-full border rounded mb-1 p-1 text-center"
                value={config.semesterFullMark}
                onChange={(e) =>
                  handleConfigChange("semesterFullMark", e.target.value)
                }
              />
              <input
                type="number"
                className={`w-full border rounded p-1 text-center ${totalWeight !== 100 && totalWeight !== 50 ? "border-red-500 bg-red-50" : "bg-blue-50"}`}
                value={config.semesterWeight}
                onChange={(e) =>
                  handleConfigChange("semesterWeight", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Marks Entry Table */}
      {selectedSubject && selectedExamName && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-center">
                  1st Monthly ({config.monthly1FullMark})
                </th>
                <th className="p-3 text-center">
                  2nd Monthly ({config.monthly2FullMark})
                </th>
                {isJuniorClass && (
                  <>
                    <th className="p-3 text-center">
                      CT ({config.classTestFullMark})
                    </th>
                    <th className="p-3 text-center">
                      Activities ({config.activitiesFullMark})
                    </th>
                  </>
                )}
                <th className="p-3 text-center">
                  Semester ({config.semesterFullMark})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((student: any) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-bold">{student.name?.englishName}</p>
                    <p className="text-xs text-gray-500">
                      Roll: {student.rollNo}
                    </p>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className={`w-20 mx-auto border rounded p-1 text-center block ${(marks[student.id]?.monthly1 || 0) > config.monthly1FullMark ? "border-red-500 bg-red-50 text-red-600" : ""}`}
                      value={marks[student.id]?.monthly1 ?? ""}
                      onChange={(e) =>
                        handleMarkChange(student.id, "monthly1", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className={`w-20 mx-auto border rounded p-1 text-center block ${(marks[student.id]?.monthly2 || 0) > config.monthly2FullMark ? "border-red-500 bg-red-50 text-red-600" : ""}`}
                      value={marks[student.id]?.monthly2 ?? ""}
                      onChange={(e) =>
                        handleMarkChange(student.id, "monthly2", e.target.value)
                      }
                    />
                  </td>
                  {isJuniorClass && (
                    <>
                      <td className="p-3">
                        <input
                          type="number"
                          className={`w-20 mx-auto border rounded p-1 text-center block ${(marks[student.id]?.classTest || 0) > config.classTestFullMark ? "border-red-500 bg-red-50 text-red-600" : ""}`}
                          value={marks[student.id]?.classTest ?? ""}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              "classTest",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          className={`w-20 mx-auto border rounded p-1 text-center block ${(marks[student.id]?.activities || 0) > config.activitiesFullMark ? "border-red-500 bg-red-50 text-red-600" : ""}`}
                          value={marks[student.id]?.activities ?? ""}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              "activities",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                    </>
                  )}
                  <td className="p-3">
                    <input
                      type="number"
                      className={`w-20 mx-auto border rounded p-1 text-center block ${(marks[student.id]?.semester || 0) > config.semesterFullMark ? "border-red-500 bg-red-50 text-red-600" : ""}`}
                      value={marks[student.id]?.semester ?? ""}
                      onChange={(e) =>
                        handleMarkChange(student.id, "semester", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FiCheck /> Save All Marks
          </button>
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
