"use client";

import { useGetMeQuery } from "@/redux/features/user/userApi";
import { TCurrentUser } from "@/types/index.type";
import React from "react";
import ShowProfile from "@/components/shared/ShowProfile";

const Profile = () => {
  const { data, isLoading } = useGetMeQuery(undefined);
  const currentUserData: TCurrentUser = data?.data?.data;

  return (
    <div>
      <ShowProfile data={currentUserData} loading={isLoading} />
    </div>
  );
};

export default Profile;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
