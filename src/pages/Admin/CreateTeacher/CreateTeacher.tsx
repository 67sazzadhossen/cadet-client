"use client";

import CreateForm from "@/components/CreateForm/CreateForm";
import { useGetTeachersQuery } from "@/redux/features/teachers/teacherApi";
import React from "react";

const CreateTeacher = () => {
  const { refetch, isLoading } = useGetTeachersQuery(undefined);

  return (
    <div>
      <CreateForm
        heading="Teacher"
        route="create-teacher"
        refetch={refetch}
        loading={isLoading}
      />
    </div>
  );
};

export default CreateTeacher;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
