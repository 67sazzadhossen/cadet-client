"use client";

export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout, setUser } from "@/redux/features/auth/authSlice";
import { verifyToken } from "@/utils/verifyToken";
import { useRouter, useSearchParams } from "next/navigation";
import logo from "@/assets/logo.png";

import { FaEye, FaEyeSlash, FaUser, FaLock, FaShieldAlt } from "react-icons/fa";
import { useGetMeQuery } from "@/redux/features/user/userApi";

import Link from "next/link";
import Image from "next/image";

type LoginFormInputs = {
  id: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/dashboard";
  const dispatch = useDispatch();
  const { refetch } = useGetMeQuery(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setIsAnimating(true);
      const res = await login(data).unwrap();

      if (res.success && res.data?.data?.accessToken) {
        const user = verifyToken(res.data.data.accessToken);

        dispatch(
          setUser({
            user: user,
            accessToken: res.data.data.accessToken,
          })
        );

        // Set cookies for middleware
        if (res.data.data.refreshToken) {
          document.cookie = `refreshToken=${res.data.data.refreshToken}; path=/; max-age=604800`;
        }
        refetch();

        // Success animation delay
        setTimeout(() => {
          router.push(redirect);
        }, 1000);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setIsAnimating(false);

      if (error?.data?.message) {
        setError("root", {
          type: "server",
          message: error.data.message,
        });
      } else {
        setError("root", {
          type: "server",
          message: "Login failed. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    const redirectPath = searchParams?.get("redirect");
    const autoLogout = searchParams?.get("auto_logout");

    if (
      redirectPath &&
      redirectPath.includes("/dashboard") &&
      autoLogout === "true"
    ) {
      dispatch(logout());
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setTimeout(() => {
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-slideIn";
        notification.innerHTML = `
          <div class="flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span>Your session has expired. Please login again.</span>
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.classList.add("animate-fadeOut");
          setTimeout(() => notification.remove(), 500);
        }, 3000);
      }, 300);
    }
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Floating Shapes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Left Section - Animated Hero */}
      <div className="flex-1 hidden  md:flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <div className="max-w-lg w-full space-y-8">
          {/* School Logo/Icon */}
          <div className="flex flex-col items-center mb-8">
            <Link
              href={"/"}
              className="flex items-center gap-3 group cursor-pointer"
            >
              {/* Main Logo - Fixed */}
              <div className="relative">
                <div className="h-24 w-24 ">
                  <Image
                    src={logo}
                    alt="Gazipur Shaheen Cadet Academy Logo"
                    width={200}
                    height={200}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col">
                {/* Main Title */}
                <div className="flex flex-col leading-tight">
                  <span className="md:text-4xl font-bold text-gray-900 tracking-wide">
                    GAZIPURSHAHEEN
                  </span>
                  <span className="md:text-xl font-semibold text-blue-800 tracking-wider uppercase">
                    Cadet Academy
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Secure Access</h3>
                  <p className="text-sm text-gray-600">
                    Enterprise-grade security for your academic data
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Real-time Updates
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get instant notifications on grades and attendance
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Performance Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Track your academic progress with detailed insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">500+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-700">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Modern Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200/50">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
                <span className="block text-lg font-normal text-gray-600 mt-1">
                  Enter your credentials to continue
                </span>
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <FaShieldAlt className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-500">
                  Secure Login Portal
                </span>
              </div>
            </div>

            {/* Server Error Message */}
            {errors.root && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl animate-shake">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-600 font-medium">
                    {errors.root.message}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Student ID Input */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaUser className="w-4 h-4 mr-2 text-blue-600" />
                  ID NO
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    {...register("id", {
                      required: "Student ID is required",
                    })}
                    placeholder="Enter your student ID"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 group-hover:border-blue-300"
                    disabled={isLoading || isAnimating}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">ID</span>
                    </div>
                  </div>
                </div>
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.id.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaLock className="w-4 h-4 mr-2 text-blue-600" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="Enter your password"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 pr-12 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 group-hover:border-blue-300"
                    disabled={isLoading || isAnimating}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isAnimating}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${
                    isAnimating
                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl"
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </div>
                ) : isAnimating ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Success! Redirecting...
                  </div>
                ) : (
                  "Login to Dashboard"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Contact Support
                </a>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                © {new Date().getFullYear()} Gazipurshaheen Cadet Academy
                Mymensingh. All rights reserved.
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="hidden lg:block absolute bottom-4 right-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-fadeOut {
          animation: fadeOut 0.5s ease-in forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
