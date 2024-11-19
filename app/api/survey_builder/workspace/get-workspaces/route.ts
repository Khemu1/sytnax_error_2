import { getWorkSpacesService } from "@/backendServices/survey_builder/workspaceService";
import { errorHandler } from "@/middleware/CustomError";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (req: NextRequest) => {
  try {
    const userId = req.headers.get("User-Id") as string;
    console.log(userId);
    const workspaces = await getWorkSpacesService(+userId);
    return NextResponse.json(workspaces);
  } catch (error) {
    errorHandler(error);
  }
};
