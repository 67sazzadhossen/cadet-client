"use client";
import CreateForm from "@/components/CreateForm/CreateForm";
import { useGetAllAdmisQuery } from "@/redux/features/admin/adminApi";
import React from "react";

const CreateAdmin = () => {
  const { data, refetch } = useGetAllAdmisQuery(undefined);
  console.log(data);
  return (
    <div>
      <CreateForm
        loading={false}
        route="create-admin"
        refetch={refetch}
        heading="Add new admin"
      />
    </div>
  );
};

export default CreateAdmin;

export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
