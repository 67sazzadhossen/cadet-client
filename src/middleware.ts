import { NextResponse, NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("🔄 Middleware - Refresh Token:", refreshToken);

  console.log("refresh token in vercel : ", refreshToken);

  // যদি refreshToken না থাকে就直接 login এ redirect
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    console.log("Verification status:", response.status);

    // Token valid হলে access allow করুন
    if (response.status === 200) {
      return NextResponse.next();
    }

    // Token invalid হলে logout process শুরু করুন
    return await handleLogout(request);
  } catch (error) {
    console.error("Middleware error:", error);
    return await handleLogout(request);
  }
};

// Logout handle করার function
async function handleLogout(request: NextRequest) {
  try {
    // Backend logout call করুন
    const logoutResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend logout status:", logoutResponse.status);
  } catch (error) {
    console.error("Backend logout failed:", error);
  }

  // Frontend cookies clear করুন
  const redirectUrl = new URL("/login", request.url);
  redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
  redirectUrl.searchParams.set("auto_logout", "true"); // Frontend কে signal

  const response = NextResponse.redirect(redirectUrl);

  // Cookies delete করুন
  response.cookies.delete("refreshToken");
  response.cookies.delete("accessToken");

  return response;
}

// সরাসরি login এ redirect করার function
function redirectToLogin(request: NextRequest) {
  const redirectUrl = new URL("/login", request.url);
  redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
