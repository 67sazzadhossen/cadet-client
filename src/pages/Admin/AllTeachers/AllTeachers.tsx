"use client";

import {
  useDeleteTeacherByIdMutation,
  useGetTeachersQuery,
} from "@/redux/features/teachers/teacherApi";
import Link from "next/link";

import Table from "@/components/shared/Table";
import { FiPlus } from "react-icons/fi";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { TTeacher } from "@/types/index.type";

const AllTeachers = () => {
  const {
    data: teachersResponse,
    isLoading,
    error,
    refetch,
  } = useGetTeachersQuery(undefined);
  const [deleteTeacher, { isLoading: deleteLoading }] =
    useDeleteTeacherByIdMutation();

  const teachers: TTeacher[] = teachersResponse?.data?.data || [];

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <div>
          <span>Error loading teachers. Please try again.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Teachers</h1>
        <Link href="/dashboard/create-teacher" className="btn btn-primary">
          <FiPlus className="w-4 h-4 mr-2" />
          Add New Teacher
        </Link>
      </div>

      <Table
        data={teachers}
        refetch={refetch}
        deleteUser={deleteTeacher}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default AllTeachers;
