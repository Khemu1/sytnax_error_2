import { NextRequest, NextResponse } from "next/server";

import { errorHandler } from "@/middleware/CustomError";
import { sendEmailService } from "@/backendServices/authService";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    await sendEmailService(data);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
