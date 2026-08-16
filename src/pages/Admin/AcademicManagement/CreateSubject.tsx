"use client";

import { classOptions } from "@/const/index.const";
import {
  useAddSubjectMutation,
  useGetFilteredSubjectsQuery,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
} from "@/redux/features/academic/academicApi";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const CreateSubject = () => {
  const [filter, setFilter] = useState({
    className: "",
    version: "",
    isCadet: "",
  });
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm();

  const [addSubject] = useAddSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();

  // ফিল্টার অবজেক্ট ক্লিন করার লজিক
  const memoizedFilter = useMemo(() => {
    const cleanFilter: any = {};
    if (filter.className) cleanFilter.className = filter.className;
    if (filter.version) cleanFilter.version = filter.version;
    if (filter.isCadet !== "") cleanFilter.isCadet = filter.isCadet;
    return cleanFilter;
  }, [filter]);

  const { data: subjects, refetch } =
    useGetFilteredSubjectsQuery(memoizedFilter);

  useEffect(() => {
    if (editingSubject) {
      resetEdit({
        subjectName: editingSubject.subjectName,
        className: editingSubject.class,
        subjectCode: editingSubject.subjectCode,
        version: editingSubject.version,
        isCadet: editingSubject.isCadet ? "true" : "false",
      });
    }
  }, [editingSubject, resetEdit]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      try {
        await deleteSubject({ _id: id }).unwrap();
        toast.success("Subject deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete!");
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data, isCadet: data.isCadet === "true" };
      const res = await addSubject(payload).unwrap();
      console.log(res.data);
      toast.success("Subject added successfully!");
      reset();
      refetch();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const onUpdate = async (data: any) => {
    try {
      const payload = {
        _id: editingSubject._id,
        ...data,
        isCadet: data.isCadet === "true",
      };
      await updateSubject(payload).unwrap();
      toast.success("Subject updated successfully!");
      setEditingSubject(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update!");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* ১. ফর্ম অংশ */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-50 p-6 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <h2 className="col-span-full text-xl font-bold">Add New Subject</h2>
        <input
          {...register("subjectName", { required: true })}
          placeholder="Subject Name"
          className="border p-2 rounded"
        />
        <select {...register("class")} className="border p-2 rounded">
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <input
          {...register("subjectCode")}
          placeholder="Code"
          className="border p-2 rounded"
        />
        <select {...register("version")} className="border p-2 rounded">
          <option value="bangla">Bangla</option>
          <option value="english">English</option>
        </select>
        <select {...register("isCadet")} className="border p-2 rounded">
          <option value="false">General</option>
          <option value="true">Cadet</option>
        </select>
        <button
          type="submit"
          className="col-span-full bg-blue-600 text-white p-2 rounded"
        >
          Add Subject
        </button>
      </form>

      {/* ২. ফিল্টার বার */}
      <div className="flex gap-4 p-4 bg-white border rounded items-center">
        <span className="font-bold">Filter:</span>
        <select
          onChange={(e) => setFilter({ ...filter, className: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">All Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, version: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">All Version</option>
          <option value="bangla">Bangla</option>
          <option value="english">English</option>
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, isCadet: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">All Type</option>
          <option value="false">General</option>
          <option value="true">Cadet</option>
        </select>
      </div>

      {/* ৩. টেবিল */}
      <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Class</th>
            <th className="p-3 border">Version</th>
            <th className="p-3 border">Type</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects?.data?.data?.map((sub: any) => (
            <tr key={sub._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{sub.subjectName}</td>
              <td className="p-3">{sub.class}</td>
              <td className="p-3">{sub.version}</td>
              <td className="p-3">{sub.isCadet ? "Cadet" : "General"}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => setEditingSubject(sub)}
                  className="text-blue-600 hover:underline"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* আপডেট মডাল */}
      {editingSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSubmitEdit(onUpdate)}
            className="bg-white p-6 rounded shadow-lg max-w-sm w-full space-y-4"
          >
            <h2 className="text-lg font-bold">Update Subject</h2>
            <input
              {...registerEdit("subjectName")}
              className="w-full border p-2 rounded"
              placeholder="Subject Name"
            />
            <select
              {...registerEdit("className")}
              className="w-full border p-2 rounded"
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <input
              {...registerEdit("subjectCode")}
              className="w-full border p-2 rounded"
              placeholder="Subject Code"
            />
            <select
              {...registerEdit("version")}
              className="w-full border p-2 rounded"
            >
              <option value="bangla">Bangla</option>
              <option value="english">English</option>
            </select>
            <select
              {...registerEdit("isCadet")}
              className="w-full border p-2 rounded"
            >
              <option value="false">General</option>
              <option value="true">Cadet</option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="w-full bg-gray-400 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateSubject;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
