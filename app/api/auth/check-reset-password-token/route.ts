import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "../../../../middleware/CustomError";
import { getTokenService } from "../../../../backendServices/tokenService";
import {
  generatePasswordResetToken,
  resetPasswordCookieOptions,
  verifyPasswordResetToken,
} from "@/backendServices/jwtService";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { userId, expiresAt, token } = await getTokenService(data);
    await verifyPasswordResetToken(token);
    const maxAgeInSeconds = Math.max(
      0,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    );
    const options = resetPasswordCookieOptions(maxAgeInSeconds);
    const stoken = await generatePasswordResetToken({
      id: userId,
      token: token,
    });
    const response = NextResponse.json({ status: 200 });

    response.cookies.set("passwordResetToken", stoken, options);
    return response;
  } catch (error) {
    return errorHandler(error);
  }
};
