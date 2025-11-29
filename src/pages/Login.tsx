"use client";

export const dynamic = "force-dynamic";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout, setUser } from "@/redux/features/auth/authSlice";
import { verifyToken } from "@/utils/verifyToken";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetMeQuery } from "@/redux/features/user/userApi";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await login(data).unwrap();

      if (res.success && res.data?.data?.accessToken) {
        const user = verifyToken(res.data.data.accessToken);
        console.log("Logged in user:", user);

        dispatch(
          setUser({
            user: user,
            accessToken: res.data.data.accessToken,
          })
        );

        // Set cookies for middleware

        if (res.data.data.refreshToken) {
          document.cookie = `refreshToken=${res.data.data.refreshToken}; path=/; max-age=604800`; // 7 days
        }
        refetch();
        // if (needsPasswordChanged === true) {
        //   router.push("/dashboard/change-password");
        // }
        router.push(redirect);
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      // Show error message to user
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
    // URL params check করুন
    const redirectPath = searchParams?.get("redirect");
    const autoLogout = searchParams?.get("auto_logout");

    console.log("Redirect path:", redirectPath);
    console.log("Auto logout:", autoLogout);

    // যদি redirect path থাকে এবং auto_logout true হয়
    if (
      redirectPath &&
      redirectPath.includes("/dashboard") &&
      autoLogout === "true"
    ) {
      console.log("Dispatching logout due to session expiry...");
      dispatch(logout());

      // Clear any existing cookies
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Show notification to user
      setTimeout(() => {
        alert("Your session has expired. Please login again.");
      }, 100);
    }
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - School Info */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Gazipur Shaheen Cadet Academy
          </h1>
          <p className="text-lg opacity-90">Mymensingh, Bangladesh</p>
          <p className="max-w-md mx-auto text-sm opacity-80 leading-relaxed">
            Welcome to our digital campus. Access your school account to check
            attendance, results, and important updates. Let`s continue the
            pursuit of excellence together.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Student Login
          </h2>

          {/* Server Error Message */}
          {errors.root && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Student ID */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Student ID
              </label>
              <input
                type="text"
                {...register("id", {
                  required: "Student ID is required",
                })}
                placeholder="Enter your student ID"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              {errors.id && (
                <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <>
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
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Demo Credentials (Optional) */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-blue-600">
              ID: student123 | Password: 123456
            </p>
          </div>

          {/* Footer Text */}
          <p className="text-center text-gray-500 text-sm mt-6">
            © {new Date().getFullYear()} Gazipur Shaheen Cadet Academy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
export async function getServerSideProps() {
  return {
    props: {}, // Page will render only on client
  };
}
