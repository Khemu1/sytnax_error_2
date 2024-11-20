import { jwtVerify, SignJWT } from "jose";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { CustomError } from "@/middleware/CustomError";

export const accessCookieOptions: Partial<ResponseCookie> = {
  maxAge: parseInt(process.env.ACCESS_COOKIE_TIME as string), // 1 hour in seconds
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const refreshCookieOptions: Partial<ResponseCookie> = {
  maxAge: parseInt(process.env.REFRESH_COOKIE_TIME as string), // 7 days in seconds
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const resetPasswordCookieOptions = (
  maxAge: number
): Partial<ResponseCookie> => ({
  maxAge,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});

const accessSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET
);
const resetPasswordSecret = new TextEncoder().encode(
  process.env.RESET_PASSWORD_SECERT
);

export const generateAccessTokens = async (user: {
  id: number;
  role: number;
  username: string;
  groupId: string;
  groupMemebers: number[];
}) => {
  try {
    const jwt = await new SignJWT({
      id: user.id,
      role: user.role,
      username: user.username,
      groupId: user.groupId,
      groupMemebers: user.groupMemebers,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.ACCESS_TOKEN_TIME as string)
      .setIssuedAt()
      .sign(accessSecret);

    return jwt;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "An error occurred while generating refresh token ",
      500,
      "token",
      true
    );
  }
};

export const generateRefreshTokens = async (user: {
  id: number;
  role: number;
  username: string;
  groupId: string;
  groupMemebers: number[];
}) => {
  try {
    const jwt = await new SignJWT({
      id: user.id,
      role: user.role,
      username: user.username,
      groupId: user.groupId,
      groupMemebers: user.groupMemebers,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(process.env.REFRESH_TOKEN_TIME as string)
      .setIssuedAt()
      .sign(refreshSecret);

    return jwt;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "An error occurred while generating refresh token ",
      500,
      "token",
      true
    );
  }
};

export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, accessSecret);
    return payload;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "An error occurred while veryfing access token: ",
      500,
      "token",
      true
    );
  }
};

export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "An error occurred while veryfing refresh token: ",
      500,
      "token",
      true
    );
  }
};

export const generatePasswordResetToken = async (user: {
  id: number;
  token: string;
}) => {
  try {
    const expirationTime = process.env.PASSWORD_RESET_TIME?.toString();
    console.error(expirationTime);

    if (!expirationTime) {
      throw new CustomError("Expiration time is not set", 500, "token", true);
    }

    const jwt = await new SignJWT({
      id: user.id,
      token: user.token,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expirationTime)
      .setIssuedAt()
      .sign(resetPasswordSecret);

    return jwt;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "An error occurred while generating the password reset token",
      500,
      "token",
      true
    );
  }
};

export const generatePasswordResetTokenForEmail = async (user: {
  id: number;
}) => {
  try {
    const expirationTime = process.env.PASSWORD_RESET_TIME?.toString();
    if (!expirationTime) {
      throw new CustomError("Expiration time is not set", 500, "token", true);
    }

    const jwt = await new SignJWT({
      id: user.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expirationTime)
      .setIssuedAt()
      .sign(resetPasswordSecret);

    return jwt;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "An error occurred while generating the password reset token",
      500,
      "token",
      true
    );
  }
};

export const verifyPasswordResetToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, resetPasswordSecret);
    return payload;
  } catch (error) {
    console.error(error);
    throw new CustomError(
      "An error occurred while verifying the password reset token",
      500,
      "token",
      true
    );
  }
};
