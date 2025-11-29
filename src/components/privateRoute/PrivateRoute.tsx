"use client";

import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { useAppSelector } from "@/redux/hook";
import { TCurrentUser } from "@/types/index.type";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const { data } = useGetMeQuery(undefined);
  const currentUserData: TCurrentUser = data?.data?.data;
  const needsPasswordChanged = currentUserData?.user?.needsPasswordChanged;

  useEffect(() => {
    if (needsPasswordChanged === true) {
      router.push("/dashboard/change-password");
      return; // Early return to prevent further execution
    }

    if (!currentUser && !data) {
      // Get the current path to redirect back after login
      let currentPath = window.location.pathname + window.location.search;

      // Remove change-password from redirect URL if present
      if (currentPath.includes("/dashboard/change-password")) {
        currentPath = currentPath.replace(
          "/dashboard/change-password",
          "/dashboard"
        );
      }

      // Only redirect to login if we're not already on login page
      if (!currentPath.includes("/login")) {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [currentUser, router, needsPasswordChanged, data]);

  console.log(data);

  // Show loading state or nothing while checking authentication
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
