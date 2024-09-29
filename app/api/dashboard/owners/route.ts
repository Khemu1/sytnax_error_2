import { NextRequest, NextResponse } from "next/server";
import { dashboardOwnersService } from "@/backendServices/dashboard";
import { errorHandler } from "@/middleware/CustomError";
export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("User-Id") as string;
    const data = await dashboardOwnersService(+userId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
