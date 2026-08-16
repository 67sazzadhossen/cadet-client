"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  useGetTeachersQuery,
  useResetTeacherPasswordMutation,
  useUpdateTeacherMutation,
} from "@/redux/features/teachers/teacherApi";

const EditTeacherProfile = ({ teacherId }: { teacherId: string }) => {
  const router = useRouter();
  const { data } = useGetTeachersQuery(undefined);
  const teacher = data?.data?.data?.find((item: any) => item.id === teacherId);
  const [updateTeacher, { isLoading }] = useUpdateTeacherMutation();
  const [resetPassword, { isLoading: resetting }] = useResetTeacherPasswordMutation();
  const [form, setForm] = useState<any>();

  if (!teacher) return <div className="p-6">Teacher not found.</div>;
  const values = form || {
    designation: teacher.designation || "",
    qualification: teacher.qualification || "",
    subjects: (teacher.subjects || []).join(", "),
    mobile: teacher.contact?.mobile || "",
    whatsapp: teacher.contact?.whatsapp || "",
  };
  const setValue = (key: string, value: string) => setForm({ ...values, [key]: value });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateTeacher({ id: teacherId, designation: values.designation, qualification: values.qualification, subjects: values.subjects.split(",").map((item: string) => item.trim()).filter(Boolean), contact: { ...teacher.contact, mobile: values.mobile, whatsapp: values.whatsapp } }).unwrap();
    toast.success("Teacher profile updated");
    router.back();
  };

  const reset = async () => {
    const result = await resetPassword(teacherId).unwrap();
    toast.success(`Password reset to: ${result.data.data.defaultPassword}`);
  };

  return <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 p-6">
    <h1 className="text-2xl font-bold">Edit Teacher Profile</h1>
    {(["designation", "qualification", "subjects", "mobile", "whatsapp"] as const).map((key) => <label key={key} className="block"><span className="mb-1 block capitalize">{key}</span><input className="w-full rounded border p-2" value={values[key]} onChange={(event) => setValue(key, event.target.value)} /></label>)}
    <div className="flex gap-3"><button disabled={isLoading} className="rounded bg-blue-600 px-4 py-2 text-white">Save changes</button><button type="button" disabled={resetting} onClick={reset} className="rounded bg-amber-600 px-4 py-2 text-white">Reset default password</button></div>
  </form>;
};

export default EditTeacherProfile;
