"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import ShowProfile from "@/components/shared/ShowProfile";
import { useGetSingleTeacherForPublicQuery } from "@/redux/features/teachers/teacherApi";
import React from "react";

const TeacherProfile = ({ teacherId }: { teacherId: string }) => {
  console.log(teacherId);
  const { data, isLoading } = useGetSingleTeacherForPublicQuery(teacherId);
  const teacherData = data?.data?.data;
  if (isLoading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  }
  return (
    <div className="lg:max-w-10/12 mx-auto p-4">
      <ShowProfile data={teacherData} loading={isLoading} />
    </div>
  );
};

export default TeacherProfile;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
