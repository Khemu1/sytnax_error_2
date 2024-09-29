import { NextRequest, NextResponse } from "next/server";
import {
  dashboardEditMyAccount,
  dashboardMyDataService,
} from "@/backendServices/dashboard";
import { errorHandler } from "@/middleware/CustomError";
import { EditMyAccountProps } from "@/types";
export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("User-Id") as string;
    const data = await dashboardMyDataService(+userId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const data = (await req.json()) as EditMyAccountProps;
    const userId = req.headers.get("User-Id") as string;

    const newInfo = await dashboardEditMyAccount(data, +userId);
    return NextResponse.json(newInfo, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
};
