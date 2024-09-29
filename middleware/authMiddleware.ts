import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  signInSchema,
  signUpSchema,
  updatedAdminSchemaBackend,
  updateMyAccountBackend,
  validateEmailSchema,
  validatePasswordSchema,
  validateRestTokenSchema,
  validateWithSchema,
} from "@/utils/validations";
import { EditAdminProps, EditMyAccountProps } from "@/types";
import { ZodError } from "zod";
import { CustomError } from "./CustomError";
import { accessCookieOptions, generateAccessTokens, verifyAccessToken, verifyRefreshToken } from "@/backendServices/jwtService";

export const authenticateUser = async () => {
  try {
    const cookieStore = cookies();

    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!accessToken && !refreshToken) {
      throw new CustomError(
        "No tokens provided",
        401,
        "authentication error",
        true,
        "Please log in."
      );
    }

    if (accessToken) {
      const accessTokenData = await verifyAccessToken(accessToken);
      if (
        !accessTokenData ||
        typeof accessTokenData.id !== "number" ||
        typeof accessTokenData.role !== "number" ||
        typeof accessTokenData.username !== "string"
      ) {
        throw new CustomError(
          "Invalid access token",
          401,
          "authentication error",
          true,
          "Access token is invalid or expired."
        );
      }

      const response = NextResponse.next();
      response.headers.set("User-Id", accessTokenData.id.toString());
      response.headers.set("User-Role", accessTokenData.role.toString());

      return response;
    }

    if (!accessToken && refreshToken) {
      const refreshTokenData = await verifyRefreshToken(refreshToken);
      if (
        !refreshTokenData ||
        typeof refreshTokenData.id !== "number" ||
        typeof refreshTokenData.role !== "number" ||
        typeof refreshTokenData.username !== "string"
      ) {
        throw new CustomError(
          "Invalid refresh token",
          401,
          "authentication error",
          true,
          "Refresh token is invalid or expired."
        );
      }

      const newAccessToken = await generateAccessTokens({
        id: refreshTokenData.id,
        role: refreshTokenData.role,
        username: refreshTokenData.username,
      });

      const response = NextResponse.next();
      response.cookies.set(
        "refresh_token",
        newAccessToken,
        accessCookieOptions
      );
      // response.cookies.set("User-Id", refreshTokenData.id as string);
      response.headers.set("User-Id", refreshTokenData.id.toString());
      response.headers.set("User-Role", refreshTokenData.role.toString());

      return response;
    }

    throw new CustomError(
      "User validation failed",
      500,
      "Unknown error occurred."
    );
  } catch (error) {
    throw error;
  }
};

export const signIn = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const schema = signInSchema;
    schema.parse(body);
    return NextResponse.next();
  } catch (error) {
    const validationErrors = validateWithSchema(error);

    const err = new CustomError(
      "Validation Error",
      400,
      "middleware",
      false,
      "There were errors with the submitted data.",
      validationErrors
    );
    throw err;
  }
};

