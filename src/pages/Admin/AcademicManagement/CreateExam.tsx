"use client";

import {
  useCreateExamMutation,
  useGetAllExamsQuery,
  useDeleteExamMutation,
  useUpdateExamMutation,
  useGenerateCombinedExamMutation,
} from "@/redux/features/academic/academicApi";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateExam = () => {
  const [examData, setExamData] = useState({
    name: "",
    contributionPercentage: "",
    year: new Date().getFullYear().toString(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState("All");

  // --- Updated State for Combined Exam ---
  // এখন শুধু ID নয়, নামও রাখছি দেখানোর জন্য
  const [selectedExams, setSelectedExams] = useState<
    { id: string; name: string }[]
  >([]);
  // প্রতিটি এক্সামের ওয়েইট স্টোর করার জন্য Object State
  const [examWeights, setExamWeights] = useState<Record<string, number>>({});

  const [combinedExamData, setCombinedExamData] = useState({
    name: "",
    year: new Date().getFullYear().toString(),
  });

  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [deleteExam] = useDeleteExamMutation();
  const [updateExam] = useUpdateExamMutation();
  const [generateCombinedExam, { isLoading: isGenerating }] =
    useGenerateCombinedExamMutation();

  const {
    data: exams,
    refetch,
    isLoading: isFetching,
  } = useGetAllExamsQuery(filterYear === "All" ? "" : filterYear);

  const uniqueYears = exams?.data?.data?.meta?.years || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExam({
          _id: editingId,
          ...examData,
          contributionPercentage: Number(examData.contributionPercentage),
        }).unwrap();
        toast.success("Exam updated successfully!");
      } else {
        await createExam({
          ...examData,
          contributionPercentage: Number(examData.contributionPercentage),
        }).unwrap();
        toast.success("Exam created successfully!");
      }
      setExamData({
        name: "",
        contributionPercentage: "",
        year: new Date().getFullYear().toString(),
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteExam({ _id: id }).unwrap();
      toast.success("Deleted successfully");
      refetch();
    } catch (error) {}
  };

  const handleEdit = (exam: any) => {
    setEditingId(exam._id);
    setExamData({
      name: exam.name,
      contributionPercentage: exam.contributionPercentage.toString(),
      year: exam.year,
    });
  };

  // --- Updated Handlers (Combined Exam) ---
  const handleCheckboxChange = (exam: any) => {
    const isSelected = selectedExams.find((e) => e.id === exam._id);

    if (isSelected) {
      // রিমুভ করা
      setSelectedExams(selectedExams.filter((e) => e.id !== exam._id));
      const updatedWeights = { ...examWeights };
      delete updatedWeights[exam._id];
      setExamWeights(updatedWeights);
    } else {
      // অ্যাড করা এবং ডিফল্ট ওয়েইট 0 সেট করা
      setSelectedExams([...selectedExams, { id: exam._id, name: exam.name }]);
      setExamWeights({ ...examWeights, [exam._id]: 0 });
    }
  };

  // ডায়নামিক ওয়েইট ইনপুট চেঞ্জ
  const handleWeightChange = (id: string, value: string) => {
    setExamWeights({ ...examWeights, [id]: Number(value) });
  };

  const handleCombinedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedExams.length < 2) {
      toast.error("Please select at least 2 exams to combine!");
      return;
    }

    // ব্যাকএন্ডের জন্য সোর্স ডাটা তৈরি করা
    const sourceExamsPayload = selectedExams.map((ex) => ({
      examId: ex.id,
      weight: examWeights[ex.id] || 0, // ইনপুট দেওয়া ওয়েইট পাঠানো হচ্ছে
    }));

    try {
      await generateCombinedExam({
        newExamName: combinedExamData.name,
        year: combinedExamData.year,
        sourceExams: sourceExamsPayload, // { examId, weight } এর অ্যারে
      }).unwrap();

      toast.success("Combined Exam generated successfully!");

      setSelectedExams([]);
      setExamWeights({});
      setCombinedExamData({
        name: "",
        year: new Date().getFullYear().toString(),
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to generate combined exam");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Existing Create/Update Form Section (Hidden for brevity, keep as is) */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Update Exam" : "Create Exam"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={examData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Exam Name"
            required
          />
          <input
            type="number"
            name="contributionPercentage"
            value={examData.contributionPercentage}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Contribution (%)"
            required
          />
          <input
            type="text"
            name="year"
            value={examData.year}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            placeholder="Year"
            required
          />
          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Exam" : "Create Exam"}
          </button>
        </form>
      </div>

      {/* Exam List Section */}
      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Exam List</h2>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">All Years</option>
            {uniqueYears.map((y: any) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {isFetching ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2">
            {exams?.data?.data?.data?.map((exam: any) => (
              <li
                key={exam._id}
                className="flex justify-between items-center border-b p-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={!!selectedExams.find((e) => e.id === exam._id)}
                    onChange={() => handleCheckboxChange(exam)}
                  />
                  <span>
                    {exam.name} - {exam.year}
                  </span>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(exam)}
                    className="text-blue-500 hover:underline"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- NEW: Combined Exam Form Section --- */}
      {selectedExams.length > 0 && (
        <div className="bg-green-50 p-6 rounded shadow-md border border-green-200">
          <h2 className="text-xl font-bold mb-2 text-green-800">
            Generate Combined Exam
          </h2>
          <p className="text-sm text-green-700 mb-4">
            Set the marks weight for each selected exam.
          </p>

          <form onSubmit={handleCombinedSubmit} className="space-y-4">
            {/* নির্বাচিত এক্সামগুলোর ওয়েইট ইনপুট */}
            <div className="space-y-3 p-4 bg-white rounded border">
              <h3 className="font-semibold text-gray-700 text-sm">
                Assign Marks (Weight)
              </h3>
              {selectedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm text-gray-700">{exam.name}</label>
                  <input
                    type="number"
                    value={
                      examWeights[exam.id] === 0 ? "" : examWeights[exam.id]
                    }
                    onChange={(e) =>
                      handleWeightChange(exam.id, e.target.value)
                    }
                    placeholder="Enter marks to take"
                    className="border p-1 rounded w-40 text-sm"
                    required
                  />
                </div>
              ))}
            </div>

            <input
              type="text"
              name="name"
              value={combinedExamData.name}
              onChange={(e) =>
                setCombinedExamData({
                  ...combinedExamData,
                  name: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              placeholder="Combined Exam Name (e.g., 1st Semester)"
              required
            />

            <input
              type="text"
              name="year"
              value={combinedExamData.year}
              onChange={(e) =>
                setCombinedExamData({
                  ...combinedExamData,
                  year: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
              placeholder="Year"
              required
            />

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Combined Result"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateExam;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
