import { NextResponse } from "next/server";
import { dashboardCoursesService } from "@/backendServices/dashboard";
import { errorHandler } from "@/middleware/CustomError";
export const GET = async () => {
  try {
    const data = await dashboardCoursesService();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
