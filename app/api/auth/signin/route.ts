import { NextRequest, NextResponse } from "next/server";
import {
  accessCookieOptions,
  generateAccessTokens,
  generateRefreshTokens,
  refreshCookieOptions,
} from "@/backendServices/jwtService";
import { errorHandler } from "@/middleware/CustomError";
import { SignInProps } from "@/types";
import { signInService } from "@/backendServices/authService";
export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as SignInProps;
    console.log("body", body);
    const user = await signInService(body);

    const token = await generateAccessTokens({
      id: user.id,
      role: user.role,
      username: user.username,
      groupMemebers: user.groupMemebers,
      groupId: user.userOwnGroup,
    });
    const refreshToken = await generateRefreshTokens({
      id: user.id,
      role: user.role,
      username: user.username,
      groupMemebers: user.groupMemebers,
      groupId: user.userOwnGroup,
    });

    const response = NextResponse.json(
      {
        userId: user.id,
        role: user.role,
        username: user.username,
      },
      { status: 200 }
    );

    response.cookies.set("access_token", token, accessCookieOptions);
    response.cookies.set("refresh_token", refreshToken, refreshCookieOptions);
    return response;
  } catch (error) {
    return errorHandler(error);
  }
};
