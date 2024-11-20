import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CustomError, errorHandler } from "@/middleware/CustomError";
import {
  accessCookieOptions,
  generateAccessTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../../../backendServices/jwtService";

export const POST = async () => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      throw new CustomError(
        "No tokens provided",
        401,
        "authentication controller",
        true,
        "Please log in."
      );
    } else if (accessToken) {
      const accessTokenData = await verifyAccessToken(accessToken);

      if (
        !accessTokenData ||
        typeof accessTokenData.id !== "number" ||
        typeof accessTokenData.role !== "number" ||
        typeof accessTokenData.username !== "string" ||
        typeof accessTokenData.groupId !== "string" ||
        !Array.isArray(accessTokenData.groupMemebers)
      ) {
        throw new CustomError(
          "Invalid access token",
          401,
          "authentication error",
          true,
          "Access token is invalid or expired."
        );
      }

      return NextResponse.json({
        id: accessTokenData.id,
        role: accessTokenData.role,
        username: accessTokenData.username,
        groupMemebers: accessTokenData.groupMemebers,
        groupId: accessTokenData.groupId,
      });
    } else if (!accessToken && refreshToken) {
      const refreshTokenData = await verifyRefreshToken(refreshToken);

      if (
        !refreshTokenData ||
        typeof refreshTokenData.id !== "number" ||
        typeof refreshTokenData.role !== "number" ||
        typeof refreshTokenData.username !== "string" ||
        typeof refreshTokenData.groupId !== "string" ||
        !Array.isArray(refreshTokenData.groupMemebers)
      ) {
        throw new CustomError(
          "Invalid refresh token or its data",
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
        groupId: refreshTokenData.groupId,
        groupMemebers: refreshTokenData.groupMemebers,
      });

      const response = NextResponse.json({
        id: refreshTokenData.id,
        role: refreshTokenData.role,
        username: refreshTokenData.username,
        groupMemebers: refreshTokenData.groupMemebers,
        groupId: refreshTokenData.groupId,
      });

      response.cookies.set("access_token", newAccessToken, accessCookieOptions);

      return response;
    }
  } catch (error) {
    return errorHandler(error);
  }
};

export const DELETE = () => {
  try {
    const response = NextResponse.json({ message: "Sign out successful" });

    response.cookies.set("access_token", "", { expires: new Date(0) });
    response.cookies.set("refresh_token", "", { expires: new Date(0) });

    return response;
  } catch (error) {
    return errorHandler(error);
  }
};