export const checkAdminData = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  try {
    const userId = authUser.headers.get("User-Id") as string;
    const userRole = authUser.headers.get("User-Role") as string;
    const body = await req.json();
    const schema = signUpSchema;
    schema.parse(body);
    const response = NextResponse.next();
    response.headers.set("User-Id", userId);
    response.headers.set("User-Role", userRole);
    return response;
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    const err = new CustomError(
      "Validation Error",
      400,
      "middleware",
      false,
      "There were errors with the submitted data.",
      validationErrors
    );
    throw err;
  }
};
export const checkAdminForEdit = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  try {
    const userId = authUser.headers.get("User-Id") as string;
    const userRole = authUser.headers.get("User-Role") as string;
    const body = (await req.json()) as { admin: EditAdminProps; id: number };
    if (!body || isNaN(+body.id) || !body.admin) {
      throw new CustomError("Invalid data", 400, "validation error");
    }
    const schema = updatedAdminSchemaBackend();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actualValues: Record<string, any> = {};
    for (const [key, value] of Object.entries(body.admin)) {
      if (value !== null && value !== undefined && value.trim().length !== 0) {
        actualValues[key] = value;
      }
    }
    schema.parse(actualValues);
    const response = NextResponse.next();
    response.headers.set("User-Id", userId);
    response.headers.set("User-Role", userRole);
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = validateWithSchema(error);
      const err = new CustomError(
        "Validation Error",
        400,
        "middleware",
        false,
        "There were errors with the submitted data.",
        validationErrors
      );
      throw err;
    }
    throw error;
  }
};
export const checkDashBoardRoles = async (authUser: NextResponse) => {
  const userId = authUser.headers.get("User-Id") as string;
  const userRole = authUser.headers.get("User-Role");

  if (isNaN(+userId) || (userRole !== "1" && userRole !== "2")) {
    throw new CustomError("Unauthorized user", 401, "No access", true);
  }
  const response = NextResponse.next();
  response.headers.set("User-Id", userId);
  response.headers.set("User-Role", userRole);
  return response;
};

export const checkOwnerRole = async (authUser: NextResponse) => {
  const userId = authUser.headers.get("User-Id") as string;
  const userRole = authUser.headers.get("User-Role");

  if (isNaN(+userId) || userRole !== "1") {
    throw new CustomError("Unauthorized user", 401, "No access", true);
  }
  const response = NextResponse.next();
  response.headers.set("User-Id", userId);
  response.headers.set("User-Role", userRole);
  return response;
};

export const validateDashBoardAccountEdit = async (
  req: NextRequest,
  authUser: NextResponse
) => {
  try {
    const userId = authUser.headers.get("User-Id") as string;

    const schema = updateMyAccountBackend();
    const body = (await req.json()) as EditMyAccountProps;

    const actualValues: Record<string, string> = {};

    for (const [key, value] of Object.entries(body)) {
      if (value !== null && value !== undefined && value.trim().length !== 0) {
        actualValues[key] = value;
      }
    }
    schema.parse(body);
    const response = NextResponse.next();
    response.headers.set("User-Id", userId);
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = validateWithSchema(error);
      throw new CustomError(
        "Validation Error",
        400,
        "middleware",
        false,
        "There were errors with the submitted data.",
        validationErrors
      );
    }
    throw error;
  }
};

export const validateEmail = async (req: NextRequest) => {
  try {
    const data = await req.json();
    if (!data) {
      throw new CustomError("Invalid request", 400, "validation error");
    }
    const schema = validateEmailSchema();
    schema.parse({ email: data });
    return NextResponse.next();
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    throw new CustomError(
      "Validation Error",
      400,
      "middleware",
      false,
      "There were errors with the submitted data.",
      validationErrors
    );
  }
};

export const validatePassword = async (req: NextRequest) => {
  try {
    const resetToken = req.cookies.get("passwordResetToken")?.value;
    const data = await req.json();
    if (!data || !resetToken) {
      throw new CustomError("Invalid request", 400, "validation error");
    }
    const schema = validatePasswordSchema();
    return NextResponse.next();
    schema.parse({ newPassword: data });
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    throw new CustomError(
      "Validation Error",
      400,
      "middleware",
      false,
      "There were errors with the submitted data.",
      validationErrors
    );
  }
};

export const validateResetToken = async (req: NextRequest) => {
  try {
    const data = await req.json();
    if (!data) {
      throw new CustomError("Invalid request", 400, "validation error");
    }
    const schema = validateRestTokenSchema();
    schema.parse({ restToken: data });
    return NextResponse.next();
  } catch (error) {
    const validationErrors = validateWithSchema(error);
    throw new CustomError(
      "Validation Error",
      400,
      "middleware",
      false,
      "There were errors with the submitted data.",
      validationErrors
    );
  }
};

