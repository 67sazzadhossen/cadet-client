"use client";

import {
  useGetDeletedTeachersQuery,
  usePermanentlyDeleteTeacherMutation,
  useRestoreTeacherMutation,
} from "@/redux/features/teachers/teacherApi";
import { toast } from "react-hot-toast";

const RecycleBin = () => {
  const { data, isLoading, refetch } = useGetDeletedTeachersQuery(undefined);
  const [restore] = useRestoreTeacherMutation();
  const [permanentlyDelete] = usePermanentlyDeleteTeacherMutation();
  const teachers = data?.data?.data || [];

  const restoreTeacher = async (id: string) => {
    await restore(id).unwrap();
    toast.success("Teacher restored");
    refetch();
  };

  const deleteForever = async (id: string) => {
    if (!window.confirm("This permanently removes the teacher and cannot be undone. Continue?")) return;
    await permanentlyDelete(id).unwrap();
    toast.success("Teacher permanently deleted");
    refetch();
  };

  if (isLoading) return <div className="p-6">Loading recycle bin...</div>;

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Recycle Bin</h1>
      <p className="text-gray-600">Deleted teachers remain recoverable until permanently removed.</p>
      {teachers.map((teacher: any) => (
        <div key={teacher.id} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
          <div>
            <p className="font-semibold">{teacher.name?.englishName || teacher.id}</p>
            <p className="text-sm text-gray-500">{teacher.id} · {teacher.contact?.email || "No email"}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded bg-green-600 px-3 py-2 text-white" onClick={() => restoreTeacher(teacher.id)}>Restore</button>
            <button className="rounded bg-red-600 px-3 py-2 text-white" onClick={() => deleteForever(teacher.id)}>Delete permanently</button>
          </div>
        </div>
      ))}
      {!teachers.length && <p className="rounded border p-6 text-gray-500">Recycle bin is empty.</p>}
    </section>
  );
};

export default RecycleBin;
