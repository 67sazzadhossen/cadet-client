"use client";

import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect");

  useEffect(() => {
    if (!currentUser) {
      // Get the current path to redirect back after login
      const currentPath = window.location.pathname + window.location.search;

      // Only redirect to login if we're not already on login page
      if (!currentPath.includes("/login")) {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [currentUser, router]);

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
