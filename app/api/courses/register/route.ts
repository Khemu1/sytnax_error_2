import { registerToCourseService } from "@/backendServices/courseService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    await registerToCourseService(data);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
