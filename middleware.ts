import { NextRequest, NextResponse } from "next/server";
import { CustomError, errorHandler } from "./middleware/CustomError";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import {
  authenticateUser,
  checkAdminData,
  checkAdminForEdit,
  checkDashBoardRoles,
  checkOwnerRole,
  signIn,
  validateDashBoardAccountEdit,
  validateEmail,
  validatePassword,
  validateResetToken,
} from "@/middleware/authMiddleware";
import {
  checkDeletionIds,
  validateCourseForEdit,
  validateNewCourse,
  vlidateCourseRegister,
} from "@/middleware/courseMiddleware";

// Initialize rate limiter for general requests
const rateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(60, "1s"), // 60 requests per minute for general API calls
});

// Initialize rate limiter for login attempts
const loginRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "60s"), // 5 login attempts per minute
});

// Helper function to check rate limits for general requests
const checkRateLimit = async (req: NextRequest) => {
  const ip = req.ip ?? "127.0.0.1";
  const { remaining } = await rateLimit.limit(ip);
  if (remaining === 0) {
    throw new CustomError("Too many requests", 429, "", true, "", {
      message: "Too many requests, try again later",
    });
  }
};

// Helper function to check rate limits for login attempts
const checkLoginRateLimit = async (req: NextRequest) => {
  const ip = req.ip ?? "127.0.0.1";
  const { remaining } = await loginRateLimit.limit(ip);
  if (remaining === 0) {
    throw new CustomError("Too many login attempts", 429, "", true, "", {
      message: "Too many login attempts, please try again later.",
    });
  }
};

// Handle /api/courses routes
const handleCoursesRoute = async (req: NextRequest) => {
  const method = req.method;
  const { pathname } = req.nextUrl;

  if (method === "GET") {
    return NextResponse.next();
  }
  if (pathname === "/api/courses/register") {
    return await vlidateCourseRegister(req);
  }

  const authUser = await authenticateUser();
  if (method === "POST") {
    const checkRoleForPost = await checkDashBoardRoles(authUser);
    return await validateNewCourse(req, checkRoleForPost);
  } else if (method === "DELETE") {
    const checkRole = await checkOwnerRole(authUser);
    return await checkDeletionIds(req, checkRole);
  } else if (method === "PUT") {
    await checkDashBoardRoles(authUser);
    return await validateCourseForEdit(req);
  }

  // Fallback if method does not match
  return NextResponse.next();
};

// Handle /api/auth routes
const handleAuthRoutes = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  if (pathname === "/api/auth/auth-user") {
    return NextResponse.next();
  }
  if (pathname === "/api/auth/signin") {
    await checkLoginRateLimit(req);
    return signIn(req);
  } else if (pathname === "/api/auth/send-email") {
    return await validateEmail(req);
  } else if (pathname === "/api/auth/check-reset-password-token") {
    return await validateResetToken(req);
  } else if (pathname === "/api/auth/reset-password") {
    return await validatePassword(req);
  }
};

// Handle /api/dashboard routes
const handleDashboardRoutes = async (req: NextRequest) => {
  const authUser = await authenticateUser();
  const method = req.method;
  const { pathname } = req.nextUrl;

  // Check user role for all dashboard routes
  const checkRole = await checkOwnerRole(authUser);

  if (pathname.startsWith("/api/dashboard/courses")) {
    return checkRole;
  } else if (pathname.startsWith("/api/dashboard/admins")) {
    if (method === "DELETE") {
      return await checkDeletionIds(req, checkRole);
    } else if (method === "POST") {
      return await checkAdminData(req, checkRole);
    } else if (method === "PUT") {
      return await checkAdminForEdit(req, checkRole);
    }
  } else if (pathname === "/api/dashboard/myinfo") {
    const dashboardRoles = await checkDashBoardRoles(authUser);
    if (method === "PUT") {
      return await validateDashBoardAccountEdit(req, dashboardRoles); // Use roles for validation
    }
    return dashboardRoles;
  } else if (pathname.startsWith("/api/dashboard/owners")) {
    return checkRole;
  }
};

export async function middleware(req: NextRequest) {
  try {
    await checkRateLimit(req); // Check general rate limits
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/courses")) {
      return await handleCoursesRoute(req);
    } else if (pathname.startsWith("/api/auth")) {
      return await handleAuthRoutes(req);
    } else if (pathname.startsWith("/api/dashboard")) {
      return await handleDashboardRoutes(req);
    }

    return NextResponse.next();
  } catch (error) {
    return errorHandler(error);
  }
}

export const config = {
  matcher: ["/api/courses/:path*", "/api/auth/:path*", "/api/dashboard/:path*"],
};
