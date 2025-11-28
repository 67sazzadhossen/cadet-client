"use client";

import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import PublicProfile from "@/components/PublicProfileCompoent/PublicProfile";
import { useGetPublicUserQuery } from "@/redux/features/user/userApi";
import React from "react";

const PublicProfilePage = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetPublicUserQuery(id);
  const userData = data?.data?.data;

  if (isLoading) {
    return <LoadingAnimation />;
  }
  return (
    <div>
      <PublicProfile userData={userData} />
    </div>
  );
};

export default PublicProfilePage;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
