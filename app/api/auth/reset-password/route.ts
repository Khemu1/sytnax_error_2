import { NextRequest, NextResponse } from "next/server";
import { CustomError, errorHandler } from "@/middleware/CustomError";
import { verifyPasswordResetToken } from "@/backendServices/jwtService";
import { resetPasswordService } from "@/backendServices/authService";

export const POST = async (req: NextRequest) => {
  try {
    const resetToken = req.cookies.get("passwordResetToken")!.value as string;
    const data = await req.json();
    const tokenData = await verifyPasswordResetToken(resetToken);

    if (
      !tokenData ||
      !tokenData.id ||
      isNaN(+tokenData.id) ||
      +tokenData.id < 1 ||
      !tokenData.token
    ) {
      throw new CustomError(
        "Invalid password reset token",
        400,
        "reset token",
        true
      );
    }

    await resetPasswordService(tokenData.token as string, data);
    req.cookies.clear();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
