"use client";

import {
  useCreateExamMutation,
  useGetAllExamsQuery,
  useDeleteExamMutation,
  useUpdateExamMutation,
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

  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [deleteExam] = useDeleteExamMutation();
  const [updateExam] = useUpdateExamMutation();

  // "All" হলে খালি স্ট্রিং পাঠাবে, অন্যথায় ইয়ার পাঠাবে
  const {
    data: exams,
    refetch,
    isLoading: isFetching,
  } = useGetAllExamsQuery(filterYear === "All" ? "" : filterYear);

  // ব্যাকএন্ডের 'meta' থেকে ইয়ারগুলো গ্রহণ করা হচ্ছে
  const uniqueYears = exams?.data?.data?.meta?.years || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", editingId ? "Update" : "Create", examData);

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
      console.error("Action Error:", error);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteExam({ _id: id }).unwrap();
      console.log("Deleted Exam ID:", id);
      toast.success("Deleted successfully");
      refetch();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleEdit = (exam: any) => {
    setEditingId(exam._id);
    setExamData({
      name: exam.name,
      contributionPercentage: exam.contributionPercentage.toString(),
      year: exam.year,
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Form Section */}
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

      {/* List Section */}
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
                <span>
                  {exam.name} ({exam.contributionPercentage}%) - {exam.year}
                </span>
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
    </div>
  );
};

export default CreateExam;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
